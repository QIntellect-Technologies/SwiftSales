const express = require('express');
const router = express.Router();
const { getEmbeddingService } = require('../services/embeddings');
const { getVectorSearch } = require('../services/vectorSearch');
const { getReRankingService } = require('../services/reRanker'); // Import ReRanker
const fs = require('fs-extra');
const path = require('path');
const { dbHelpers } = require('../database');
const { EMBEDDINGS_DIR, VECTORS_FILE } = require('../paths');

const { productService } = require('../services/productService');

// Initialize services on first request
let servicesInitialized = false;

async function initializeServices() {
    if (servicesInitialized) return;

    try {
        console.log('🔄 Initializing RAG services (Database Mode)...');

        // 1. Fetch Products from Supabase
        const products = await productService.getAllProducts();

        if (products.length > 0) {
            console.log(`📦 Loaded ${products.length} products into RAG system.`);

            // Load Supabase-compatible embeddings path from central config
            const vectorDbPath = EMBEDDINGS_DIR;
            const vectorPath = VECTORS_FILE;

            const embeddingService = getEmbeddingService();
            const vectorSearch = getVectorSearch();
            const reRanker = getReRankingService();

            // 2. Check/Build Embeddings
            let embeddings = [];
            try {
                if (await fs.pathExists(vectorPath)) {
                    console.log('📂 Loading cached embeddings...');
                    embeddings = await fs.readJson(vectorPath);

                    if (embeddings.length !== products.length) {
                        console.log('⚠️ Count mismatch. Rebuilding embeddings...');
                        embeddings = await embeddingService.embedBatch(products.map(p =>
                            `${p.name} ${p.generic_name || ''} ${p.description || ''} ${p.company || ''}`
                        ));
                        await fs.writeJson(vectorPath, embeddings);
                    }
                } else {
                    console.log('⚡ Generating new embeddings...');
                    embeddings = await embeddingService.embedBatch(products.map(p =>
                        `${p.name} ${p.generic_name || ''} ${p.description || ''} ${p.company || ''}`
                    ));
                    await fs.writeJson(vectorPath, embeddings);
                }

                // 3. Initialize Vector Search with Supabase Products
                await vectorSearch.initialize(vectorPath, products);
            } catch (err) {
                console.error('❌ Embedding generation/loading failed:', err.message);
                console.warn('⚠️ Vector search will be disabled. System will fallback to keyword search.');
            }

            // 4. Initialize Re-Ranker
            await reRanker.initialize();

            // Load Global Product Details (if needed)
            const productDetailsPath = path.join(__dirname, '../../src/data/productDetails.json');
            if (await fs.pathExists(productDetailsPath)) {
                try {
                    global.productDetails = await fs.readJson(productDetailsPath);
                } catch (e) {
                    console.warn('⚠️ Could not load productDetails.json:', e.message);
                }
            }

            console.log('✅ RAG services initialized (ProductService)');
            servicesInitialized = true;
        } else {
            console.warn('⚠️ No products found in Database.');
        }

    } catch (error) {
        console.error('❌ Error initializing RAG services:', error);
    }
}

