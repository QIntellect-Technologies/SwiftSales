/**
 * Initialize Product Inventory
 * 
 * This script loads all products from medicines_data.json and initializes
 * the product_inventory table with stock information.
 * 
 * Usage: node scripts/initializeInventory.js
 */

const fs = require('fs');
const path = require('path');
const { db, dbHelpers } = require('../database');

async function initializeInventory() {
    console.log('🚀 Starting inventory initialization...\n');

    try {
        // Load medicines data
        const medicinesPath = path.join(__dirname, '../../medicines_data.json');
        console.log(`📂 Reading medicines data from: ${medicinesPath}`);
        
        const medicinesRaw = fs.readFileSync(medicinesPath, 'utf-8');
        const medicines = JSON.parse(medicinesRaw);
        
        console.log(`✅ Found ${medicines.length} products in catalog\n`);

        // Initialize counters
        let successful = 0;
        let failed = 0;
        let skipped = 0;

        // Process each product
        console.log('📦 Initializing inventory records...\n');
        
        for (let i = 0; i < medicines.length; i++) {
            const product = medicines[i];
            
            // Validate product data
            if (!product.item_id || !product.description) {
                console.log(`⚠️  Skipping invalid product at index ${i}`);
                skipped++;
                continue;
            }

            try {
                // Initialize with random stock between 50-200 for realism
                const randomStock = Math.floor(Math.random() * 151) + 50; // 50-200
                
                await dbHelpers.initializeProductStock({
                    productId: product.item_id,
                    productName: product.description,
                    productCompany: product.company || 'Unknown',
                    packSize: product.pack_size || 'Standard',
                    initialStock: randomStock
                });

                successful++;
                
                // Progress indicator every 100 products
                if ((i + 1) % 100 === 0) {
                    console.log(`   ✓ Processed ${i + 1}/${medicines.length} products...`);
                }
            } catch (error) {
                console.error(`❌ Error initializing product ${product.item_id}:`, error.message);
                failed++;
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 INVENTORY INITIALIZATION SUMMARY');
        console.log('='.repeat(60));
        console.log(`✅ Successfully initialized: ${successful} products`);
        console.log(`⚠️  Skipped (invalid):       ${skipped} products`);
        console.log(`❌ Failed:                  ${failed} products`);
        console.log(`📦 Total in catalog:        ${medicines.length} products`);
        console.log('='.repeat(60));

        // Get inventory statistics
        console.log('\n📈 Checking inventory statistics...\n');
        
        const stats = await new Promise((resolve, reject) => {
            db.all(
                `SELECT 
                    status,
                    COUNT(*) as count,
                    SUM(quantity_in_stock) as total_units
                 FROM product_inventory 
                 GROUP BY status`,
                [],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        console.log('Stock Status Breakdown:');
        stats.forEach(stat => {
            console.log(`   ${stat.status.toUpperCase()}: ${stat.count} products (${stat.total_units} units)`);
        });

        console.log('\n✅ Inventory initialization complete!\n');
        
    } catch (error) {
        console.error('\n❌ Fatal error during initialization:', error);
        process.exit(1);
    } finally {
        // Close database connection
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('Database connection closed.');
            }
            process.exit(0);
        });
    }
}

// Run the initialization
initializeInventory();
