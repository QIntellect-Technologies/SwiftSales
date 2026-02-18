const fs = require('fs-extra');
const path = require('path');

async function generate() {
  const repoRoot = path.join(__dirname, '..', '..');
  const medsPath = path.join(repoRoot, 'server', 'data', 'medicines.json');
  const outDir = path.join(repoRoot, 'src', 'data');
  const outPath = path.join(outDir, 'productDetails.json');

  try {
    await fs.ensureDir(outDir);
    const meds = await fs.readJson(medsPath);

    const details = {};
    meds.forEach((m) => {
      const key = m.name;
      details[key] = {
        id: m.id || null,
        name: m.name,
        company: m.company || null,
        pack_size: m.pack_size || null,
        // Placeholders for richer data to be filled later
        category: null,
        benefits: [],
        usageInstructions: {},
        precautions: [],
        sideEffects: [],
        requiresPrescription: false,
        shortDescription: `${m.name} by ${m.company || 'Unknown'}`
      };
    });

    await fs.writeJson(outPath, details, { spaces: 2 });
    console.log('✅ productDetails.json generated at', outPath);
  } catch (err) {
    console.error('❌ Failed to generate productDetails.json', err);
    process.exit(1);
  }
}

if (require.main === module) generate();
