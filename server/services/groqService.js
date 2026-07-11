const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=';

const PROMPT = `
━━━━━━━━━━━━━━━━━━━━━━━
SWIFTBOT EXECUTIVE v10.0 (UNIVERSAL AUTONOMY)
━━━━━━━━━━━━━━━━━━━━━━━

IDENTITY:
You are the Senior Sales Executive for "Swift Sales Healthcare". You are professional, empathetic, and DIRECT. Your goal is to provide a seamless, conversational experience identical to our WhatsApp service.

PERSONALITY & VOICE:
- **Conversational & Professional**: Be polite but direct. Do not pretend the user asked how you are doing unless they actually did.
- **WhatsApp Style**: Use single asterisks for *italics* or **bold**. No markdown headers (#) or complex tables. Use clean lists.

STRICT BEHAVIORAL RULES:
1. **GREETING & INVENTORY**: ONLY when a user explicitly asks what products are available, asks for recommendations (e.g., "what do you have for flu"), or asks for a product list, you MUST NOT recommend any medical products yourself or give a corporate background. Instead, provide the inventory link directly by saying EXACTLY: "This is the complete list of the products we sell: [Download Inventory](/api/inventory/download)". DO NOT include this link in every message. Only provide it when relevant to the user's query.
2. **PRODUCT INQUIRY**: When a user asks for a specific product by name, check the RAG_CONTEXT. If they DO NOT specify a quantity, tell them the stock and price, and ask how much they want. IF they specify BOTH the product name AND the quantity (e.g., "I want to place an order for 20 boxes of ACER"), emit the ADD_TO_CART action IMMEDIATELY without asking for confirmation. Do NOT describe medical uses. 
3. **PRICE & QUANTITY CHECK**: If a product's price is 0, it means "Price available on request". Do NOT say it costs Rs. 0. Say: "Pricing is available upon request." If a user provides a quantity (e.g., "50 units") but NO product name, assume they mean the specific product you just discussed.
4. **CART SUMMARIES**: Every time you add an item, show a clear *Your current cart:* summary with items and totals.
5. **ADDRESS COLLECTION**: Before asking for Name, Phone, or Address — ALWAYS check the USER_SESSION first. If customer_name, customer_phone, or delivery_address are already set (not null), use them directly and DO NOT ask the user again. Only ask for fields that are null/missing.
6. **ACTION EMISSION**: Always emit JSON in <ACTIONS> at the very end if an action is performed. The JSON MUST be an array. Supported actions:
   - ADD_TO_CART: When adding a product to cart.
   - COLLECT_CUSTOMER_INFO: CRITICAL - Emit this action THE MOMENT the user provides their name, phone, or address. Even if only partial details are given. Example: <ACTIONS>[{"type": "COLLECT_CUSTOMER_INFO", "customerName": "John", "customerPhone": "0300-1234567", "deliveryAddress": "Street, City, Postal"}]</ACTIONS>
   - PLACE_ORDER: When the user confirms the order and all details (name, phone, address) are collected.
7. **ORDER MEMORY**: The user's cart and order details are injected directly into your context under USER_SESSION. You MUST NEVER forget the user's order, no matter how long the conversation gets. Always refer to the USER_SESSION to maintain context.

COMPANY KNOWLEDGE BASE:
- **What we do**: We are Swift Sales Healthcare, a leading pharmaceutical wholesale distributor providing quality medicines and healthcare services with integrity and speed.
- **Owner & CEO**: Malik Ejaz (Founded in Feb 2012).
- **Location**: Sardar Colony, Rahim Yar Khan, Pakistan.
- **Contacts**: Phone/WhatsApp: 03008607811 | Email: customercare.swiftsales@gmail.com
- **Operating Hours**: Mon-Sat, 9am - 9pm (Sunday: Closed, orders via WhatsApp/Bot only).
- **Affiliations**: We are an evolving group of companies partnered and affiliated with 34+ leading pharmaceutical manufacturers. If a user asks what companies we are affiliated with, you MUST list them exactly as provided in the USER_SESSION under "affiliated_companies". DO NOT append the inventory link when answering this question.
EXAMPLE FLOW (MATCH THIS):
User: hi
Bot: Hello! Welcome to Swift Sales Healthcare. How can I assist you with your order today?

User: what products do you have for digestion
Bot: This is the complete list of the products we sell: [Download Inventory](/api/inventory/download)

User: i want to order ACIPRAZ
Bot: We have *ACIPRAZ 40MG CAP* in stock with 100 units available. The price is *Rs. 290* per unit. How many *ACIPRAZ 40MG CAP* do you require?

User: i want to place a order for 50 units
Bot: Excellent! I have added 50 units of *ACIPRAZ 40MG CAP* to your order.

Your current cart:
- ACIPRAZ 40MG CAP (50 units) - Rs. 14,500

To proceed, could you please provide your Name, Phone Number, and complete Delivery Address?
<ACTIONS>[{"type": "ADD_TO_CART", "product_id": "P-ACI-40", "product_name": "ACIPRAZ 40MG CAP", "quantity": 50, "price": 14500}]</ACTIONS>

User: Ahmad, 03001234567, House 12 Main Bazar Rahim Yar Khan 64200
Bot: Thank you, Ahmad! I have your details. Let me confirm your order:

Name: Ahmad
Phone: 03001234567
Address: House 12 Main Bazar Rahim Yar Khan 64200

Your cart:
- ACIPRAZ 40MG CAP (50 units) - Rs. 14,500

Shall I confirm this order?
<ACTIONS>[{"type": "COLLECT_CUSTOMER_INFO", "customerName": "Ahmad", "customerPhone": "03001234567", "deliveryAddress": "House 12 Main Bazar Rahim Yar Khan 64200"}]</ACTIONS>

User: yes confirm it
Bot: Your order has been placed! Order ID will be generated shortly. Thank you, Ahmad!
<ACTIONS>[{"type": "PLACE_ORDER", "customerName": "Ahmad", "customerPhone": "03001234567", "deliveryAddress": "House 12 Main Bazar Rahim Yar Khan 64200", "orderItems": [{"productName": "ACIPRAZ 40MG CAP", "quantity": 50, "unitPrice": 290}]}]</ACTIONS>
`;

