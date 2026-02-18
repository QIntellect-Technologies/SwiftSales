const path = require('path');
const { RAGService } = require('./services/rag');
const { pipeline } = require('@xenova/transformers');

async function verifyTypoTolerance() {
    console.log("🚀 Starting Typo Tolerance Verification Test...");

    const ragService = new RAGService();
    await ragService.loadFAQVectors();

    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    const testQueries = [
        "who is ejaz malek?",
        "what is swif sales?",
        "how to ordar medisin?",
        "dilvery time?",
        "who is gulam yasin?",
        "what are your core valus?",
        "pandol uses?",
        "where is ry khan?"
    ];

    console.log("\n🔍 Running Semantic Search Tests with Intentional Typos...\n");

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
            console.log(`🙋 Matched Question: ${match.original_question}`);
            console.log(`📝 Answer Summary: ${match.answer.substring(0, 100).replace(/\n/g, ' ')}...`);
        } else {
            console.log(`❌ NO MATCH FOUND`);
        }
        console.log("---------------------------------------------------\n");
    }
}

verifyTypoTolerance().catch(err => {
    console.error("❌ Verification failed:", err);
});
