const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { dbHelpers } = require('./database');
const { productService } = require('./services/productService');
const { getEmbeddingService } = require('./services/embeddings');
const { getVectorSearch } = require('./services/vectorSearch');
const { getRAGService } = require('./services/rag');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve downloads


// Initialize database
require('./database');


// Routes registration


// Chat routes (session, message, etc.)
const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

// RAG routes
const ragRoutes = require('./routes/rag');
app.use('/api/rag', ragRoutes);

// Order routes
const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);



// Configure Nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, '') : ''
    }
});

// Verification endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend is active and synced.' });
});

// --- CHATBOT ECOSYSTEM ENDPOINT ---
const medicinesPath = path.join(__dirname, 'data', 'medicines.json');
const vectorDbPath = path.join(__dirname, 'data', 'embeddings');
const faqIndexPath = path.join(vectorDbPath, 'faq_embeddings_comprehensive.json');
const metadataPath = path.join(vectorDbPath, 'faq_metadata_comprehensive.json');
const productDetailsPath = path.join(__dirname, '..', 'src', 'data', 'productDetails.json');

const { getReRankingService } = require('./services/reRanker');

let ragServicesInitialized = false;

const initializeRagServices = async () => {
    if (ragServicesInitialized) return;

    try {
        console.log('🔄 Initializing RAG System (Supabase Integrated)...');

        // 1. Fetch Products from Supabase
        const products = await productService.getAllProducts();

        if (products.length > 0) {
            console.log(`📦 Loaded ${products.length} products from Supabase.`);

            const embeddingService = getEmbeddingService();
            const vectorSearch = getVectorSearch();
            const reRanker = getReRankingService();

            // 2. Check if we need to rebuild embeddings
            // For now, we'll try to load from disk, if fail or mismatch, we rebuild.
            // Simplified: Just rebuild in-memory if small, or check file existence.
            const vectorPath = path.join(vectorDbPath, 'supabase_vectors.json');

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
                console.log('⚡ Generating new embeddings (this may take a moment)...');
                embeddings = await embeddingService.embedBatch(products.map(p =>
                    `${p.name} ${p.generic_name || ''} ${p.description || ''} ${p.company || ''}`
                ));
                await fs.writeJson(vectorPath, embeddings);
            }

            // 3. Initialize Vector Search
            // We pass the PRODUCTS as metadata
            await vectorSearch.initialize(vectorPath, products);

            // 4. Initialize Re-Ranker
            await reRanker.initialize();

            // Load Global Product Details (Static for now, but could be DB too)
            if (await fs.pathExists(productDetailsPath)) {
                try {
                    global.productDetails = await fs.readJson(productDetailsPath);
                } catch (err) { console.warn('⚠️ Could not load product details:', err.message); }
            }

            ragServicesInitialized = true;
            console.log(`✅ RAG Services Ready!`);
        } else {
            console.warn('⚠️ No products found in Supabase. Chatbot will have limited knowledge.');
        }
    } catch (err) {
        console.error('❌ Failed to initialize RAG services:', err);
    }
};