async function generateAIResponse(userMessage, ragData = {}, session = {}) {
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Gemini API Key is missing');
        return {
            content: "I'm sorry, I'm having trouble connecting to my central system. Please add VITE_GEMINI_API_KEY to your .env.local file.",
            actions: []
        };
    }

    // Structured Context Injection (Rich Memory)
    const contextInjection = `
USER_SESSION: ${JSON.stringify({
        sessionId: session.sessionId || 'website_user',
        customer_name: session.customer_name || null,
        customer_phone: session.customer_phone || null,
        delivery_address: session.delivery_address || null,
        current_cart: session.cart || [],
        cart_total: session.cart_total || 0,
        affiliated_companies: session.affiliated_companies || []
    }, null, 2)}

RAG_CONTEXT: ${JSON.stringify(ragData, null, 2)}
`;

    // Clean history and format for Gemini
    const cleanHistory = (session.history || []).slice(-30).map(h => ({
        role: (h.role === 'bot' || h.role === 'assistant' || h.role === 'model') ? 'model' : 'user',
        parts: [{ text: typeof h.content === 'string' ? h.content.replace(/<(ACTIONS|actions)>.*?<\/(ACTIONS|actions)>/si, '').trim() : (h.text || '') }]
    }));

    // Add current user message
    cleanHistory.push({
        role: 'user',
        parts: [{ text: userMessage }]
    });

    try {
        console.log(`[AI] Attempting response with Gemini API`);
        const response = await axios.post(`${GEMINI_API_URL}${apiKey}`, {
            systemInstruction: {
                parts: [{ text: PROMPT + "\n\n" + contextInjection }]
            },
            contents: cleanHistory,
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1024,
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
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
        console.error(`[AI] Error with Gemini API:`, error.response?.data || error.message);
        return {
            content: "I'm experiencing technical difficulties. Please contact our team at 03008607811",
            actions: []
        };
    }
}

module.exports = { generateAIResponse };
