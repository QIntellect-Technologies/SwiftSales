// ============================================================================
// CHATBOT.TSX - FINAL INTEGRATION PATCH
// ============================================================================
// Add these case handlers inside your existing switch statement

switch (intent) {
    case 'product_catalog':
        addBotMessage(
            `📦 **Our Product Catalog:**\n\n` +
            `We have **296 pharmaceutical products** across **5 manufacturers**:\n\n` +
            `• 🧴 Derma Shine Pharm (15 products)\n` +
            `• 💊 Swiss Pharmaceuticals (71 products)\n` +
            `• 🌿 Green Crust/Nutric (73 products)\n` +
            `• 💉 Amgen Pharma (67 products)\n` +
            `• 🏥 Triafa Pharmaceutical (70 products)\n\n` +
            `**Categories:**\n` +
            `✓ Pain Relief & Anti-inflammatory\n` +
            `✓ Antibiotics & Antimicrobials\n` +
            `✓ Vitamins & Supplements\n` +
            `✓ Skin Care & Dermatology\n` +
            `✓ Gastric & Digestive Health\n` +
            `✓ And much more!\n\n` +
            `What specific product or category are you looking for? 😊`
        );
        break;

    case 'conversational':
        addBotMessage(
            `I'm doing great, thank you for asking! 😊\n\n` +
            `I'm here and ready to help you with:\n` +
            `• Finding medicines\n` +
            `• Health recommendations\n` +
            `• Product information\n` +
            `• Ordering assistance\n\n` +
            `How can I assist you today?`
        );
        break;

    case 'general_ordering':
        addBotMessage(
            `Great! I'd be happy to help you place an order! 🛒\n\n` +
            `**Ordering Options:**\n\n` +
            `📞 **Phone Order:**\n` +
            `Call ${COMPANY_INFO.phone}\n` +
            `We'll take your order and have it ready!\n\n` +
            `🏪 **In-Store:**\n` +
            `Visit us at: ${COMPANY_INFO.location}\n` +
            `Hours: ${COMPANY_INFO.hours}\n\n` +
            `🚚 **Home Delivery:**\n` +
            `• Minimum order: Rs. 500\n` +
            `• Delivery fee: Rs. 100-200 (based on location)\n` +
            `• Call to arrange delivery\n\n` +
            `Which product would you like to order? Tell me the name and I'll check availability! 😊`
        );
        break;

    case 'unclear':
    default:
        // Try RAG for complex queries
        fetch('http://localhost:5000/api/rag/general', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: text })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.response) {
                    addBotMessage(data.response);
                } else {
                    addBotMessage(
                        `I want to make sure I understand you correctly. Could you please rephrase that?\n\n` +
                        `I can help you with:\n` +
                        `✅ Finding specific medicines\n` +
                        `✅ Health condition recommendations\n` +
                        `✅ Detailed usage instructions\n` +
                        `✅ Company information\n` +
                        `✅ Ordering process\n\n` +
                        `What can I help you with? 😊`
                    );
                }
            })
            .catch(error => {
                console.error('RAG error:', error);
                addBotMessage(
                    `I'm here to help! We have 296 pharmaceutical products available. What would you like to know? 😊`
                );
            });
        break;
}