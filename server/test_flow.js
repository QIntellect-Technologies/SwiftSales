require('dotenv').config({ path: '.env.local' });
const axios = require('axios');
const { dbHelpers } = require('./database');

async function testFullFlow() {
    const sessionId = 'test-flow-' + Date.now();
    let currentContext = {};

    console.log('--- Step 1: Add to Cart ---');
    let res1 = await axios.post('http://localhost:5000/api/rag/query', {
        query: 'i want to place an order for 20 box of ACER 50MG CAP',
        context: currentContext,
        sessionId
    });
    currentContext = res1.data.updatedContext;
    console.log('Bot:', res1.data.response);
    console.log('Cart Length:', currentContext.cart?.length);

    console.log('\n--- Step 2: Provide Details ---');
    let res2 = await axios.post('http://localhost:5000/api/rag/query', {
        query: 'xyz,453-7654,babdbsbbsb,,ryk,64200',
        context: currentContext,
        sessionId
    });
    currentContext = res2.data.updatedContext;
    console.log('Bot:', res2.data.response);
    console.log('Extracted Details:', {
        name: currentContext.customer_name,
        phone: currentContext.customer_phone,
        address: currentContext.delivery_address
    });

    console.log('\n--- Step 3: Checkout ---');
    let res3 = await axios.post('http://localhost:5000/api/rag/query', {
        query: 'checkout',
        context: currentContext,
        sessionId
    });
    currentContext = res3.data.updatedContext;
    console.log('Bot:', res3.data.response);
}

testFullFlow().catch(err => console.error(err.response?.data || err.message));
