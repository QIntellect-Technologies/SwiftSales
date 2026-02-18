const axios = require('axios');

async function runReproduction() {
    const baseUrl = 'http://localhost:5001/api/chat';
    const sessionId = 'repro_' + Date.now();

    const steps = [
        { q: "how to place the order", expected: ["Follow these simple steps", "Find Medicine"] },
        { q: "show me the products of Roche Holding AG", expected: ["Here are the products", "Roche"] }
    ];

    console.log("🚀 STARTING REPRODUCTION SCRIPT\n");

    let context = {};

    for (const step of steps) {
        console.log(`\nQuery: "${step.q}"`);
        try {
            const res = await axios.post(baseUrl, {
                message: step.q,
                sessionId: sessionId,
                context: context
            });

            if (res.data.updatedContext) {
                context = res.data.updatedContext;
            }

            const resp = res.data.response;
            console.log(`Response: ${resp.substring(0, 150).replace(/\n/g, ' ')}...`);

            const passed = step.expected.some(e => resp.includes(e));
            if (passed) {
                console.log("✅ PASSED");
            } else {
                console.log("❌ FAILED");
            }
        } catch (err) {
            console.error("❌ ERROR:", err.message);
        }
    }
}

runReproduction();
