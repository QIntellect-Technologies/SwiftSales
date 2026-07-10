require('dotenv').config({ path: '.env.local' });
const { dbHelpers } = require('./database');

async function testCart() {
    const sessionId = 'test-session-123';
    
    console.log('1. Saving cart with customer info...');
    await dbHelpers.saveCart(sessionId, {
        customer_name: 'Ubaid',
        customer_phone: '03001234567',
        delivery_address: 'Test Addr',
        cart: [{ product_id: '123', quantity: 2, price: 500 }],
        cart_total: 500
    });
    
    console.log('2. Fetching cart...');
    const result = await dbHelpers.getCart(sessionId);
    console.log('Result from getCart:', result);
    
    process.exit(0);
}

testCart();
