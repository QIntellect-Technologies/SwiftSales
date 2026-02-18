const { productService } = require('./services/productService');

async function checkCompanyNames() {
    console.log('🔍 Checking actual company names in database...\n');

    await productService.getAllProducts();
    const { companies } = productService.getAllCategories();

    console.log(`Found ${companies.length} companies:\n`);
    companies.forEach((c, i) => {
        console.log(`${i + 1}. "${c}"`);
    });

    console.log('\n\nTesting fuzzy matching:');
    const testNames = ['Pfizer', 'pfizer', 'GlaxoSmithKline', 'GSK', 'Bayer', 'AstraZeneca'];

    testNames.forEach(test => {
        const match = companies.find(c =>
            c.toLowerCase().includes(test.toLowerCase()) || test.toLowerCase().includes(c.toLowerCase())
        );
        console.log(`"${test}" → ${match ? `✅ "${match}"` : '❌ No match'}`);
    });
}

checkCompanyNames().catch(console.error);
