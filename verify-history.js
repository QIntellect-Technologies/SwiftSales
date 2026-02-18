const { RAGService } = require('./server/services/rag');

async function verifyHistory() {
    const rag = new RAGService();
    // We need to bypass some initializations for a quick test or just check the companyInfo object
    console.log("Verifying history in RAG service...");
    console.log("Established:", rag.companyInfo.established);
    console.log("History:", JSON.stringify(rag.companyInfo.history, null, 2));

    // Simulate history query (this will hit the procedural intent for history)
    // Procedural intents are handled in generateResponse
    const historyQuery = "what is the history of swift sales?";

    // In a real scenario, it would call generateResponse
    // But since generateOllamaResponse uses companyInfo, and procedural intents use it too
    // Let's see how procedural intensive history is handled in rag.js
}

verifyHistory();
