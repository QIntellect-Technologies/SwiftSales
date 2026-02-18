// Test script to verify Ollama conversational AI integration
const { getRAGService } = require('./services/rag');

async function testConversationalAI() {
    console.log('🧪 Testing Conversational AI Integration...\n');

    const ragService = getRAGService();

    // Test cases
    const tests = [
        {
            name: 'Simple Greeting',
            query: 'hello',
            context: {}
        },
        {
            name: 'Product Inquiry',
            query: 'i want to order PANADOL',
            context: {},
            relevantProducts: [
                {
                    metadata: {
                        name: 'PANADOL 500MG TAB',
                        company: 'GSK',
                        pack_size: "10's",
                        id: 'prod_001',
                        category: 'Pain Relief'
                    },
                    similarity: 0.9
                }
            ]
        },
        {
            name: 'Company Question',
            query: 'what are your business hours?',
            context: {}
        },
        {
            name: 'Health Question',
            query: 'i have headache',
            context: {}
        }
    ];

    for (const test of tests) {
        console.log(`\n📝 Test: ${test.name}`);
        console.log(`Query: "${test.query}"`);
        console.log('---');
        
        try {
            const response = await ragService.generateResponse(
                test.query,
                test.relevantProducts || [],
                test.context
            );
            
            console.log('✅ Response:');
            console.log(response);
            console.log('\n' + '='.repeat(80));
        } catch (error) {
            console.error('❌ Error:', error.message);
            if (error.message.includes('connect')) {
                console.log('\n⚠️  Make sure Ollama is running: ollama serve');
                break;
            }
        }
    }

    console.log('\n✨ Test complete!');
}

// Run tests
testConversationalAI().catch(console.error);
