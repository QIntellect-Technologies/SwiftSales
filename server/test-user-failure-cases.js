const { getRAGService } = require('./services/rag');

async function runTests() {
    console.log('🧪 Verifying User Reported Failure Cases...\n');

    const ragService = getRAGService();
    const context = { cart: [] };

    // Mock relevant products for the order test
    const mockProducts = [
        { metadata: { id: "M1", name: "MAXLUM TAB", company: "PHARMA", pack_size: "10S" }, similarity: 0.9 },
        { metadata: { id: "C1", name: "CIZIDIM INJ", company: "PHARMA", pack_size: "1S" }, similarity: 0.9 }
    ];

    const testCases = [
        {
            name: "CEO Information",
            query: "who is the ceo ?",
            expectedText: "Ejaz Malik"
        },
        {
            name: "Order Detection (Priority over Procedure)",
            query: "i want to order 8 maxlum and 9 cizidim",
            unexpectedText: "How to Place an Order at Swift Sales:"
        },
        {
            name: "Address Information",
            query: "where is your location?",
            expectedText: "Sardar Colony"
        }
    ];

    for (const test of testCases) {
        console.log(`Test: ${test.name}`);
        console.log(`Query: "${test.query}"`);

        const res = await ragService.generateResponse(test.query, mockProducts, context);

        console.log(`Response Snippet: ${res.substring(0, 150).replace(/\n/g, ' ')}...`);

        let success = true;
        if (test.expectedText && !res.includes(test.expectedText)) {
            success = false;
            console.log(`❌ Expected to find: "${test.expectedText}"`);
        }
        if (test.unexpectedText && res.includes(test.unexpectedText)) {
            success = false;
            console.log(`❌ Unexpectedly found: "${test.unexpectedText}"`);
        }

        console.log(`Result: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
        console.log('-------------------\n');
    }
}

runTests().catch(console.error);
