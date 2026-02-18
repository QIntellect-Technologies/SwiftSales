
const { getRAGService } = require('./services/rag');

// Mock User Context
let userContext = {
    orderState: null,
    orderData: { items: [] }
};

async function testConversationalOrder() {
    const rag = getRAGService();
    // Initialize (loads vectors etc if needed, but we focus on logic)

    console.log("🚀 Testing Conversational Ordering Flow...\n");

    const conversation = [
        "I want to order 2 Panadol",
        "Actually make it 3 Panadol",
        "Proceed to checkout",
        "My name is Imran",
        "0321-1234567",
        "House 123, Street 5, Lahore"
    ];

    for (const input of conversation) {
        console.log(`\n👤 User: "${input}"`);

        // Simulate RAG handling
        let response;
        if (userContext.orderState || input.includes('order') || input.includes('buy')) {
            // Force entry if not already in state
            if (!userContext.orderState && (input.includes('order') || input.includes('buy'))) {
                userContext.orderState = 'confirm_product';
            }

            // In real app, generateResponse calls handleOrderFlow. 
            // We call it directly here to test the logic.
            try {
                response = await rag.handleOrderFlow(input, userContext, []);
            } catch (e) {
                console.error(e);
            }
        }

        console.log(`🤖 Bot: ${response}`);
        console.log(`   [State: ${userContext.orderState}]`);
        // console.log(`   [Cart: ${JSON.stringify(userContext.orderData.items.map(i => `${i.quantity}x ${i.productName}`))}]`);
    }
}

// Mock Global Product Details for Fuzzy Match
global.productDetails = {
    "PANADOL": { id: "P1", company: "GSK", pack_size: "100s" },
    "BRUFEN": { id: "P2", company: "Abbott", pack_size: "50s" }
};

testConversationalOrder();
