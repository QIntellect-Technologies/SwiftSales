const fs = require('fs-extra');
const path = require('path');

const RAW_JSON_FILE = path.join(__dirname, '../../medicines_data.json');
const TARGET_FILE = path.join(__dirname, '../data/medicines.json');

async function importMedicines() {
    try {
        console.log('📦 Reading medicines_data.json...');

        if (!await fs.pathExists(RAW_JSON_FILE)) {
            console.error(`❌ File not found: ${RAW_JSON_FILE}`);
            return;
        }

        const rawData = await fs.readJson(RAW_JSON_FILE);

        console.log(`📊 Found ${rawData.length} products in raw file.`);

        const medicines = rawData.map(item => ({
            id: item.item_id,
            name: item.description,
            pack_size: item.pack_size,
            company: item.company
        }));

        await fs.writeJson(TARGET_FILE, medicines, { spaces: 2 });
        console.log(`✅ Imported ${medicines.length} medicines to: ${TARGET_FILE}`);

    } catch (error) {
        console.error('❌ Error importing medicines:', error);
    }
}

importMedicines();
