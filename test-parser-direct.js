const { RAGService } = require('./server/services/rag');

async function testParserDirectly() {
    console.log('🧪 Testing Parser Directly...');
    const rag = new RAGService();

    // Mock userContext
    const userContext = { cart: [] };

    const queries = [
        "Add 5 Glucophage",
        "Add 5 Amoxil",
        "Add 10 Lipitor 20mg"
    ];

    for (const query of queries) {
        console.log(`\n--- Query: "${query}" ---`);
        try {
            const response = await rag.processOrderIntent(query, userContext);
            console.log('Response:', response);
            console.log('Cart:', JSON.stringify(userContext.cart, null, 2));
        } catch (err) {
            console.error('Error:', err.message);
        }
    }
}

testParserDirectly();
