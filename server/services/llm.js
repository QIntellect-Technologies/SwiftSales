const ollama = require('ollama').default;

class LLMService {
    constructor() {
        this.model = 'llama3.2'; // Or 'phi3', depending on what user pulled
        this.systemPrompt = `You are SwiftBot, the professional AI Pharmaceutical Assistant for "Swift Sales Healthcare". 
Your goal is to assist customers with medicine information, orders, and health questions based on the provided context.

GUIDELINES:
1. **Primary Role**: You are a helpful assistant. If the user asks for a medicine for a common ailment (headache, fever, flu) and such medicines are in the "Context", YOU MUST RECOMMEND THEM.
2. **Context-Driven**: Base your answers on the "Context" provided. If the context contains medicines like "Panadol" or "Brufen" and the user asks about pain, suggest them.
3. **Medical Safety**: 
   - For **common** issues (headache, fever, acidity), suggest OTC medicines from the context with a standard disclaimer: "Please consult a doctor if symptoms persist."
   - For **serious** emergencies (chest pain, overdose, difficulty breathing), IMMEDIATELY advise calling emergency services.
4. **Tone**: Empathetic, professional, and DIRECT. Do not be overly evasive.
5. **Brevity**: Keep answers concise (under 3 sentences).

CONTEXT:
`;
    }

    async generateResponse(userMessage, contextDocs, chatHistory = []) {
        try {
            // 1. Construct the Prompt with Context
            const contextText = contextDocs.map((doc, index) =>
                `[${index + 1}] Product/Info: ${doc.metadata.name || doc.metadata.question || 'N/A'}\nDetails: ${doc.metadata.answer || JSON.stringify(doc.metadata)}`
            ).join('\n\n');

            const fullPrompt = `${this.systemPrompt}\n${contextText}\n\nUSER QUESTION: ${userMessage}`;

            // 2. Call Ollama (Stream = false for now to keep it simple)
            const response = await ollama.chat({
                model: this.model,
                messages: [
                    { role: 'system', content: this.systemPrompt + "\n\nCONTEXT:\n" + contextText },
                    ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })), // Optional: history
                    { role: 'user', content: userMessage }
                ],
            });

            return response.message.content;

        } catch (error) {
            console.error('❌ LLM Generation Error:', error);
            return "I apologize, but I'm having trouble connecting to my AI brain right now. 🧠\nPlease ensure the 'Ollama' app is running on the PC.";
        }
    }

    /**
     * Parse user intent for ordering using LLM
     * Returns structured JSON: { intent, items: [], details: {} }
     */
    async parseOrderIntent(query) {
        try {
            const prompt = `
YOU ARE AN ORDER PARSING AI. Your job is to extract ordering intents from user text.
Refuse to chat. ONLY output legitimate JSON.

USER TEXT: "${query}"

RULES:
1. Identify the INTENT: "add_to_cart", "remove_from_cart", "checkout", "cancel_order", "modify_quantity", "provide_details", or "unknown".
2. Extract ITEMS: Array of { "product": "exact name or description", "quantity": number }. Default quantity is 1 if not specified.
3. Extract DETAILS: Name, Phone, Address if mentioned.
4. IMPORTANT: If a specific detail (Name, Phone, Address) is NOT in the USER TEXT, you MUST return null. DO NOT guess or invent names.
5. STRICTLY output valid JSON.

OUTPUT FORMAT (JSON ONLY):
{
  "intent": "string",
  "items": [ { "product": "string", "quantity": number } ],
  "details": {
    "name": "string or null",
    "phone": "string or null",
    "address": "string or null"
  }
}

JSON OUTPUT:
Examples:
- "I want 2 Panadol" -> {"intent": "add_to_cart", "items": [{"product": "Panadol", "quantity": 2}], "details": {"name": null, "phone": null, "address": null}}
- "My name is John" -> {"intent": "provide_details", "items": [], "details": {"name": "John", "phone": null, "address": null}}`;

            const response = await ollama.chat({
                model: this.model,
                messages: [{ role: 'user', content: prompt }],
                options: { temperature: 0.1 } // Low temperature for deterministic output
            });

            // Extract JSON from response
            const jsonMatch = response.message.content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return null;

        } catch (error) {
            console.error('❌ Order Intent Parsing Error:', error);
            return null;
        }
    }
}

// Singleton
let llmInstance = null;
function getLLMService() {
    if (!llmInstance) {
        llmInstance = new LLMService();
    }
    return llmInstance;
}

module.exports = { getLLMService };
