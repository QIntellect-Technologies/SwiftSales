const express = require('express');
const router = express.Router();
const { getEmbeddingService } = require('../services/embeddings');
const { getVectorSearch } = require('../services/vectorSearch');
const { getRAGService } = require('../services/rag');
const { getReRankingService } = require('../services/reRanker'); // Import ReRanker
const fs = require('fs-extra');
const path = require('path');
const { dbHelpers } = require('../database');

const { productService } = require('../services/productService');

// Initialize services on first request
let servicesInitialized = false;

async function initializeServices() {
    if (servicesInitialized) return;

    try {
        console.log('🔄 Initializing RAG services (Supabase Integrated)...');

        // 1. Fetch Products from Supabase
        const products = await productService.getAllProducts();

        if (products.length > 0) {
            console.log(`📦 Loaded ${products.length} products from Supabase.`);

            // Load Supabase-compatible embeddings path
            const vectorDbPath = path.join(__dirname, '../data/embeddings');
            const vectorPath = path.join(vectorDbPath, 'supabase_vectors.json');

            const embeddingService = getEmbeddingService();
            const vectorSearch = getVectorSearch();
            const reRanker = getReRankingService();

            // 2. Check/Build Embeddings
            let embeddings = [];
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

            console.log('✅ RAG services initialized (Supabase/ProductService)');
            servicesInitialized = true;
        } else {
            console.warn('⚠️ No products found in Supabase.');
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
                // Keep last 10 messages for context
                context.chatHistory = history.slice(-10);

                // Load persistent session data if context is empty/minimal
                if (Object.keys(context).length <= 1) { // Only has chatHistory or is empty
                    console.log(`[SESSION RECOVERY] Attempting recovery for: ${sessionId}`);
                    const persistentContext = await dbHelpers.getCart(sessionId);
                    console.log(`[SESSION RECOVERY] DB Returned:`, persistentContext ? 'DATA FOUND' : 'NOT FOUND');

                    if (persistentContext && typeof persistentContext === 'object') {
                        // Merge persistent data into current context
                        Object.assign(context, persistentContext);
                        console.log(`[SESSION RECOVERY] Final Context Keys:`, Object.keys(context).join(', '));
                        if (context.pendingOrder) {
                            console.log(`[SESSION RECOVERY] Found Pending Order Mode: ${context.pendingOrder.mode}`);
                        }
                    }
                }
            } catch (err) {
                console.warn('⚠️ Could not fetch session data:', err.message);
            }
        }

        const embeddingService = getEmbeddingService();
        const vectorSearch = getVectorSearch();
        const reRanker = getReRankingService();
        const ragService = getRAGService();

        // 1. Vector Search (Top-25 broad retrieval)
        const initialResults = await vectorSearch.searchByText(embeddingService, query, 25);

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

        // Generate response using RAG
        const response = await ragService.generateResponse(query, results, context);

        // PERSISTENCE LAYER: Save full context if sessionId is present
        if (sessionId) {
            try {
                console.log(`[PERSISTENCE] Saving context for ${sessionId}. Keys:`, Object.keys(context).join(', '));
                await dbHelpers.saveCart(sessionId, context);
                console.log(`[PERSISTENCE] Save successful`);
            } catch (saveErr) {
                console.warn('⚠️ Could not persist context:', saveErr.message);
            }
        }

        // Handle order submission (when order state is confirmed)
        if (typeof response === 'object' && response.type === 'order_ready') {
            const orderData = response.orderData;

            res.json({
                success: true,
                type: 'order_ready',
                response: response.message,
                orderData: {
                    sessionId,
                    customerName: orderData.customerName,
                    customerPhone: orderData.customerPhone,
                    customerEmail: orderData.customerEmail,
                    deliveryAddress: orderData.deliveryAddress,
                    deliveryCity: orderData.deliveryCity,
                    deliveryArea: orderData.deliveryArea,
                    orderItems: orderData.items,
                    orderNotes: orderData.orderNotes || null
                },
                relevantProducts: results.map(r => ({
                    name: r.metadata.name,
                    company: r.metadata.company,
                    pack_size: r.metadata.pack_size,
                    similarity: r.similarity
                })),
                // Pass back updated context for frontend to maintain state
                updatedContext: {
                    ...context,
                    orderState: context.orderState,
                    orderData: context.orderData,
                    cart: context.cart || [],
                    pendingOrder: context.pendingOrder
                }
            });
        } else {
            res.json({
                success: true,
                response,
                relevantProducts: results.map(r => ({
                    name: r.metadata.name,
                    company: r.metadata.company,
                    pack_size: r.metadata.pack_size,
                    similarity: r.similarity
                })),
                // Pass back updated context for frontend to maintain state
                updatedContext: {
                    ...context,
                    orderState: context.orderState,
                    orderData: context.orderData,
                    cart: context.cart || [],
                    pendingOrder: context.pendingOrder
                }
            });
        }

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

        const ragService = getRAGService();
        const response = await ragService.handleGeneralQuery(query, context);

        res.json({
            success: true,
            response
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
