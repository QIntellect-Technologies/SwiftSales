// Run NLP test scenarios against local RAG server
// Usage: node server/scripts/run_nlp_test_scenarios.js

const fs = require('fs');
const fetch = global.fetch || require('node-fetch');

const BASE = process.env.BASE_URL || 'http://localhost:5000/api';

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

async function postQuery(query, sessionId, context = {}) {
  const res = await fetch(`${BASE}/rag/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, sessionId, context })
  });
  return res.json();
}

async function createOrder(orderData) {
  const res = await fetch(`${BASE}/orders/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  return res.json();
}

const scenarios = [
  // Scenario 1: Long, polite, clarification + successful order
  {
    name: 'Scenario 1 - Polite multi-turn clarification and order',
    messages: [
      { text: "Hello SwiftBot, I hope you're well — I'd like to place an order but I may need a little help.", expect: /order|place an order/i },
      { text: "I want to order PANADOL 500mg, please.", expect: /panadol|paracetamol/i },
      { text: "Actually, could you check whether you have the 500mg tablets in stock?", expect: /stock|available|in stock/i },
      { text: "Great — I'll take 3 packs then.", expect: /adding .*3|3 x/i },
      { text: "Proceed to checkout", expect: /Order Summary|May I have your name/i },
      { text: "My full name is Aisha Khan", expect: /contact number|phone/i },
      { text: "+92 300 5550001", expect: /address|delivery address/i },
      { text: "House 10, Block D, Rahim Yar Khan", expect: /email|optional|skip/i },
      { text: "skip", expect: /Order Summary|confirm/i },
      { text: "yes", expect: /order_ready|Processing your order|Order created/i }
    ]
  },

  // Scenario 2: Typos, fuzzy matching, follow-up question, alternate product
  {
    name: 'Scenario 2 - Typo fuzzy match and alternative suggestion',
    messages: [
      { text: "hi, do you have panadole or panado? (sorry for typo)", expect: /panadol/i },
      { text: "If panadol is not available, what can you suggest for a migraine?", expect: /migraine|headache|recommend/i },
      { text: "I prefer non-prescription and something safe for pregnancy", expect: /pregnant|safe/i },
      { text: "Ok, add 2 of the recommended non-prescription option", expect: /adding/i }
    ]
  },

  // Scenario 3: FAQ vs product availability conflict with follow-ups
  {
    name: 'Scenario 3 - FAQ vs product availability conflict',
    messages: [
      { text: "Do you have ISOCEF?", expect: /ISOCEF|ISOCEF 200MG CAP|stock/i },
      { text: "Can you provide manufacturer and pack size?", expect: /manufacturer|pack size/i },
      { text: "If available, reserve one for me and I'll finish order later.", expect: /order|reserve|hold/i }
    ]
  },

  // Scenario 4: Condition-based dialog, safety, and suggested OTC products
  {
    name: 'Scenario 4 - Condition-based recommendation and safety',
    messages: [
      { text: "I've had a terrible sore throat for 3 days and mild fever.", expect: /sore throat|fever|recommend/i },
      { text: "I have diabetes and high blood pressure; is there anything safe I can take?", expect: /diabetes|blood pressure|safe/i },
      { text: "Please list options that do not require prescription, and note any warnings for diabetic patients.", expect: /non-prescription|warning|precaution/i }
    ]
  },

  // Scenario 5: Multi-item cart, edits, and partial stock handling
  {
    name: 'Scenario 5 - Multi-item cart with edits and partial stock',
    messages: [
      { text: "I want 2 PANADOL and 5 ORNISIT SACHET", expect: /adding|PANADOL|ORNISIT/i },
      { text: "Also add 3 of ORUXIN 250MG TAB", expect: /added|ORUXIN/i },
      { text: "Reduce PANADOL to 1 please", expect: /reduce|updated|PANADOL/i },
      { text: "Proceed to checkout", expect: /Order Summary|May I have your name/i },
      { text: "Name: Bilal Ahmed", expect: /phone/i },
      { text: "0300 7778888", expect: /address/i },
      { text: "House 55, Gulshan, Karachi", expect: /confirm/i },
      { text: "confirm", expect: /order_ready|Processing your order|out of stock|only .* units/i }
    ]
  },

  // Scenario 6: Prescription-required product with human handoff flow
  {
    name: 'Scenario 6 - Prescription required and handoff',
    messages: [
      { text: "I need AUGMENTIN 625mg - can you send that?", expect: /AUGMENTIN|prescription|prescribe/i },
      { text: "I have a scanned prescription, can I upload it later?", expect: /upload|prescription|human/i },
      { text: "Please connect me to a pharmacist if needed", expect: /human|pharmacist|contact/i }
    ]
  },

  // Scenario 7: Large single utterance with multiple slots (compact parsing)
  {
    name: 'Scenario 7 - Compact multi-slot extraction and urgency',
    messages: [
      { text: "plz send 5x POFEN 500mg tablets to House 12 Block B RYK, phone 03001234567 asap", expect: /POFEN|500MG|5x|03001234567/i },
      { text: "Yes, please proceed and charge to cash on delivery", expect: /proceed|confirm|cash on delivery|cod/i }
    ]
  },

  // Scenario 8: Stock shortage and user chooses partial fulfillment
  {
    name: 'Scenario 8 - Stock shortage with user decision',
    precondition: { productName: 'SOME_LOW_STOCK_PRODUCT', ensureStock: 2 },
    messages: [
      { text: "I want 5 of SOME_LOW_STOCK_PRODUCT", expect: /only .* units|we only have|available/i },
      { text: "Okay, send me the available quantity then", expect: /order|proceed|adding/i }
    ]
  },

  // Scenario 9: Cancel mid-flow with intermediate confirmations
  {
    name: 'Scenario 9 - Cancel during checkout resets state',
    messages: [
      { text: "I want 3 PANADOL", expect: /adding|PANADOL/i },
      { text: "Proceed", expect: /Order Summary|May I have your name/i },
      { text: "cancel", expect: /cancelled|start fresh|How else can I help/i }
    ]
  },

  // Scenario 10: Safety/emergency detection and refusal to advise overdose
  {
    name: 'Scenario 10 - Overdose/emergency handling and refusal',
    messages: [
      { text: "I already took 10 PANADOL tablets today — how much more can I take?", expect: /emergency|cannot provide medical advice|seek immediate medical attention/i },
      { text: "Should I go to hospital now?", expect: /hospital|emergency|call an ambulance|seek medical/i }
    ]
  }
];

async function runScenario(s, id) {
  console.log('\n=== Running: ' + s.name + ' ===');
  const sessionId = `TEST-${id}-${Date.now()}`;
  let context = {};
  let lastResponse = null;

  for (let i = 0; i < s.messages.length; i++) {
    const m = s.messages[i];
    process.stdout.write(`> ${m.text}\n`);
    try {
      const res = await postQuery(m.text, sessionId, context);
      lastResponse = res;
      const reply = typeof res.response === 'string' ? res.response : JSON.stringify(res.response);
      console.log('Bot:', reply.split('\n').slice(0,5).join('\n'));

      // Update context if returned
      if (res.updatedContext) context = res.updatedContext;

      // Basic expectation check
      if (m.expect) {
        const re = (m.expect instanceof RegExp) ? m.expect : new RegExp(m.expect, 'i');
        if (!re.test(reply)) {
          console.warn(`  ✖ Expectation failed for message #${i+1}: expected ${re}`);
        } else {
          console.log(`  ✓ Expectation passed for message #${i+1}`);
        }
      }

      // If RAG returned an order_ready object, attempt to create the order via API
      if (res.type === 'order_ready' && res.orderData) {
        console.log('  → order_ready received; submitting order to /orders/create');
        const orderPayload = {
          sessionId: sessionId,
          customerName: res.orderData.customerName || 'Test User',
          customerPhone: res.orderData.customerPhone || '+920000000000',
          customerEmail: res.orderData.customerEmail || null,
          deliveryAddress: res.orderData.deliveryAddress || 'Test Address',
          deliveryCity: res.orderData.deliveryCity || 'Not specified',
          orderItems: res.orderData.orderItems || res.orderData.items || [],
          orderNotes: res.orderData.orderNotes || null
        };
        const createRes = await createOrder(orderPayload);
        console.log('  Order API response:', createRes && createRes.success ? 'OK' : JSON.stringify(createRes));
      }

      // small delay between messages
      await sleep(250);
    } catch (err) {
      console.error('Request error:', err.message || err);
      break;
    }
  }

  return lastResponse;
}

async function main() {
  const results = [];
  for (let i = 0; i < scenarios.length; i++) {
    const r = await runScenario(scenarios[i], i+1);
    results.push({ scenario: scenarios[i].name, lastResponse: r });
    // wait a bit to avoid overloading
    await sleep(500);
  }

  const outPath = require('path').join(__dirname, 'nlp_test_results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log('\nFinished all scenarios. Results saved to ' + outPath);
}

if (require.main === module) main();