router.post('/query', async (req, res) => {
    try {
        await initializeServices();

        const { query, context = {}, sessionId } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        // Fetch chat history and persistent cart if sessionId is provided
        if (sessionId) {
            try {
                const history = await dbHelpers.getChatHistory(sessionId);
                // Keep last 30 messages for full order context
                context.chatHistory = history.slice(-30);

                // ALWAYS load and merge persisted session data (customer details, cart etc.)
                const persistentContext = await dbHelpers.getCart(sessionId);
                if (persistentContext && typeof persistentContext === 'object') {
                    if (!context.customer_name && persistentContext.customer_name)
                        context.customer_name = persistentContext.customer_name;
                    if (!context.customer_phone && persistentContext.customer_phone)
                        context.customer_phone = persistentContext.customer_phone;
                    if (!context.delivery_address && persistentContext.delivery_address)
                        context.delivery_address = persistentContext.delivery_address;
                    if (!context.cart || context.cart.length === 0)
                        context.cart = persistentContext.cart || [];
                    if (!context.cart_total)
                        context.cart_total = persistentContext.cart_total || 0;
                    if (persistentContext.orderPlaced)
                        context.orderPlaced = persistentContext.orderPlaced;
                    console.log(`[SESSION] Merged DB context. customer_name=${context.customer_name}, phone=${context.customer_phone}, addr=${context.delivery_address}`);
                }

                // CUSTOMER DETAIL RECOVERY FROM CHAT HISTORY:
                // If customer details are still missing, scan the last 20 user messages
                // to extract name/phone/address. This handles the case where the LLM
                // confirmed details conversationally but never emitted COLLECT_CUSTOMER_INFO.
                if (!context.customer_name || !context.customer_phone || !context.delivery_address) {
                    const recentUserMsgs = context.chatHistory
                        .filter(m => m.sender === 'user')
                        .slice(-20)
                        .map(m => m.message_text || '');

                    for (const msg of recentUserMsgs) {
                        // Extract phone if still missing
                        if (!context.customer_phone) {
                            const ph = msg.match(/(\+92|0)[\d\-\s]{9,14}/);
                            if (ph) context.customer_phone = ph[0].replace(/\s/g, '');
                        }
                        // Extract comma-separated: Name, Phone, Address
                        const parts = msg.split(',').map(p => p.trim()).filter(Boolean);
                        if (parts.length >= 2) {
                            if (!context.customer_name && parts[0] && !/\d{4,}/.test(parts[0])) {
                                context.customer_name = parts[0];
                            }
                            if (!context.customer_phone) {
                                const phonePart = parts.find(p => /[\d\-]{7,}/.test(p));
                                if (phonePart) context.customer_phone = phonePart;
                            }
                            if (!context.delivery_address) {
                                const addrParts = parts.filter((p, i) => i > 0 && p !== context.customer_phone);
                                if (addrParts.length > 0) context.delivery_address = addrParts.join(', ');
                            }
                        }
                    }
                    if (context.customer_name || context.customer_phone) {
                        console.log(`[SESSION-RECOVERY] Extracted from history: name=${context.customer_name}, phone=${context.customer_phone}, addr=${context.delivery_address}`);
                        // Persist recovered details so they're available next time
                        try {
                            const updatedContext = { ...persistentContext, customer_name: context.customer_name, customer_phone: context.customer_phone, delivery_address: context.delivery_address };
                            await dbHelpers.saveCart(sessionId, updatedContext);
                        } catch (_) {}
                    }
                }
            } catch (err) {
                console.warn('⚠️ Could not fetch session data:', err.message);
            }
        }


        const embeddingService = getEmbeddingService();
        const vectorSearch = getVectorSearch();
        const reRanker = getReRankingService();

        // QUANTITY-ONLY QUERY FIX:
        // When a user replies with just a quantity (e.g., "2 box", "add 5", "10 units")
        // OR with a "whole stock" phrase (e.g., "all of it", "all of them", "everything"),
        // the semantic search finds nothing. We augment the query with the last bot
        // message text which contains the product name, giving the vector search
        // enough context to retrieve the right product.
        const isQuantityOnlyQuery = /^(add\s+)?\d+\s*(box(es)?|units?|pcs?|pieces?|tabs?|tablets?|strips?|packs?|bottles?|vials?|capsules?|caps?|sachets?)?$/i.test(query.trim());
        const isAllOfItQuery = /^(all\s+(of\s+)?(it|them|those|the\s+stock|stock|units?|everything)|everything|whole\s+stock|full\s+stock|take\s+all|buy\s+all)$/i.test(query.trim());
        let effectiveQuery = query;
        if ((isQuantityOnlyQuery || isAllOfItQuery) && context.chatHistory && context.chatHistory.length > 0) {
            // Find the most recent bot message
            const lastBotMsg = [...context.chatHistory].reverse().find(m => m.sender === 'bot');
            if (lastBotMsg && lastBotMsg.message_text) {
                effectiveQuery = `${query} ${lastBotMsg.message_text.substring(0, 150)}`;
                console.log(`[QUANTITY-FIX] Augmented query with last bot message. Original: "${query}", Effective: "${effectiveQuery.substring(0, 80)}..."`);
            }
        }

        // 1. Vector Search (Top-25 broad retrieval)
        const initialResults = await vectorSearch.searchByText(embeddingService, effectiveQuery, 25);

        // HYBRID SEARCH: Explicitly look for product names in the query to handle real-time sync better
        const { productService } = require('../services/productService');
        const cleanedQuery = query.replace(/[^\w\s]/g, '');
        const keywordResults = await productService.searchProducts(cleanedQuery);

        // Merge keyword results with high priority
        if (keywordResults.products && keywordResults.products.length > 0) {
            console.log(`[HYBRID] Injected ${keywordResults.products.length} keyword matches for "${cleanedQuery}"`);
            // Ensure they have similarity for the fast-track guards
            keywordResults.products.forEach(p => p.similarity = 1.0);
            initialResults.unshift(...keywordResults.products);
        }

        // 2. Re-Ranking (Refine to Top-5 relevant)
        let results = await reRanker.rerank(query, initialResults, 5);

        // RE-INJECTION: Force keyword matches to the top to ensure real-time sync accuracy
        if (keywordResults.products && keywordResults.products.length > 0) {
            console.log(`[HYBRID] Ensuring ${keywordResults.products.length} keyword matches are prioritized...`);
            const kwIds = new Set(keywordResults.products.map(p => p.metadata.id));
            results = [...keywordResults.products, ...results.filter(r => !kwIds.has(r.metadata.id))].slice(0, 5);
        }

        // HYDRATION: Fetch real-time price/stock for the top results to ensure accuracy
        const productIds = results.map(r => r.metadata.id).filter(id => !!id);
        if (productIds.length > 0) {
            console.log(`[HYDRATION] Refreshing metadata for ${productIds.length} products...`);
            const freshData = await productService.getRealTimeDetails(productIds);

            // Map fresh data back to results
            results.forEach(r => {
                const fresh = freshData.find(f => f.id === r.metadata.id);
                if (fresh) {
                    r.metadata.price = fresh.price;
                    r.metadata.stock = fresh.stock;
                    r.metadata.status = fresh.status;
                    if (fresh.company) r.metadata.company = fresh.company;
                    if (fresh.pack_size) r.metadata.pack_size = fresh.pack_size;
                }
            });
        }

        // --- MESSAGE LOGGING ---
        if (sessionId) {
            try {
                await dbHelpers.saveMessage(sessionId, `user_${Date.now()}`, 'user', query, 'text', 'unclear');
            } catch (logErr) {
                console.warn('⚠️ Log error (user):', logErr.message);
            }
        }

        // =====================================================================
        // SERVER-SIDE QUANTITY-ONLY HANDLER (bypasses LLM entirely)
        // When the user replies with just a quantity after a product was shown,
        // we deterministically add the product to cart without asking the LLM.
        // This prevents the LLM from saying "which product did you mean?"
        // =====================================================================
        if ((isQuantityOnlyQuery || isAllOfItQuery) && results && results.length > 0) {
            const product = results[0].metadata;
            // For "all of it" style queries, use the full available stock as quantity
            let qty;
            if (isAllOfItQuery) {
                qty = (product.stock && product.stock > 0) ? product.stock : 1;
                console.log(`[ALL-OF-IT-HANDLER] User requested all stock. Using quantity: ${qty} for ${product.name}`);
            } else {
                const qtyMatch = query.trim().match(/(\d+)/);
                qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
            }

            // Add to cart
            if (!context.cart) context.cart = [];
            const existingIdx = context.cart.findIndex(i => i.product_id === product.id);
            if (existingIdx > -1) {
                context.cart[existingIdx].quantity += qty;
            } else {
                context.cart.push({
                    product_id: product.id,
                    product_name: product.name,
                    quantity: qty,
                    unit_price: product.price || 0,
                    price: (product.price || 0) * qty,
                    company: product.company,
                    pack_size: product.pack_size
                });
            }
            context.cart_total = context.cart.reduce((s, i) => s + (i.price || 0), 0);

            const priceDisplay = product.price > 0 ? `Rs. ${(product.price * qty).toLocaleString()}` : 'Pricing available upon request';
            const cartLines = context.cart.map(i => {
                const linePrice = i.price > 0 ? `Rs. ${(i.price).toLocaleString()}` : 'Price on request';
                return `- ${i.product_name} (${i.quantity} units) - ${linePrice}`;
            }).join('\n');

            const responseText = `Excellent! I have added **${qty} units of ${product.name}** to your order. 🛒\n\n*Your current cart:*\n${cartLines}\n\nTo proceed, could you please provide your Name, Phone Number, and complete Delivery Address?`;

            // Persist
            if (sessionId) {
                try {
                    await dbHelpers.saveCart(sessionId, context);
                    await dbHelpers.saveMessage(sessionId, `bot_${Date.now()}`, 'bot', responseText, 'text', 'executive_response');
                } catch (saveErr) {
                    console.warn('⚠️ Persist error (qty-handler):', saveErr.message);
                }
            }

            console.log(`[QUANTITY-HANDLER] Directly added ${qty}x ${product.name} to cart, bypassed LLM.`);
            return res.json({
                success: true,
                response: responseText,
                actions: [{ type: 'ADD_TO_CART', product_id: product.id, product_name: product.name, quantity: qty, price: (product.price || 0) * qty }],
                updatedContext: { ...context, cart: context.cart, cart_total: context.cart_total }
            });
        }
        // =====================================================================


        // Map chatHistory to history for groqService compatibility
        if (context.chatHistory && !context.history) {
            context.history = context.chatHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.message_text
            }));
        }

        // Inject affiliated companies dynamically from the database
        const { companies } = productService.getAllCategories();
        context.affiliated_companies = companies;

        // --- SERVER-SIDE CUSTOMER DETAIL EXTRACTION ---
        // Try to extract customer details from their message automatically.
        const q = query.trim();
        // Detect phone number pattern in message
        const phoneMatch = q.match(/(\+92|0)[\d\-\s]{9,14}/);
        if (phoneMatch && !context.customer_phone) {
            context.customer_phone = phoneMatch[0].replace(/\s/g, '');
        }
        // If message looks like it contains comma-separated contact info (name, phone, address)
        const parts = q.split(',').map(p => p.trim()).filter(Boolean);
        if (parts.length >= 3 && (!context.customer_name || !context.customer_phone || !context.delivery_address)) {
            // First part is likely the name if it has no digits
            if (parts[0] && !/\d{4,}/.test(parts[0])) {
                context.customer_name = parts[0];
            }
            // Find phone-like part
            const phonePart = parts.find(p => /[\d\-]{7,}/.test(p));
            if (phonePart && !context.customer_phone) {
                context.customer_phone = phonePart;
            }
            // Remaining parts form the address
            const addrParts = parts.filter(p => p !== parts[0] && p !== phonePart);
            if (addrParts.length > 0 && !context.delivery_address) {
                context.delivery_address = addrParts.join(', ');
            }
        }

        // --- SERVER-SIDE ORDER AUTO-TRIGGER (BEFORE AI) ---
        // If user message is a confirmation keyword AND cart + details are all present,
        // auto-fire the order creation without waiting for AI.
        const confirmKeywords = /^(yes|confirm|proceed|place|go ahead|ok|okay|sure|yep|haan|haan ji|done|finalize|submit|checkout|order karo|order place|place order)/i;
        const hasAllDetails = context.customer_name && context.customer_phone && context.delivery_address;
        const hasCart = context.cart && context.cart.length > 0;
        const alreadyOrdered = context.orderPlaced;

        console.log(`[AUTO-ORDER CHECK] word_match=${confirmKeywords.test(query.trim())}, name=${context.customer_name}, phone=${context.customer_phone}, addr=${context.delivery_address}, hasCart=${hasCart}, alreadyOrdered=${alreadyOrdered}`);

        if (confirmKeywords.test(query.trim()) && hasAllDetails && hasCart && !alreadyOrdered) {
            try {
                console.log(`[AUTO-ORDER] Triggering auto order for session ${sessionId}`);
                const { dbHelpers: dbH } = require('../database');
                const { sendOrderEmail } = require('../services/emailService');
                const { productService: ps } = require('../services/productService');

                const timestamp = Date.now().toString(36).toUpperCase();
                const random = Math.random().toString(36).substr(2, 5).toUpperCase();
                const orderId = `SS-${timestamp}-${random}`;

                const orderItems = context.cart.map(item => ({
                    productName: item.product_name,
                    productId: item.product_id || null,
                    productCompany: item.company || 'Unknown',
                    packSize: item.pack_size || 'Standard',
                    quantity: item.quantity,
                    unitPrice: item.unit_price || 0,
                    subtotal: (item.quantity || 0) * (item.unit_price || 0)
                }));

                const totalAmount = orderItems.reduce((s, i) => s + i.subtotal, 0);
                const totalItems = orderItems.reduce((s, i) => s + i.quantity, 0);

                await dbH.createOrder({
                    orderId,
                    sessionId,
                    customerName: context.customer_name,
                    customerPhone: context.customer_phone,
                    customerEmail: null,
                    deliveryAddress: context.delivery_address,
                    deliveryCity: 'Not specified',
                    deliveryArea: 'Not specified',
                    orderItems,
                    totalItems,
                    totalAmount,
                    orderNotes: null
                });

                for (const item of orderItems) {
                    await dbH.addOrderItem({ orderId, ...item });
                    if (item.productId) {
                        await ps.updateProductStock(item.productId, item.quantity, 'subtract');
                    }
                }

                await dbH.updateAnalytics('total_orders');

                // Mark order as placed so this doesn't trigger again
                context.orderPlaced = true;
                context.lastOrderId = orderId;
                context.cart = [];
                context.cart_total = 0;
                await dbH.saveCart(sessionId, context);

                // Fire email - awaited so errors appear in logs
                try {
                    await sendOrderEmail({
                        orderId,
                        customerName: context.customer_name,
                        customerPhone: context.customer_phone,
                        deliveryAddress: context.delivery_address,
                        deliveryCity: '',
                        orderItems,
                        totalAmount
                    });
                    console.log(`[AUTO-ORDER] ✅ Email sent for order ${orderId}`);
                } catch (emailErr) {
                    const brevoMsg = emailErr?.response?.data?.message || emailErr.message;
                    console.error(`[AUTO-ORDER] ❌ Email failed for order ${orderId}: ${brevoMsg}`);
                }

                console.log(`[AUTO-ORDER] ✅ Order ${orderId} placed successfully!`);

                const successMessage = `✅ *Order Placed Successfully!*\n\nYour order ID is **${orderId}**. We have received your details and will process your delivery to **${context.delivery_address}** shortly.\n\nThank you for choosing Swift Sales!`;

                // Persist the success message
                await dbH.saveMessage(sessionId, `bot_${Date.now()}`, 'bot', successMessage, 'text', 'executive_response');

                return res.json({
                    success: true,
                    response: successMessage,
                    actions: [{ type: 'CLEAR_CART' }],
                    relevantProducts: [],
                    updatedContext: {
                        ...context,
                        cart: [],
                        cart_total: 0,
                        pendingOrder: null
                    }
                });

            } catch (orderErr) {
                console.error('[AUTO-ORDER] ❌ Failed to auto-place order:', orderErr.message);
            }
        }

        // Website uses Groq API directly (Executive v10.0)
        const { generateAIResponse } = require('../services/groqService');
        const aiResponse = await generateAIResponse(query, results, context);
        let responseText = aiResponse.content;
        const actions = aiResponse.actions;

        // PLACE_ORDER GLITCH FIX:
        // When the LLM emits a PLACE_ORDER action, its conversational text may still
        // say "Shall I confirm?" which causes a visual looping glitch since the
        // frontend auto-shows "Processing your order..." on its own. Override it.
        const normalizedActionsCheck = Array.isArray(actions) ? actions : (actions ? [actions] : []);
        if (normalizedActionsCheck.some(a => a.type === 'PLACE_ORDER')) {
            responseText = '📦 Confirmed! Processing your order now, please wait a moment...';
            console.log('[PLACE_ORDER-FIX] Overrode LLM text to clean order confirmation message.');
        }

        // --- ACTION PROCESSING (Backend State Sync) ---
        // Ensure actions is an array to avoid "not iterable" errors
        const normalizedActions = Array.isArray(actions) ? actions : (actions ? [actions] : []);

        if (normalizedActions.length > 0) {
            console.log(`[ACTIONS] Processing ${normalizedActions.length} actions from AI...`);
            for (const action of normalizedActions) {
                if (action.type === 'ADD_TO_CART') {
                    // Update context cart
                    if (!context.cart) context.cart = [];
                    const existingIndex = context.cart.findIndex(item => item.product_id === action.product_id);
                    if (existingIndex > -1) {
                        context.cart[existingIndex].quantity += action.quantity;
                        context.cart[existingIndex].price = (context.cart[existingIndex].quantity * context.cart[existingIndex].unit_price);
                    } else {
                        context.cart.push({
                            product_id: action.product_id,
                            product_name: action.product_name,
                            quantity: action.quantity,
                            price: action.price,
                            unit_price: action.price / action.quantity
                        });
                    }
                    context.cart_total = context.cart.reduce((sum, item) => sum + (item.price || 0), 0);
                } else if (action.type === 'PLACE_ORDER') {
                    // Store order details in context for frontend to trigger final submission
                    context.pendingOrder = action;
                    // Persist customer details into structured session so bot never asks again
                    if (action.customerName) context.customer_name = action.customerName;
                    if (action.customerPhone) context.customer_phone = action.customerPhone;
                    if (action.deliveryAddress) context.delivery_address = action.deliveryAddress;
                } else if (action.type === 'COLLECT_CUSTOMER_INFO') {
                    // AI can emit this action to persist partial customer details
                    if (action.customerName) context.customer_name = action.customerName;
                    if (action.customerPhone) context.customer_phone = action.customerPhone;
                    if (action.deliveryAddress) context.delivery_address = action.deliveryAddress;
                }
            }
        }

        // PERSISTENCE LAYER: Save full context if sessionId is present
        if (sessionId) {
            try {
                console.log(`[PERSISTENCE] Saving context for ${sessionId}. Keys:`, Object.keys(context).join(', '));
                await dbHelpers.saveCart(sessionId, context);
                await dbHelpers.saveMessage(sessionId, `bot_${Date.now()}`, 'bot', responseText, 'text', 'executive_response');
                console.log(`[PERSISTENCE] Save successful`);
            } catch (saveErr) {
                console.warn('⚠️ Could not persist context/message:', saveErr.message);
            }
        }

        // (Auto order trigger was moved up before AI generation)

        res.json({
            success: true,
            response: responseText,
            actions: actions || [],
            relevantProducts: results.map(r => ({
                name: r.metadata.name,
                company: r.metadata.company,
                pack_size: r.metadata.pack_size,
                price: r.metadata.price,
                stock: r.metadata.stock,
                similarity: r.similarity
            })),
            // Pass back updated context for frontend to maintain state
            updatedContext: {
                ...context,
                cart: context.cart || [],
                cart_total: context.cart_total || 0,
                pendingOrder: context.pendingOrder
            }
        });

    } catch (error) {
        console.error('Error in RAG query:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            fallback: "I'm here to help! Could you please rephrase your question? 😊"
        });
    }
});

