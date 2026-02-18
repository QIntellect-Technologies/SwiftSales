const { RAGService } = require('./services/rag');

async function testParserDirectly() {
    console.log('🧪 Testing Parser Directly (In-Process)...');
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
            // We need to ensure embeddings are NOT initialized or mocked if they cause crashes
            // RAGService.processOrderIntent calls productService.searchProducts

            const response = await rag.processOrderIntent(query, userContext);
            console.log('Response type:', typeof response);
            if (typeof response === 'string') {
                console.log('Result Message:', response.substring(0, 50) + '...');
            }
            console.log('Cart Items:', userContext.cart.length);
            if (userContext.cart.length > 0) {
                console.log('Last Item:', JSON.stringify(userContext.cart[userContext.cart.length - 1], null, 2));
            }
        } catch (err) {
            console.error('Error:', err.message);
        }
    }
}

testParserDirectly();
