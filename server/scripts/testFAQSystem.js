/**
 * Test FAQ System
 * 
 * Quick test to verify FAQ semantic search is working
 */

const { getRAGService } = require('../services/rag');
const { getEmbeddingService } = require('../services/embeddings');

async function testFAQSystem() {
    console.log('🧪 Testing FAQ System...\n');
    
    try {
        // Initialize services
        const ragService = getRAGService();
        const embeddingService = getEmbeddingService();
        await embeddingService.initialize();
        
        // Load FAQ vectors
        await ragService.loadFAQVectors();
        
        console.log(`✅ FAQ System Loaded`);
        console.log(`   - FAQ Vectors: ${ragService.faqVectors ? ragService.faqVectors.length : 0}`);
        console.log(`   - FAQ Metadata: ${ragService.faqMetadata ? ragService.faqMetadata.length : 0}\n`);
        
        // Test queries
        const testQueries = [
            "What medicine for headache?",
            "I have fever",
            "How do I place an order?",
            "What are the steps for ordering?",
            "Tell me about PANADOL",
            "Is AUGMENTIN available?",
            "Who is the CEO?",
            "What are your contact details?",
            "Thank you",
            "Hi",
            "I need help"
        ];
        
        console.log('🔍 Running Test Queries:\n');
        console.log('='.repeat(80));
        
        for (const query of testQueries) {
            try {
                // Generate embedding
                const embedding = await embeddingService.embed(query);
                
                // Find best match
                const match = await ragService.findBestFAQVectorMatch(embedding);
                
                if (match) {
                    console.log(`\n📝 Query: "${query}"`);
                    console.log(`   ✅ Match: "${match.question}" (Score: ${match.score.toFixed(3)})`);
                    console.log(`   📂 Category: ${match.category}`);
                    console.log(`   💬 Answer: ${match.answer.substring(0, 100)}...`);
                } else {
                    console.log(`\n📝 Query: "${query}"`);
                    console.log(`   ❌ No match found (below threshold)`);
                }
                
                console.log('-'.repeat(80));
                
            } catch (err) {
                console.error(`   ❌ Error processing query: ${err.message}`);
            }
        }
        
        console.log('\n✅ FAQ System Test Complete!\n');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run test
testFAQSystem();
