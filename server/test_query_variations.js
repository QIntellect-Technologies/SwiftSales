const { getRAGService } = require('./services/rag');

/**
 * Test all query variations for product information
 */

async function testQueryVariations() {
    console.log('🧪 Testing Product Query Variations...\n');
    console.log('='.repeat(80));

    const rag = getRAGService();

    // Test queries organized by category
    const testQueries = [
        {
            category: '📋 General Product Listing',
            queries: [
                "What medicines do you have?",
                "Show me the products",
                "What do you have available?",
                "Can you show your medicine list?",
                "What products are available?",
                "medicine list",
                "product catalog",
                "show me all medicines"
            ]
        },
        {
            category: '🏭 Company-Specific Requests',
            queries: [
                "Show me medicines of Abbott Laboratories",
                "I want products from Pfizer",
                "Do you have products of GlaxoSmithKline?",
                "List all medicines from Bayer",
                "AstraZeneca products"
            ]
        },
        {
            category: '💰 Individual Product Information',
            queries: [
                "What is the price of Amoxil?",
                "Is Lipitor available?",
                "How many packets of Glucophage are available?",
                "Which company manufactures Amoxil?",
                "Tell me about Lipitor"
            ]
        },
        {
            category: '📦 Stock Availability',
            queries: [
                "Do you have Amoxil in stock?",
                "Is Lipitor available?",
                "Glucophage stock status",
                "How much stock of Amoxil?"
            ]
        }
    ];

    for (const testGroup of testQueries) {
        console.log(`\n\n${testGroup.category}`);
        console.log('='.repeat(80));

        for (const query of testGroup.queries) {
            console.log(`\n📝 Query: "${query}"`);
            console.log('-'.repeat(80));

            try {
                const response = await rag.handleGeneralQuery(query);

                // Show first 200 characters of response
                const preview = response.length > 200
                    ? response.substring(0, 200) + '...'
                    : response;

                console.log(`✅ Response: ${preview}`);

                // Check for key indicators
                if (response.includes('companies') || response.includes('Manufacturers')) {
                    console.log('   ✓ Lists companies dynamically');
                }
                if (response.includes('Price') || response.includes('SAR') || response.includes('PKR')) {
                    console.log('   ✓ Shows price information');
                }
                if (response.includes('Stock') || response.includes('Available')) {
                    console.log('   ✓ Shows stock status');
                }
                if (response.includes('Download') || response.includes('.xlsx')) {
                    console.log('   ✓ Generates Excel file for large lists');
                }

            } catch (error) {
                console.log(`❌ Error: ${error.message}`);
            }

            // Small delay to avoid overwhelming logs
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    console.log('\n\n' + '='.repeat(80));
    console.log('🎉 Query variation testing complete!');
    console.log('='.repeat(80));
}

testQueryVariations().catch(console.error);
