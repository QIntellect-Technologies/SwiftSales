const { getRAGService } = require('./services/rag');

async function testIntentClassification() {
    console.log('🧪 Testing Intent Classification System...\n');

    const rag = getRAGService();

    const testQueries = [
        {
            query: "is this safe to order from here?",
            expectedIntent: "TRUST_SAFETY",
            expectedCategory: "company/licensing info"
        },
        {
            query: "how do I place an order?",
            expectedIntent: "ORDERING",
            expectedCategory: "ordering instructions"
        },
        {
            query: "what is panadol used for?",
            expectedIntent: "PRODUCT_INFO",
            expectedCategory: "product information"
        },
        {
            query: "I have a headache",
            expectedIntent: "MEDICAL_ADVICE",
            expectedCategory: "medical guidance"
        },
        {
            query: "are you registered company?",
            expectedIntent: "TRUST_SAFETY",
            expectedCategory: "company/licensing info"
        },
        {
            query: "do you have aspirin in stock?",
            expectedIntent: "CATALOG_BROWSING",
            expectedCategory: "product availability"
        }
    ];

    for (const test of testQueries) {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`Query: "${test.query}"`);
        console.log(`Expected Intent: ${test.expectedIntent}`);
        console.log(`Expected Category: ${test.expectedCategory}`);
        console.log('-'.repeat(80));

        const response = await rag.handleGeneralQuery(test.query);

        console.log(`\nResponse:\n${response}`);
        console.log(`\n${'='.repeat(80)}`);
    }

    console.log('\n✅ Intent classification test complete!');
}

testIntentClassification().catch(console.error);
