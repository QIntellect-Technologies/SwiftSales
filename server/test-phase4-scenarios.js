const axios = require('axios');

const CONFIG = {
    URL: 'http://localhost:5001/api/rag/query',
    SESSION_ID: 'phase4-audit-' + Math.floor(Math.random() * 1000000),
    PRODUCTS: {
        UNIQUE_1: 'Motilium',
        UNIQUE_2: 'Concor 5mg',
        AMBIGUOUS: 'Amoxil'
    }
};

async function runScenario(name, query, expectedCheck) {
    console.log(`\n▶️ SCENARIO: ${name}`);
    console.log(`Query: "${query}"`);

    try {
        const res = await axios.post(CONFIG.URL, {
            query,
            sessionId: CONFIG.SESSION_ID,
            context: {}
        });

        const data = res.data || {};
        const responseText = data.response || '';
        console.log(`Response Snippet: ${responseText.substring(0, 150)}...`);

        let result;
        try {
            result = expectedCheck(data);
        } catch (checkErr) {
            console.error('Check Error:', checkErr);
            console.log('Context Cart:', JSON.stringify(data.updatedContext ? data.updatedContext.cart : [], null, 2));
            result = `Check Syntax Error: ${checkErr.message}`;
        }

        if (result === true) {
            console.log('✅ PASSED');
        } else {
            console.log(`❌ FAILED: ${result}`);
        }
        return data;
    } catch (err) {
        console.error(`💥 AXIOS ERROR: ${err.message}`);
        return {};
    }
}

async function startAudit() {
    console.log('🚀 INITIALIZING PHASE 4 BRUTAL AUDIT 🚀');

    // --- CATEGORY A: SINGLE ITEM ADD ---

    await runScenario(
        'A.1 Add with Quantity',
        `Add 5 ${CONFIG.PRODUCTS.UNIQUE_1} to my cart`,
        (data) => {
            const cart = (data.updatedContext && data.updatedContext.cart) || [];
            if (cart.length === 0) return 'Cart is empty';
            const item = cart.find(i => i.productName && i.productName.toLowerCase().includes('motilium'));
            if (!item) return 'Motilium not found in cart';
            if (item.quantity !== 5) return `Wrong quantity: expected 5, got ${item.quantity}`;
            return true;
        }
    );

    // --- TURN 2: ADD ANOTHER ---
    await runScenario(
        'A.2 Add without Quantity',
        `I want to buy some ${CONFIG.PRODUCTS.UNIQUE_2}`,
        (data) => {
            const isPrompting = (data.response || '').includes('how many') ||
                (data.updatedContext && data.updatedContext.pendingOrder && data.updatedContext.pendingOrder.mode === 'awaiting_quantity');
            if (isPrompting) return true;
            return 'Should have asked for quantity';
        }
    );

    console.log('\n--- Turn 1: Triggering Ambiguity ---');
    const dataD1 = await runScenario(
        'D.1 Trigger Ambiguity',
        `Add 5 ${CONFIG.PRODUCTS.AMBIGUOUS}`,
        (data) => {
            const isAmbiguous = (data.response || '').includes('found') && (data.response || '').includes('versions');
            if (isAmbiguous) return true;
            return 'Should have triggered ambiguity prompt';
        }
    );

    if (dataD1 && dataD1.updatedContext && dataD1.updatedContext.pendingOrder) {
        console.log('\n--- Turn 2: Resolving Ambiguity via "number 1" ---');
        await runScenario(
            'D.2 Select Option #1',
            `number 1`,
            (data) => {
                const cart = (data.updatedContext && data.updatedContext.cart) || [];
                const item = cart.find(i => i.productName && i.productName.toLowerCase().includes('amoxil'));
                if (item) return true;
                return 'Failed to add product after selecting number 1';
            }
        );
    }

    // --- CATEGORY E: TYPOS & AMBIGUITY ---

    await runScenario(
        'E.1 Typo Handling',
        `Add 2 Motiliun`, // Note the typo 'n' instead of 'm'
        (data) => {
            const cart = (data.updatedContext && data.updatedContext.cart) || [];
            const item = cart.find(i => i.productName && i.productName.toLowerCase().includes('motilium'));
            if (!item) return 'Should have fuzzy matched Motiliun to Motilium';
            return true;
        }
    );

    console.log('\n--- Phase 4 Validation (A-E) Done ---');
}

startAudit();
