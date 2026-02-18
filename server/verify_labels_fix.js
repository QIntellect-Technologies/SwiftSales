const { RAGService } = require('./services/rag');

async function verify() {
    const ragService = new RAGService();
    // Use a query that previously triggered a label (like "who are you" -> identity category)
    const query = "who are you";

    console.log(`Testing query: "${query}"`);

    // Mock relevantProducts as empty to force FAQ/Vector search logic
    const response = await ragService.generateResponse(query, [], {});

    console.log("\n--- CHATBOT RESPONSE ---");
    console.log(response);
    console.log("------------------------\n");

    if (response.includes("identity:") || response.includes("identity:**")) {
        console.error("❌ FAILED: Technical label still present in response!");
        process.exit(1);
    } else {
        console.log("✅ PASSED: No technical labels found in response.");
    }
}

verify().catch(console.error);
