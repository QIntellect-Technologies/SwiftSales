const { getRAGService } = require('../services/rag');

async function testFAQ() {
    console.log("🧪 Testing FAQ System...");
    const ragService = getRAGService();

    // Mock global if needed (rag.js might rely on it, but let's see)
    // The rag.js implementation loads fs/path dynamically for FAQ, so it should be fine.

    const testQueries = [
        "What is the shipping cost?",
        "how much for delivery to Lahore?",
        "can i return this?",
        "do you have a phone number?",
        "is this authentic medicine?",
        "random gibberish that should fail"
    ];

    for (const query of testQueries) {
        console.log(`\n❓ Query: "${query}"`);
        const response = await ragService.generateResponse(query, []); // Empty products to force bypass/FAQ check
        console.log(`🤖 Response: ${response.substring(0, 100)}...`);
    }
}

testFAQ();
