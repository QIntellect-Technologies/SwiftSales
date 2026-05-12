const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Prioritized list of models for fallback
const MODELS = [
    'llama-3.3-70b-versatile',
    'llama-3.1-70b-versatile',
    'llama3-70b-8192',
    'llama-3.1-8b-instant'
];

const PROMPT = `
━━━━━━━━━━━━━━━━━━━━━━━
SWIFTBOT EXECUTIVE v10.0 (UNIVERSAL AUTONOMY)
━━━━━━━━━━━━━━━━━━━━━━━

IDENTITY:
You are the Senior Sales Executive for "Swift Sales Healthcare". You are professional, empathetic, and DIRECT. Your goal is to provide a seamless, conversational experience identical to our WhatsApp service.

PERSONALITY & VOICE:
- **Conversational & Human**: Do not sound like a bot. Use phrases like "I'm doing well, thanks for asking" or "Sorry to hear you're not feeling well."
- **Helpful Proactivity**: Always offer the inventory link early. Suggest 2-3 specific products (e.g., "TOLCARE 2MG TAB", "ACTRAC SOFT CAP") to show variety.
- **WhatsApp Style**: Use single asterisks for *italics* or **bold**. No markdown headers (#) or complex tables. Use clean lists.

STRICT BEHAVIORAL RULES:
1. **GREETING**: When a user says "hi" or "hello", welcome them warmly and immediately offer the inventory link: https://swiftsalesbot-production.up.railway.app/api/inventory/download. Use *bold* for emphasis on key words.
2. **QUANTITY CHECK**: If a user mentions a medicine but NO quantity, you MUST provide the unit price first, then ask: "How many [unit] do you require?" (e.g., "We have *ACIPRAZ 40MG CAP* in stock for *Rs. 290* per unit. How many do you require?").
3. **CART SUMMARIES**: Every time you add an item, show a clear *Your current cart:* summary with items and totals.
4. **ADDRESS COLLECTION**: Ask for Name, Phone, and a *complete* address (Street, City, Postal Code). Confirm if their current phone number is correct.
5. **ZERO HALLUCINATION**: Only suggest or add products that exist in the RAG_CONTEXT. If not found, say: "I couldn't find *[Product]* in our inventory."
6. **ACTION EMISSION**: Always emit JSON in <ACTIONS> at the very end if an action (ADD_TO_CART, PLACE_ORDER) is performed. The JSON MUST be an array, e.g., <ACTIONS>[{"type": "ADD_TO_CART", ...}]</ACTIONS>.

EXAMPLE FLOW (MATCH THIS):
User: hi
Bot: Welcome to our pharmacy! How can I assist you today? Are you looking for a specific medicine or would you like to browse our inventory? You can download our *inventory list* here: https://swiftsalesbot-production.up.railway.app/api/inventory/download

User: i want to order ACIPRAZ
Bot: We have *ACIPRAZ 40MG CAP* in stock, and the price is *Rs. 290* per unit. However, I need to know how many units you would like to order. How many *ACIPRAZ 40MG CAP* do you require?
`;

async function generateAIResponse(userMessage, ragData = {}, session = {}) {
    const apiKey = process.env.GROK_API_KEY || process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error('GROQ_API_KEY is missing');
        return {
            content: "I'm sorry, I'm having trouble connecting to my central system. Please try again later.",
            actions: []
        };
    }

    // Structured Context Injection (Rich Memory)
    const contextInjection = `
USER_SESSION: ${JSON.stringify({
        sessionId: session.sessionId || 'website_user',
        customer_name: session.customer_name || 'Customer',
        delivery_address: session.delivery_address || 'Not Provided',
        current_cart: session.cart || [],
        cart_total: session.cart_total || 0,
    }, null, 2)}

RAG_CONTEXT: ${JSON.stringify(ragData, null, 2)}
`;

    // Clean history
    const cleanHistory = (session.history || []).slice(-10).map(h => ({
        role: h.role === 'bot' ? 'assistant' : h.role,
        content: typeof h.content === 'string' ? h.content.replace(/<(ACTIONS|actions)>.*?<\/(ACTIONS|actions)>/si, '').trim() : (h.text || '')
    }));

    const messages = [
        { role: 'system', content: PROMPT },
        { role: 'system', content: contextInjection },
        ...cleanHistory,
        { role: 'user', content: userMessage }
    ];

    for (const model of MODELS) {
        try {
            console.log(`[AI] Attempting response with model: ${model}`);
            const response = await axios.post(GROQ_API_URL, {
                model: model,
                messages: messages,
                temperature: 0.3,
                max_tokens: 1024,
                top_p: 0.9,
                stream: false
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            let content = response.data.choices[0].message.content || "";
            let actions = [];

            // Parse <ACTIONS> block
            const actionMatch = content.match(/<(ACTIONS|actions)>(.*?)<\/(ACTIONS|actions)>/s);
            if (actionMatch) {
                try {
                    let parsedActions = JSON.parse(actionMatch[2].trim());
                    actions = Array.isArray(parsedActions) ? parsedActions : [parsedActions];
                    // Keep the content clean
                    content = content.replace(/<(ACTIONS|actions)>.*?<\/(ACTIONS|actions)>/si, '').trim();
                } catch (e) {
                    console.error(`[AI] Failed to parse actions:`, e.message);
                }
            }

            return { content, actions };
        } catch (error) {
            console.error(`[AI] Error with ${model}:`, error.message);
            if (error.response?.status === 429) continue;
            break; 
        }
    }

    return {
        content: "I'm experiencing technical difficulties. Please contact our team at 03008607811",
        actions: []
    };
}

module.exports = { generateAIResponse };
