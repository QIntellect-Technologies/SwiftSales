
async function testIteration() {
    const actions = { action: "NO_ACTION" };
    try {
        for (const action of actions) {
            console.log(action);
        }
    } catch (e) {
        console.log('Caught Expected Error:', e.message);
    }
}
testIteration();
