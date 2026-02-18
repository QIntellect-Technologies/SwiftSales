const path = require('path');
const fs = require('fs-extra');
const { dbHelpers } = require('../database');

async function init() {
  try {
    const medsPath = path.join(__dirname, '..', 'data', 'medicines.json');
    const meds = await fs.readJson(medsPath);

    console.log('Initializing inventory for', meds.length, 'products...');

    for (const m of meds) {
      const productId = m.id || m.name;
      const productName = m.name;
      const productCompany = m.company || 'Unknown';
      const packSize = m.pack_size || 'Standard';

      try {
        await dbHelpers.initializeProductStock({
          productId,
          productName,
          productCompany,
          packSize,
          initialStock: 100
        });
      } catch (err) {
        console.warn('Failed to init stock for', productId, err.message || err);
      }
    }

    console.log('Inventory initialization complete.');
  } catch (err) {
    console.error('Error initializing inventory:', err);
    process.exit(1);
  }
}

if (require.main === module) init();
