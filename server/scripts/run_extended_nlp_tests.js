const fs = require('fs');
const fetch = global.fetch || require('node-fetch');
const BASE = process.env.BASE_URL || 'http://localhost:5000/api';
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
async function postQuery(query, sessionId, context = {}) {
  const res = await fetch(`${BASE}/rag/query`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, sessionId, context })
  });
  return res.json();
}
async function createOrder(orderData) {
  const res = await fetch(`${BASE}/orders/create`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  return res.json();
}

// Build 30 scenarios; one long scenario has 25 messages
const scenarios = [];
// reuse some shorter scenario templates
const shortTemplates = [
  ["Hi, I want to order PANADOL", "I want 2 PANADOL", "Proceed to checkout", "My name is Test User", "+923001234567", "House 1, Test City", "skip", "yes"],
  ["Do you have ISOCEF?", "If available reserve one"],
  ["I have sore throat and fever", "What non-prescription options?"],
  ["I need AUGMENTIN 625mg", "I have a prescription"],
  ["I want 3 ORNISIT SACHET", "Proceed", "Name: Alice", "03001234567", "Address: Test Area", "confirm"]
];

// create 24 varied scenarios programmatically
for (let i = 0; i < 24; i++) {
  const idx = i % shortTemplates.length;
  const msgs = shortTemplates[idx].slice();
  // vary some tokens
  msgs[0] = msgs[0] + (i%2===0 ? ' please' : ' asap');
  scenarios.push({ name: `Auto Scenario ${i+1}`, messages: msgs });
}

// Add the original 10-like detailed scenarios as additional coverage (reuse some phrasing)
const more = [
  { name: 'Ext - Typo check', messages: ["hi, do you have panadole or panado? (sorry for typo)", "If not, what for migraine?", "Add 2 of recommended"] },
  { name: 'Ext - FAQ vs product', messages: ["Do you have ISOCEF?", "Manufacturer and pack size?", "Reserve one"] },
  { name: 'Ext - Prescription flow', messages: ["I need AUGMENTIN 625mg", "Can I upload prescription later?", "Connect to pharmacist"] }
];
for (const s of more) scenarios.push(s);

// Long scenario with 25 messages
const longMsgs = [];
longMsgs.push("Hello SwiftBot, I need help placing a complex order.");
longMsgs.push("I want 2 PANADOL 500mg and 3 ORUXIN 250MG");
longMsgs.push("Also add 1 AUGMENTIN 625mg (I will upload prescription later)");
longMsgs.push("Reduce PANADOL to 1");
longMsgs.push("Add 5 POFEN 500mg");
longMsgs.push("Proceed to checkout");
longMsgs.push("Name: Long Conversation Test");
longMsgs.push("0300 1112222");
longMsgs.push("House 77, Long Street, Test City");
longMsgs.push("skip");
longMsgs.push("Confirm the order and use COD");
longMsgs.push("Yes, place the order");
// Follow-up messages (simulate user questions about order)
for (let k=0;k<12;k++) {
  longMsgs.push(`Follow-up question ${k+1}: What is the ETA?`);
  longMsgs.push(`User: ok also add note ${k+1}`);
}
scenarios.push({ name: 'Long Complex Conversation', messages: longMsgs });

// Ensure we have at least 30
while (scenarios.length < 30) scenarios.push({ name: `Extra ${scenarios.length+1}`, messages: ["Hi there", "I want PANADOL", "Proceed", "skip", "yes"] });

async function runScenario(s, id) {
  console.log('\n=== Running: ' + s.name + ' ===');
  const sessionId = `EXT-${id}-${Date.now()}`;
  let context = {};
  let lastResponse = null;
  let passes = 0; let fails = 0;

  for (let i = 0; i < s.messages.length; i++) {
    const text = s.messages[i];
    process.stdout.write(`> ${text}\n`);
    try {
      const res = await postQuery(text, sessionId, context);
      lastResponse = res;
      const reply = typeof res.response === 'string' ? res.response : JSON.stringify(res.response);
      console.log('Bot:', reply.split('\n').slice(0,5).join('\n'));

      if (!reply || reply.trim().length < 2) { fails++; console.warn('  ✖ Empty or invalid reply'); }
      else { passes++; }

      if (res.updatedContext) context = res.updatedContext;

      if (res.type === 'order_ready' && res.orderData) {
        // submit order
        const payload = {
          sessionId,
          customerName: res.orderData.customerName || 'Ext',
          customerPhone: res.orderData.customerPhone || '+920000000000',
          customerEmail: res.orderData.customerEmail || null,
          deliveryAddress: res.orderData.deliveryAddress || 'Ext Addr',
          deliveryCity: res.orderData.deliveryCity || 'Not specified',
          orderItems: res.orderData.orderItems || res.orderData.items || []
        };
        const cr = await createOrder(payload);
        console.log('  → Order API response:', cr && cr.success ? 'OK' : JSON.stringify(cr));
      }

      await sleep(120);
    } catch (err) { console.error('Request error:', err && err.message ? err.message : err); fails++; break; }
  }
  return { scenario: s.name, passes, fails, lastResponse };
}

async function main() {
  const results = [];
  for (let i = 0; i < scenarios.length; i++) {
    const r = await runScenario(scenarios[i], i+1);
    results.push(r);
    await sleep(300);
  }
  const out = require('path').join(__dirname, 'extended_nlp_results.json');
  fs.writeFileSync(out, JSON.stringify(results, null, 2));
  console.log('\nFinished extended tests. Results saved to', out);
}

if (require.main === module) main();
