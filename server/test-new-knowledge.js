const path = require('path');
const { RAGService } = require('./services/rag');
const { pipeline } = require('@xenova/transformers');

async function verifyNewKnowledge() {
    console.log("🚀 Starting New Knowledge Verification Test...");

    const ragService = new RAGService();
    await ragService.loadFAQVectors();

    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    const testQueries = [
        "What is your company mission?",
        "Who is the CEO of Swift Sales?",
        "What are your core values?",
        "Tell me about your cold chain storage.",
        "What is your license number?",
        "Who is Ghulam Yaseen?",
        "Do you deliver to Sindh?",
        "What is Swift Sales Healthcare?"
    ];

    console.log("\n🔍 Running Semantic Search Tests...\n");

    for (const query of testQueries) {
        console.log(`❓ Query: "${query}"`);

        // Generate embedding
        const queryOutput = await embedder(query, { pooling: 'mean', normalize: true });
        const queryEmbedding = Array.from(queryOutput.data);

        // Find match
        const match = await ragService.findBestFAQVectorMatch(queryEmbedding);

        if (match) {
            console.log(`✅ MATCH FOUND (Score: ${match.score.toFixed(4)})`);
            console.log(`🆔 ID: ${match.id}`);
            console.log(`🙋 Question: ${match.original_question}`);
            console.log(`📝 Answer Summary: ${match.answer.substring(0, 100).replace(/\n/g, ' ')}...`);
        } else {
            console.log(`❌ NO MATCH FOUND`);
        }
        console.log("---------------------------------------------------\n");
    }
}

verifyNewKnowledge().catch(err => {
    console.error("❌ Verification failed:", err);
});
