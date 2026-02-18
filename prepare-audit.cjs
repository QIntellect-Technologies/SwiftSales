const { supabase } = require('./server/services/supabase');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'server/chatbot.db');
const db = new sqlite3.Database(dbPath);

async function synchronize() {
    console.log('🔄 Synchronizing Supabase Products to SQLite Inventory...');

    try {
        const { data, error } = await supabase.from('medicines').select('*');
        if (error) throw error;

        console.log(`✅ Fetched ${data.length} products from Supabase.`);

        db.serialize(() => {
            const stmt = db.prepare(`
                INSERT INTO product_inventory (product_id, product_name, quantity_in_stock, status)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(product_id) DO UPDATE SET
                    product_name = excluded.product_name,
                    quantity_in_stock = 100,
                    status = 'in_stock'
            `);

            for (const p of data) {
                stmt.run(p.id, p.name, 100, 'in_stock');
            }

            stmt.finalize();
            console.log('✅ SQLite Inventory Synchronized!');
            db.close();
        });
    } catch (err) {
        console.error('💥 Sync Error:', err.message);
        db.close();
    }
}

synchronize();
