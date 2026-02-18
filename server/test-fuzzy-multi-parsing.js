const { getRAGService } = require('./services/rag');

async function runTests() {
    console.log('🧪 Starting Fuzzy Multi-Parsing Tests...\n');

    const ragService = getRAGService();
    const context = { cart: [] };

    // Mock relevant products
    const mockProducts = [
        { metadata: { id: "P1", name: "PANADOL TAB 500MG", company: "GSK", pack_size: "10S" }, similarity: 0.95 },
        { metadata: { id: "B1", name: "BRUFEN 400MG TAB", company: "ABBOTT", pack_size: "30S" }, similarity: 0.85 },
        { metadata: { id: "D1", name: "DISPRIN TAB", company: "RECKITT", pack_size: "10S" }, similarity: 0.8 }
    ];

    const testCases = [
        {
            name: "Number Words",
            query: "five panadol and ten brufen",
            expectedMatches: ["PANADOL", "BRUFEN"]
        },
        {
            name: "Misspellings",
            query: "5 pandol and 10 brufn",
            expectedMatches: ["PANADOL", "BRUFEN"]
        },
        {
            name: "Mixed Messy Input",
            query: "three panadoll and eight brufen and two disprin",
            expectedMatches: ["PANADOL", "BRUFEN", "DISPRIN"]
        }
    ];

    for (const test of testCases) {
        console.log(`Test: ${test.name}`);
        console.log(`Query: "${test.query}"`);
        context.cart = []; // Reset cart
        const res = await ragService.handleMultiItemOrder(test.query, context, mockProducts);

        console.log(`Response Snippet: ${res ? res.substring(0, 100).replace(/\n/g, ' ') : 'NULL'}...`);
        console.log(`Cart Size: ${context.cart.length}`);
        context.cart.forEach(item => console.log(` - ${item.productName} x ${item.quantity}`));

        const success = test.expectedMatches.every(expected =>
            context.cart.some(item => item.productName.toUpperCase().includes(expected))
        );
        console.log(`Result: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
        console.log('-------------------\n');
    }
}

runTests().catch(console.error);
