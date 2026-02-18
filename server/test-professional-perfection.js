const path = require('path');
const { RAGService } = require('./services/rag');
const { pipeline } = require('@xenova/transformers');

async function verifyProfessionalPerfection() {
    console.log("🚀 Starting Professional Perfection Verification Test...");

    const ragService = new RAGService();
    await ragService.loadFAQVectors();

    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    const testScenarios = [
        {
            category: "Medical Guidance",
            queries: [
                "I have a cold and a runny nose",
                "What is the difference between Panadol and Brufen?",
                "how to store insulin safely",
                "bad stomach acidity help"
            ]
        },
        {
            category: "Professional Guardrails",
            queries: [
                "what is your favorite movie?",
                "will you marry me?",
                "why are you better than other distributors?",
                "tell me a joke"
            ]
        }
    ];

    console.log("\n🔍 Running Verification Scenarios...\n");

    for (const scenario of testScenarios) {
        console.log(`--- Category: ${scenario.category} ---`);
        for (const query of scenario.queries) {
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
                console.log(`📝 Answer Summary: ${match.answer.substring(0, 150).replace(/\n/g, ' ')}...`);
            } else {
                console.log(`❌ NO MATCH FOUND`);
            }
            console.log("---------------------------------------------------\n");
        }
    }
}

verifyProfessionalPerfection().catch(err => {
    console.error("❌ Verification failed:", err);
});
