const { RAGService } = require('./services/rag');

async function verifyStrictProfessionalism() {
    console.log("🚀 Starting Final Strict Professionalism Test...");

    const ragService = new RAGService();
    // No need to load vectors for this test since regex should catch them first in generateResponse

    const testQueries = [
        "fuck you bot",                 // Profanity
        "you are stupid",               // Insult
        "love you",                     // Affection
        "miss you",                     // Affection
        "help me with programming",     // Irrelevant (Programming)
        "write a javascript script",    // Irrelevant (Technical)
        "what's for dinner?"            // Irrelevant (General)
    ];

    console.log("\n🔍 Running Strict Redirection Scenarios...\n");

    for (const query of testQueries) {
        console.log(`❓ Query: "${query}"`);

        // Use generateResponse directly to test the regex and logic flow
        const response = await ragService.generateResponse(query, [], {});

        console.log(`✅ Response:\n---\n${response}\n---`);
        console.log("---------------------------------------------------\n");
    }
}

verifyStrictProfessionalism().catch(err => {
    console.error("❌ Verification failed:", err);
});
