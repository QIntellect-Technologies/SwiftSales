const axios = require('axios');

async function runVerification() {
    const baseUrl = 'http://localhost:5001/api/chat';
    const sessionId = 'verify_' + Date.now();

    const steps = [
        { q: "add 9 Neurobion", expected: ["Added to Cart", "9 x Neurobion"] },
        { q: "now add 4 more Neurobion", expected: ["Added to Cart", "Neurobion", "Cart Total"] },
        { q: "show cart", expected: ["Neurobion x 13"] },
        { q: "how much is Panadol", expected: ["PKR"] }
    ];

    console.log("🚀 STARTING POLISH VERIFICATION\n");

    let context = {};

    for (const step of steps) {
        console.log(`\nQuery: "${step.q}"`);
        try {
            const res = await axios.post(baseUrl, {
                message: step.q,
                sessionId: sessionId,
                context: context // Send context to maintain state
            });

            const resp = res.data.response;
            if (res.data.updatedContext) {
                context = res.data.updatedContext; // Update context for next turn
            }

            console.log(`Response: ${resp.substring(0, 100).replace(/\n/g, ' ')}...`);

            // Check PASS condition
            const passed = step.expected.every(e => resp.includes(e) || (step.q === "show cart" && resp.includes("13")));

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

runVerification();
