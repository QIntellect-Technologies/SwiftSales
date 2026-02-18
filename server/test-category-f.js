
const axios = require('axios');
const { supabase } = require('./services/supabase');

const CONFIG = {
    URL: 'http://localhost:5001/api/rag/query',
    SESSION_ID: 'phase4-sync-' + Math.floor(Math.random() * 1000000),
    TEST_PRODUCT_ID: 'da853d54-157e-42ed-acb9-f8169fcd3ec2', // Motilium
    TEST_PRODUCT_NAME: 'Motilium'
};

async function runScenario(name, query, validator) {
    console.log(`\n▶️ SCENARIO: ${name}`);
    console.log(`Query: "${query}"`);
    try {
        const res = await axios.post(CONFIG.URL, {
            query,
            sessionId: CONFIG.SESSION_ID,
            context: {}
        });
        const result = validator(res.data);
        if (result === true) {
            console.log('✅ PASSED');
        } else {
            console.log(`❌ FAILED: ${result}`);
            console.log(`FULL RESPONSE: ${res.data.response}`);
        }
        return res.data;
    } catch (err) {
        console.error('💥 ERROR:', err.response ? err.response.data : err.message);
        return null;
    }
}

async function startCategoryFAudit() {
    console.log('🚀 INITIALIZING CATEGORY F: REAL-TIME SYNC AUDIT 🚀');

    // 1. Get Initial Price
    const { data: initialData } = await supabase.from('medicines').select('price, stock').eq('id', CONFIG.TEST_PRODUCT_ID).single();
    const originalPrice = initialData.price;
    const originalStock = initialData.stock;

    console.log(`[BASE] Initial Price for ${CONFIG.TEST_PRODUCT_NAME}: ${originalPrice}`);

    // --- F.1: Price Update Reflection ---
    const newPrice = originalPrice + 10;
    console.log(`[MUTATION] Updating price to: ${newPrice}`);
    await supabase.from('medicines').update({ price: newPrice }).eq('id', CONFIG.TEST_PRODUCT_ID);

    await runScenario(
        'F.1 Price Update Reflection',
        `How much is ${CONFIG.TEST_PRODUCT_NAME}?`,
        (data) => {
            const lowerResp = data.response.toLowerCase();
            // Check if the new price is mentioned (rounding might happen)
            if (lowerResp.includes(newPrice.toFixed(0)) || lowerResp.includes(newPrice.toFixed(2).split('.')[0])) {
                return true;
            }
            return `Expected price ${newPrice} to be reflected in response. Response: ${data.response}`;
        }
    );

    // Revert Price
    await supabase.from('medicines').update({ price: originalPrice }).eq('id', CONFIG.TEST_PRODUCT_ID);

    // --- F.2: Mid-Session Stock Reduction ---
    console.log(`[MUTATION] Reducing stock to 2`);
    await supabase.from('medicines').update({ stock: 2 }).eq('id', CONFIG.TEST_PRODUCT_ID);

    await runScenario(
        'F.2 Stock Negotiation',
        `Add 10 ${CONFIG.TEST_PRODUCT_NAME} to my cart`,
        (data) => {
            const lowerResp = data.response.toLowerCase();
            if (lowerResp.includes('negotiation') || (lowerResp.includes('only') && lowerResp.includes('2'))) {
                return true;
            }
            return 'Should have triggered stock negotiation for only 2 items.';
        }
    );

    // Revert Stock
    await supabase.from('medicines').update({ stock: originalStock }).eq('id', CONFIG.TEST_PRODUCT_ID);

    // --- F.3: Deleted Product Lookup (Mark as Out of Stock/Unavailable) ---
    console.log(`[MUTATION] Marking as Unavailable`);
    await supabase.from('medicines').update({ status: 'Out of Stock' }).eq('id', CONFIG.TEST_PRODUCT_ID);

    await runScenario(
        'F.3 Deleted Product Lookup',
        `Add 2 ${CONFIG.TEST_PRODUCT_NAME}`,
        (data) => {
            const lowerResp = data.response.toLowerCase();
            if (lowerResp.includes("couldn't find") || lowerResp.includes("out of stock") || lowerResp.includes("not available")) {
                return true;
            }
            return 'Should have informed that product is unavailable.';
        }
    );

    // Final Revert
    await supabase.from('medicines').update({ status: 'Available' }).eq('id', CONFIG.TEST_PRODUCT_ID);

    console.log('\n--- Category F Validation Done ---');
}

startCategoryFAudit();
