const axios = require('axios');

async function testPersistence() {
    const sessionId = 'test-persistence-session-' + Date.now();
    const url = 'http://localhost:5001/api/rag/query';

    console.log('🚀 Starting Robust Persistence Test (3-Turn Interactive)...');
    console.log(`Session ID: ${sessionId}`);

    try {
        // Step 1: Add a product that triggers ambiguity
        console.log('\n--- Turn 1: Adding Ambiguous Item (Amoxil) ---');
        const res1 = await axios.post(url, {
            query: 'Add 5 Amoxil to my cart',
            sessionId: sessionId,
            context: {}
        });
        console.log('Response:', res1.data.response);

        // Step 2: Resolve ambiguity
        console.log('\n--- Turn 2: Resolving Ambiguity (Selecting #1) ---');
        const res2 = await axios.post(url, {
            query: 'number 1',
            sessionId: sessionId,
            context: res1.data.updatedContext
        });
        console.log('Response:', res2.data.response);
        console.log('Cart after Turn 2:', JSON.stringify(res2.data.updatedContext.cart, null, 2));

        if (!res2.data.updatedContext.cart || res2.data.updatedContext.cart.length === 0) {
            console.error('❌ Failed to add item even after resolution.');
            return;
        }

        // Wait for DB save (asynchronous)
        console.log('\n--- Waiting for DB save ---');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 3: Persistence Check (Send query WITHOUT context)
        console.log('\n--- Turn 3: Checking Persistence (Sending {} context) ---');
        const res3 = await axios.post(url, {
            query: 'What is in my cart?',
            sessionId: sessionId,
            context: {} // EMPTY CONTEXT
        });

        console.log('Response:', res3.data.response);
        console.log('Cart in response:', JSON.stringify(res3.data.updatedContext.cart, null, 2));

        const cart = res3.data.updatedContext.cart;
        if (cart && cart.length > 0 && cart.some(item => item.productName.toLowerCase().includes('amoxil'))) {
            console.log('\n✅ PERSISTENCE TEST PASSED: Cart was successfully recovered from Database after Turn 3!');
        } else {
            console.log('\n❌ PERSISTENCE TEST FAILED: Cart was NOT recovered from Database.');
        }

    } catch (error) {
        console.error('❌ Test Error:', error.message);
        if (error.response) {
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testPersistence();
