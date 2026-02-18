const { getRAGService } = require('./services/rag');

/**
 * Test Excel generation for companies with >10 products
 */

async function testExcelGeneration() {
    console.log('🧪 Testing Excel Generation for Large Product Lists...\n');
    console.log('='.repeat(80));

    const rag = getRAGService();

    // Test queries that should trigger Excel generation
    const testQueries = [
        "Show me medicines of Pfizer",
        "I want products from GlaxoSmithKline",
        "List all medicines from Bayer",
        "Do you have products of AstraZeneca?"
    ];

    for (const query of testQueries) {
        console.log(`\n📝 Testing: "${query}"`);
        console.log('-'.repeat(80));

        try {
            const response = await rag.handleGeneralQuery(query);

            // Check if Excel was generated
            if (response.includes('Download') || response.includes('.xlsx')) {
                console.log('✅ Excel file generated!');
                console.log(`   Response length: ${response.length} characters`);

                // Extract download link if present
                const linkMatch = response.match(/\[Download[^\]]+\]\(([^)]+)\)/);
                if (linkMatch) {
                    console.log(`   Download link: ${linkMatch[1]}`);
                }

                // Check for preview
                if (response.includes('Preview')) {
                    console.log('   ✓ Includes product preview');
                }
            } else if (response.includes('products from')) {
                console.log('✅ Inline product list (≤10 products)');
                // Count products in response
                const productCount = (response.match(/\d+\.\s\*\*/g) || []).length;
                console.log(`   Products listed: ${productCount}`);
            } else {
                console.log('⚠️  Unexpected response format');
                console.log(`   Response: ${response.substring(0, 200)}...`);
            }

        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }

        // Small delay
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n\n' + '='.repeat(80));
    console.log('🎉 Excel generation testing complete!');
    console.log('='.repeat(80));
}

testExcelGeneration().catch(console.error);