router.post('/general', async (req, res) => {
    try {
        await initializeServices();
        const { query, context = {}, sessionId } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        // Fetch chat history if sessionId is provided
        if (sessionId) {
            try {
                const history = await dbHelpers.getChatHistory(sessionId);
                // Keep last 5 messages for general context
                context.chatHistory = history.slice(-5);
            } catch (err) {
                console.warn('⚠️ Could not fetch chat history for general query:', err.message);
            }
        }

        // For general queries, we still want RAG but maybe less strict?
        // Actually, let's just use the same pipeline for consistency.
        const embeddingService = getEmbeddingService();
        const vectorSearch = getVectorSearch();
        const candidates = await vectorSearch.searchByText(embeddingService, query, 5);
        
        // --- MESSAGE LOGGING ---
        if (sessionId) {
            try {
                await dbHelpers.saveMessage(sessionId, `user_${Date.now()}`, 'user', query, 'text', 'general');
            } catch (logErr) {
                console.warn('⚠️ Log error (general):', logErr.message);
            }
        }

        const { generateAIResponse } = require('../services/groqService');
        const aiResponse = await generateAIResponse(query, candidates, context);

        // Standardized response with state/actions
        res.json({
            success: true,
            response: aiResponse.content,
            actions: aiResponse.actions || [],
            updatedContext: {
                lastQuery: query,
                cart: context.cart || [],
                cart_total: context.cart_total || 0
            }
        });

    } catch (error) {
        console.error('Error in general query:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            fallback: "I'm here to help! What would you like to know? 😊"
        });
    }
});

// Search endpoint - just returns relevant products
router.post('/search', async (req, res) => {
    try {
        await initializeServices();

        const { query, topK = 5 } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const embeddingService = getEmbeddingService();
        const vectorSearch = getVectorSearch();

        const results = await vectorSearch.searchByText(embeddingService, query, topK);

        res.json({
            success: true,
            results: results.map(r => ({
                name: r.metadata.name,
                company: r.metadata.company,
                pack_size: r.metadata.pack_size,
                id: r.metadata.id,
                similarity: r.similarity
            }))
        });

    } catch (error) {
        console.error('Error in RAG search:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        servicesInitialized,
        message: servicesInitialized
            ? 'RAG services are ready'
            : 'RAG services not initialized. Run buildEmbeddings.js first.'
    });
});

module.exports = router;