// Pure RAG chat endpoint (LLM-free) - MUST be defined BEFORE router registration
app.post('/api/chat', async (req, res) => {
    const { message, context = {}, sessionId } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, error: 'Message is required' });
    }

    await initializeRagServices();

    try {
        // Pull limited history for better continuity if available
        if (sessionId && dbHelpers?.getChatHistory) {
            try {
                const history = await dbHelpers.getChatHistory(sessionId);
                context.chatHistory = history.slice(-10);
            } catch (err) {
                console.warn('⚠️ Could not fetch chat history for context:', err.message);
            }
        }

        const embeddingService = getEmbeddingService();
        const vectorSearch = getVectorSearch();
        const reRanker = getReRankingService();
        const ragService = getRAGService();

        // 1. Retrieval (HNSW) - Get top 20 candidates
        const candidates = await vectorSearch.searchByText(embeddingService, message, 20);

        // --- DYNAMIC DATA ENRICHMENT ---
        // Fetch latest Price and Stock from Supabase for these candidates
        const candidateIds = candidates.map(c => c.metadata.id).filter(id => id);
        const latestDetails = await productService.getRealTimeDetails(candidateIds);

        // Merge latest details into candidates
        candidates.forEach(c => {
            const fresh = latestDetails.find(d => d.id === c.metadata.id);
            if (fresh) {
                c.metadata.price = fresh.price;
                c.metadata.stock = fresh.stock;
                c.metadata.status = fresh.status;
                // c.metadata.name = fresh.name; // Keep original name or update? Keep original for matching stability.
            }
        });
        // -------------------------------

        // 2. Re-Ranking (Cross-Encoder) - Filter top 5 high-quality matches
        let rankedResults = await reRanker.rerank(message, candidates, 5);

        // 3. Quality Filter - Different thresholds for different query types
        const hasCartIntent = /(add|order|buy|want|need|remove|update|change|modify|cart|\d+\s+[a-z])/i.test(message);
        const hasProfanity = /(fuck|shit|stupid|get out|go away)/i.test(message);

        if (hasProfanity) {
            // Very strict for profanity
            const MIN_RERANK_SCORE = 0.5;
            rankedResults = rankedResults.filter(r => (r.rerankScore || r.similarity || 0) >= MIN_RERANK_SCORE);
        } else if (!hasCartIntent) {
            // Moderate filtering
            const MIN_RERANK_SCORE = 0.25;
            rankedResults = rankedResults.filter(r => (r.rerankScore || r.similarity || 0) >= MIN_RERANK_SCORE);
        }

        // 4. Generation
        const response = await ragService.generateResponse(message, rankedResults, context);

        res.json({
            success: true,
            response,
            updatedContext: context,
            relevantProducts: rankedResults.map(r => ({
                name: r.metadata.name,
                company: r.metadata.company,
                pack_size: r.metadata.pack_size,
                price: r.metadata.price, // Include price in response
                stock: r.metadata.stock, // Include stock in response
                similarity: r.similarity,
                rerankScore: r.rerankScore
            }))
        });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            fallback: "I'm here to help! Could you please rephrase your question? 😊"
        });
    }
});


// Helper: Load Medicines - DEPRECATED (Now fetching from Supabase)
// async function loadMedicines() { ... }

// Existing Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
    const { firstName, lastName, email, subject, message } = req.body;

    const mailOptions = {
        from: `"Swift Sales Support" <${process.env.GMAIL_EMAIL}>`,
        to: 'customercare.swiftsales@gmail.com', // destination email
        subject: `[INTERNAL] Priority Inquiry: ${subject} | ${firstName} ${lastName}`,
        text: `
            NEW INQUIRY RECEIVED
            ---------------------
            Personnel: ${firstName} ${lastName}
            Registry: ${email}
            Subject: ${subject}
            Timestamp: ${new Date().toLocaleString()}
            
            MESSAGE DETAILS:
            ${message}
        `,
        html: `
            <div style="font-family: 'Inter', 'Helvetica', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #0f172a; padding: 32px; text-align: center; border-bottom: 4px solid #2563eb;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: -0.025em; font-weight: 800; text-transform: uppercase;">Swift Sales Hub</h1>
                    <p style="color: #60a5fa; margin: 8px 0 0 0; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;">Commercial Support Sync</p>
                </div>
                
                <div style="padding: 40px;">
                    <div style="margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #f1f5f9;">
                        <h2 style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">Transmission Details</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; width: 120px;">Personnel</td>
                                <td style="padding: 8px 0; font-size: 14px; color: #0f172a; font-weight: 700;">${firstName} ${lastName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Registry Email</td>
                                <td style="padding: 8px 0; font-size: 14px; color: #2563eb; font-weight: 700;">${email}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Subject Area</td>
                                <td style="padding: 8px 0; font-size: 14px; color: #0f172a; font-weight: 700;">${subject}</td>
                            </tr>
                        </table>
                    </div>

                    <div>
                        <h2 style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">Inquiry Narrative</h2>
                        <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                    </div>
                    
                    <div style="margin-top: 40px; text-align: center;">
                        <a href="mailto:${email}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 13px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em; transition: background-color 0.2s;">
                            Respond to Inquiry
                        </a>
                    </div>
                </div>

                <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">
                        INTERNAL TRANSMISSION: This is a secure automated sync from the Swift Sales Healthcare Partner Portal.<br />
                        Date Sync: ${new Date().toLocaleString()} | ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to customercare.swiftsales@gmail.com from ${email}`);
        res.status(200).json({ success: true, message: 'Inquiry sync established successfully.' });
    } catch (error) {
        console.error('SMTP Sync Error:', error);
        res.status(500).json({ success: false, message: 'Failed to establish inquiry sync.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
