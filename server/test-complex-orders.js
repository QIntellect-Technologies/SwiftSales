const { getRAGService } = require('./services/rag');

async function runTests() {
    console.log('🧪 Starting Complex Ordering System Tests...\n');

    const ragService = getRAGService();
    const context = { cart: [] };

    // Mock relevant products (representing what vector search + reranker would return)
    const mockProducts = [
        { metadata: { id: "001204", name: "ACER 50MG CAP", company: "SHROOQ PHARMA", pack_size: "30`S" }, similarity: 0.9 },
        { metadata: { id: "001166", name: "AEROMAX 10MG TAB", company: "SHROOQ PHARMA", pack_size: "14`S" }, similarity: 0.85 },
        { metadata: { id: "001110", name: "BALAX INJ 10AMP", company: "SHROOQ PHARMA", pack_size: "10S" }, similarity: 0.8 },
        { metadata: { id: "001145", name: "AVIFIX TAB", company: "SHROOQ PHARMA", pack_size: "10S" }, similarity: 0.8 }
    ];

    // Test 1: Single Item Order
    console.log('Test 1: Single item order "I want 5 ACER 50MG CAP"');
    const res1 = await ragService.generateResponse("I want 5 ACER 50MG CAP", mockProducts, context);
    console.log('Response:', res1.split('\n')[0]);
    console.log('Cart Items:', context.cart.length);
    console.log('-------------------\n');

    // Test 2: Multi-Item Order
    console.log('Test 2: Multi-item order "I want 2 BALAX INJ and 5 AVIFIX TAB"');
    const res2 = await ragService.generateResponse("I want 2 BALAX INJ and 5 AVIFIX TAB", mockProducts, context);
    console.log('Response summary:', res2.split('\n').filter(l => l.includes('🛒') || l.includes('Cart')).join(' '));
    console.log('Cart Items:', context.cart.length);
    console.log('-------------------\n');

    // Test 3: Remove Item
    console.log('Test 3: Remove item "Please remove ACER 50MG"');
    const res3 = await ragService.generateResponse("Please remove ACER 50MG", [], context);
    console.log('Response:', res3.split('\n')[0]);
    console.log('Cart Items:', context.cart.length);
    console.log('-------------------\n');

    // Test 4: Update Quantity
    console.log('Test 4: Update quantity "Change AVIFIX TAB to 20 pieces"');
    const res4 = await ragService.generateResponse("Change AVIFIX TAB to 20 pieces", mockProducts, context);
    console.log('Response:', res4.split('\n')[0]);
    const avifix = context.cart.find(i => i.productName.toUpperCase().includes('AVIFIX'));
    console.log('AVIFIX Quantity:', avifix ? avifix.quantity : 'Not found');
    console.log('-------------------\n');

    // Test 5: Checkout Initiation
    console.log('Test 5: Checkout "proceed to checkout"');
    const res5 = await ragService.generateResponse("proceed to checkout", [], context);
    console.log('Response snippet:', res5.substring(0, 50) + '...');
    console.log('Order State:', context.orderState);
    console.log('-------------------\n');

    console.log('📦 Final Cart State:');
    context.cart.forEach(i => console.log(`- ${i.productName}: ${i.quantity}`));
}

runTests().catch(console.error);
