
const { getRAGService } = require('./services/rag');
const { getEmbeddingService } = require('./services/embeddings');

async function verifyFix() {
    console.log('🧪 Verifying Registration Query Handling & Professionalism...\n');

    const rag = getRAGService();
    const queries = [
        "is this resgisterd comapny?",
        "is swift sales registred?",
        "do you have a drug license?",
        "who are you",
        "tell me about swift sales",
        "how are you",
        "thank you so much"
    ];

    for (const query of queries) {
        console.log(`\nQuery: "${query}"`);
        const response = await rag.handleGeneralQuery(query);
        console.log(`Response:\n---\n${response}\n---`);

        // Simple checks
        if (response.toLowerCase().includes('identity:') ||
            response.toLowerCase().includes('overview:') ||
            response.toLowerCase().includes('licensing:')) {
            console.log('❌ FAIL: Response still contains technical labels!');
        } else {
            console.log('✅ PASS: No technical labels found.');
        }
    }
}

verifyFix().catch(console.error);
