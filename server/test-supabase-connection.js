
const { supabase } = require('./services/supabase');

async function testTable(tableName) {
    console.log(`🔍 Testing table: '${tableName}'...`);
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);

        if (error) {
            console.log(`❌ Error on '${tableName}': ${error.message} (Code: ${error.code})`);
            return false;
        } else {
            console.log(`✅ Success on '${tableName}'! Found ${data.length} records.`);
            if (data.length > 0) {
                console.log('Sample Record:', JSON.stringify(data[0], null, 2));
            }
            return true;
        }
    } catch (err) {
        console.log(`❌ Exception on '${tableName}':`, err.message);
        return false;
    }
}

async function runTests() {
    console.log('🚀 Starting schema discovery...');

    const tables = ['menu_items', 'products', 'medicines', 'items', 'inventory'];

    for (const table of tables) {
        const success = await testTable(table);
        if (success) {
            console.log(`🎯 Found correct table: ${table}`);
            return;
        }
    }

    console.log('⚠️ Could not find any expected tables.');
}

runTests();
