const { getRAGService } = require('./services/rag');

async function runTests() {
    console.log('📝 Starting Procedural Intelligence Tests...\n');

    const ragService = getRAGService();
    const context = { cart: [] };

    const testCases = [
        "i want to place an order what are the steps?",
        "i want to place the order",
        "i wantt o place the ordder",
        "how to buy medicine",
        "tell me the ordering process",
        "steps for delivery",
        "how can i pay?",
        "what are your payment methods?",
        "is there cod available?",
        "how to track my order"
    ];

    for (const query of testCases) {
        console.log(`Query: "${query}"`);
        const res = await ragService.generateResponse(query, [], context);
        console.log(`Response Snippet: ${res.substring(0, 100).replace(/\n/g, ' ')}...`);
        console.log('-------------------\n');
    }
}

runTests().catch(console.error);
