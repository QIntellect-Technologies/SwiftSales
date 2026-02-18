const { getRAGService } = require('./services/rag');

async function runTests() {
    console.log('🌟 Starting Outstanding Ordering System Tests...\n');

    const ragService = getRAGService();
    const context = { cart: [] };

    // Mock relevant products (representing what vector search + reranker would return)
    const mockProducts = [
        { metadata: { id: "001204", name: "ACER 50MG CAP", company: "SHROOQ PHARMA", pack_size: "30`S" }, similarity: 0.9 },
        { metadata: { id: "001166", name: "AEROMAX 10MG TAB", company: "SHROOQ PHARMA", pack_size: "14`S" }, similarity: 0.85 },
        { metadata: { id: "P1", name: "PANADOL TAB", company: "GSK", pack_size: "10S" }, similarity: 0.95 },
        { metadata: { id: "P2", name: "PANADOL SUSP", company: "GSK", pack_size: "60ML" }, similarity: 0.94 }
    ];

    // Test 1: Ambiguity Resolver
    console.log('Test 1: Ambiguity Resolver "I want 5 PANADOL"');
    const res1 = await ragService.generateResponse("I want 5 PANADOL", mockProducts, context);
    console.log('Response (should be a list):', res1.substring(0, 100) + '...');
    console.log('Pending Order:', context.pendingOrder ? 'Yes' : 'No');
    console.log('-------------------\n');

    // Test 2: Safety Tip in Product Info
    console.log('Test 2: Safety Tip in Product Info for "ACER 50MG CAP"');
    const res2 = await ragService.getComprehensiveProductInfo("ACER 50MG CAP", mockProducts[0].metadata);
    console.log('Response contains Usage Tip:', res2.includes('Usage Tip'));
    console.log('-------------------\n');

    // Test 3: Recommendations
    console.log('Test 3: AI-driven Recommendations');
    context.cart = [{ productName: "AMOXI-CAP 500MG", quantity: 10 }];
    const recommendations = ragService.getRecommendations(context.cart);
    console.log('Recommendations for Amoxicillin:', recommendations);
    console.log('-------------------\n');

    // Test 4: Rich Layout Order Summary
    console.log('Test 4: Rich Layout Order Summary');
    const orderData = {
        customerName: "John Doe",
        customerPhone: "03211234567",
        deliveryAddress: "Street 1, RYK",
        deliveryCity: "Rahim Yar Khan",
        items: [
            { productName: "PANADOL TAB", quantity: 5, productCompany: "GSK", pack_size: "10S" },
            { productName: "AEROMAX SYP", quantity: 1, productCompany: "SHROOQ", pack_size: "60ML" }
        ]
    };
    const summary = ragService.generateOrderSummary(orderData);
    console.log('Summary layout check (👤, 📍, 📦):', summary.includes('👤') && summary.includes('📍') && summary.includes('📦'));
    console.log('Safety tips in summary:', summary.includes('Note: Take with a full glass') && summary.includes('Note: Shake well'));
    console.log('-------------------\n');
}

runTests().catch(console.error);
