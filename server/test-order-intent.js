
const { getLLMService } = require('./services/llm');

async function testOrderIntent() {
    const llm = getLLMService();

    console.log("🚀 Testing LLM Order Intent Parsing...\n");

    const testQueries = [
        "I want to buy 2 packs of Panadol and a Brufen syrup",
        "Actually, change the panadol to 3",
        "Proceed to checkout please",
        "My name is Imran Khalid and my phone is 0321-1234567",
        "Deliver to House 123, Street 5, Lahore",
        "cancel the order",
        "what is the price of augmentin?" // Should be 'unknown' or regular query
    ];

    for (const q of testQueries) {
        console.log(`\n📝 Input: "${q}"`);
        const start = Date.now();
        const result = await llm.parseOrderIntent(q);
        const duration = Date.now() - start;

        console.log(`⏱️  Time: ${duration}ms`);
        console.log("🤖 Output:", JSON.stringify(result, null, 2));
    }
}

testOrderIntent();
