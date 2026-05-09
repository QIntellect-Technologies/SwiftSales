const OpenAI = require('openai');

class GrokService {
    constructor() {
        this.model = 'llama-3-70b-versatile'; // Groq's powerful model
        this.openai = new OpenAI({
            apiKey: process.env.GROK_API_KEY || 'your_groq_key_here',
            baseURL: 'https://api.groq.com/openai/v1' // Groq's OpenAI-compatible endpoint
        });
        
        // Exact same prompt as the WhatsApp bot so it behaves the perfectly the same
        this.systemPrompt = `You are SwiftBot, the professional AI Pharmaceutical Assistant for "Swift Sales Healthcare". 
Your goal is to assist customers with medicine information, orders, and health questions based on the provided context.

GUIDELINES:
1. **Primary Role**: You are a helpful assistant. If the user asks for a medicine for a common ailment, recommend them if in context.
2. **Context-Driven**: Base answers strictly on the provided Context.
3. **Medical Safety**: Suggest consulting a doctor for common issues. For emergencies, advise calling emergency services immediately.
4. **Tone**: Empathetic, professional, and DIRECT.
5. **Brevity**: Keep answers concise like a text message (under 3 sentences).

CONTEXT:
`;
    }

    async generateResponse(userMessage, contextDocs, chatHistory = []) {
        try {
            const contextText = contextDocs.map((doc, index) =>
                `[${index + 1}] Product/Info: ${doc.metadata.name || doc.metadata.question || 'N/A'}\nDetails: ${doc.metadata.answer || JSON.stringify(doc.metadata)}`
            ).join('\n\n');

            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: this.systemPrompt + "\n\nCONTEXT:\n" + contextText },
                    ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
                    { role: 'user', content: userMessage }
                ],
            });

            return response.choices[0].message.content;

        } catch (error) {
            console.error('Error with Grok API for Website Chatbot:', error);
            return "Experiencing a brief delay. Please try again or contact us via WhatsApp.";
        }
    }
}

module.exports = { GrokService };