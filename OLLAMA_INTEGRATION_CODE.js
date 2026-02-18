// ===================================================================
// ADD THIS TO YOUR RAG.JS SERVICE FOR CONVERSATIONAL AI
// ===================================================================

// 1. UPDATE IMPORTS (Top of file)
const path = require('path');
const { default: ollama } = require('ollama');  // Changed from HfInference

//2. UPDATE CONSTRUCTOR
class RAGService {
    constructor() {
        // Ollama - Local LLM for conversational responses
        this.ollamaModel = 'llama3.2';
        
        // ... rest of your constructor ...
    }

    // 3. ADD THIS NEW METHOD - Ollama Conversational Response Generator
    async generateOllamaResponse(query, relevantProducts, userContext = {}) {
        try {
            // Prepare context from relevant products
            let contextText = '';
            
            // Add company information
            contextText += `COMPANY INFORMATION:\n`;
            contextText += `Name: ${this.companyInfo.name}\n`;
            contextText += `Owner/CEO: ${this.companyInfo.ceo}\n`;
            contextText += `Phone/WhatsApp: ${this.companyInfo.phone}\n`;
            contextText += `Email: ${this.companyInfo.email}\n`;
            contextText += `Location: ${this.companyInfo.location}\n`;
            contextText += `Total Products: ${this.companyInfo.totalProducts}+\n`;
            contextText += `Manufacturers: ${this.companyInfo.manufacturers}+\n\n`;

            // Add relevant products if found
            if (relevantProducts && relevantProducts.length > 0) {
                contextText += `RELEVANT PRODUCTS FOUND:\n`;
                relevantProducts.slice(0, 5).forEach((product, idx) => {
                    const meta = product.metadata;
                    contextText += `${idx + 1}. ${meta.name}\n`;
                    contextText += `   Company: ${meta.company}\n`;
                    if (meta.pack_size) contextText += `   Pack Size: ${meta.pack_size}\n`;
                    if (meta.category) contextText += `   Category: ${meta.category}\n`;
                    
                    // Add detailed info if available
                    if (global.productDetails && global.productDetails[meta.name]) {
                        const details = global.productDetails[meta.name];
                        if (details.benefits && details.benefits.length > 0) {
                            contextText += `   Uses: ${details.benefits.slice(0, 2).join(', ')}\n`;
                        }
                        if (details.requiresPrescription) {
                            contextText += `   Prescription Required: Yes\n`;
                        }
                    }
                    contextText += `\n`;
                });
            }

            // Add chat history for context continuity
            if (userContext.chatHistory && userContext.chatHistory.length > 0) {
                contextText += `\nRECENT CONVERSATION:\n`;
                userContext.chatHistory.slice(-3).forEach(msg => {
                    contextText += `${msg.sender}: ${msg.message_text}\n`;
                });
            }

            // Create professional pharmaceutical assistant prompt
            const systemPrompt = `You are SwiftBot, a professional AI pharmaceutical assistant for Swift Sales Healthcare.

COMMUNICATION STYLE:
- FIRST: Acknowledge what the customer said (show you heard them)
- SECOND: Understand their actual intent (what do they really need?)
- THIRD: Respond naturally and professionally
- Warm, friendly, yet professional tone
- Use emojis sparingly and appropriately 😊 📦 ⚠️
- Keep responses concise (2-4 sentences usually)
- Sound human, not robotic

CORE RESPONSIBILITIES:
1. Product Information - Help customers find medicines
2. Health Guidance - Recommend OTC products for common issues (with disclaimers)
3. Order Assistance - Guide them through placing orders
4. Company Information - Answer questions about Swift Sales

HANDLING DIFFERENT QUERIES:
- Greetings: Be warm, ask how you can help
- Product questions: Describe clearly with company, pack size, uses
- Health concerns: Recommend from available products BUT add "consult doctor if symptoms persist"
- Ordering: Guide step-by-step naturally
- General questions: Answer using company info provided

CRITICAL SAFETY RULES:
✓ For prescription drugs: "This medicine requires a prescription"
✓ For health advice: Always add disclaimer "Please consult a doctor if symptoms persist"
✓ For emergencies: Direct to hospital/emergency services immediately
✓ Never invent product information - only use what's in the context
✓ If unsure: Offer to connect them with pharmacist at ${this.companyInfo.phone}

ORDERING FLOW:
1. Customer expresses interest → Ask which product and quantity
2. Collect: Name, Phone, Delivery Address
3. Confirm order details
4. Submit

CONTEXT PROVIDED:
${contextText}

NOW RESPOND TO THE CUSTOMER IN A NATURAL, CONVERSATIONAL, PROFESSIONAL WAY.
Remember: Acknowledge → Understand → Respond`;

            // Call Ollama with conversational settings
            const response = await ollama.chat({
                model: this.ollamaModel,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: query }
                ],
                options: {
                    temperature: 0.7, // Natural conversation
                    top_p: 0.9,
                    top_k: 40,
                    num_predict: 350, // Limit response length
                    repeat_penalty: 1.1
                }
            });

            const aiResponse = response.message.content;
            console.log('[OLLAMA] ✅ Generated conversational response');
            return aiResponse;

        } catch (error) {
            console.error('[OLLAMA ERROR]:', error.message);
            
            // Intelligent fallback based on error type
            if (error.message && error.message.includes('connect')) {
                return `I'm having trouble connecting to my AI brain right now. 🧠\n\n` +
                       `**Please ensure Ollama is running:**\n` +
                       `\`ollama serve\` in a terminal\n\n` +
                       `**Or contact us directly:**\n` +
                       `📞 ${this.companyInfo.phone}\n` +
                       `📧 ${this.companyInfo.email}`;
            }
            
            // Fallback to template-based response
            console.log('[FALLBACK] Using template response');
            return await this.formatPureRAGResponse(query, relevantProducts, userContext);
        }
    }

    // 4. UPDATE YOUR generateResponse METHOD TO USE OLLAMA
    // Replace the end of generate Response (after critical safety/order checks) with:
    //
    // console.log('[CONVERSATIONAL AI] Using Ollama for intelligent response...');
    // return await this.generateOllamaResponse(query, relevantProducts, userContext);
}

// ===================================================================
// HOW TO USE:
// 1. Make sure Ollama is running: ollama serve
// 2. Test with: node test-conversational-ai.js
// 3. Start server: npm start
// ===================================================================
