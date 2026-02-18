const fs = require('fs-extra');
const path = require('path');
const OpenAI = require('openai');
const axios = require('axios');

const OPENAI_API_KEY = 'sk-proj-PLACEHOLDER_KEY_DO_NOT_COMMIT';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

async function generateBrandedImage(productName, genericName, form) {
    const prompt = `Pharmaceutical medicine packaging box labeled with the large, bold text "${productName}". The sub-title text should say "${genericName}". The packaging should look like a professional ${form} box. Clean studio photography, white background, high resolution, pharmaceutical branding, high quality, realistic.`;

    try {
        console.log(`Generating image for: ${productName}...`);
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        const imageUrl = response.data[0].url;
        const fileName = `${productName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}.png`;
        const filePath = path.join(__dirname, '..', 'public', 'images', 'products', fileName);

        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        await fs.outputFile(filePath, imageResponse.data);

        console.log(`Saved: ${fileName}`);
        return `/images/products/${fileName}`;
    } catch (error) {
        console.error(`Error generating image for ${productName}:`, error.message);
        return null;
    }
}

const ALL_PRODUCTS = [
    // Pinnacle Biotec
    { id: 'pb1', name: 'LIKZONE', generic: 'Ceftriaxone', form: 'Injection' },
    { id: 'pb2', name: 'MONEPRA', generic: 'Esomeprazole', form: 'Capsule' },
    { id: 'pb3', name: 'PALZON', generic: 'Ceftriaxone', form: 'Injection' },
    { id: 'pb4', name: 'PALXIME', generic: 'Cefixime', form: 'Capsule' },
    { id: 'pb5', name: 'DAYSITA-M', generic: 'Sitagliptin / Metformin', form: 'Tablet' },
    { id: 'pb6', name: 'DRUGAB', generic: 'Pregabalin', form: 'Capsule' },
    { id: 'pb7', name: 'PALFLOX', generic: 'Ciprofloxacin', form: 'Tablet' },
    { id: 'pb8', name: 'RUMAXOL', generic: 'Esomeprazole', form: 'Capsule' },
    { id: 'pb9', name: 'EMPAXO', generic: 'Empagliflozin', form: 'Tablet' },
    { id: 'pb10', name: 'VALDOSAR', generic: 'Amlodipine / Valsartan', form: 'Tablet' },
    // Siza International
    { id: 'si1', name: 'ULCENIL', generic: 'Esomeprazole', form: 'Capsule' },
    { id: 'si2', name: 'EZUMAC', generic: 'Esomeprazole', form: 'Capsule' },
    { id: 'si3', name: 'LUMEZA', generic: 'Artemether / Lumefantrine', form: 'Tablet' },
    { id: 'si4', name: 'GLOSIFLOX', generic: 'Moxifloxacin', form: 'Tablet' },
    { id: 'si5', name: 'XIVAL', generic: 'Cefixime', form: 'Capsule' },
    { id: 'si6', name: 'VOTEC', generic: 'Levofloxacin', form: 'Tablet' },
    { id: 'si7', name: 'VEPROX', generic: 'Ciprofloxacin', form: 'Tablet' },
    { id: 'si8', name: 'TORAX', generic: 'Cough Syrup', form: 'Syrup' },
    { id: 'si9', name: 'RHEUMATIN', generic: 'Diclofenac', form: 'Tablet' },
    { id: 'si10', name: 'FERRUX', generic: 'Iron', form: 'Syrup' },
    // Glitz Pharma
    { id: 'gp1', name: 'GLIXIM', generic: 'Cefixime', form: 'Capsule' },
    { id: 'gp2', name: 'ESOGIP', generic: 'Esomeprazole', form: 'Capsule' },
    { id: 'gp3', name: 'QUTIA', generic: 'Quetiapine', form: 'Tablet' },
    { id: 'gp4', name: 'GABOZ', generic: 'Gabapentin', form: 'Capsule' },
    { id: 'gp5', name: 'P GAB', generic: 'Pregabalin', form: 'Capsule' },
    { id: 'gp6', name: 'PRACIT', generic: 'Venlafaxine', form: 'Tablet' },
    { id: 'gp7', name: 'RAZE', generic: 'Risperidone', form: 'Tablet' },
    { id: 'gp8', name: 'LAMEPIL', generic: 'Lamotrigine', form: 'Tablet' },
    { id: 'gp9', name: 'DEPFREE', generic: 'Duloxetine', form: 'Capsule' },
    { id: 'gp10', name: 'OZIP', generic: 'Olanzapine', form: 'Tablet' },
    // Acumen
    { id: 'ap1', name: 'BACTOWIN', generic: 'Ceftriaxone', form: 'Injection' },
    { id: 'ap2', name: 'NAVIX', generic: 'Esomeprazole', form: 'Capsule' },
    { id: 'ap3', name: 'REMEP', generic: 'Esomeprazole', form: 'Capsule' },
    { id: 'ap4', name: 'BETAPIME', generic: 'Cefepime', form: 'Injection' },
    { id: 'ap5', name: 'J-ZIT', generic: 'Azithromycin', form: 'Tablet' },
    { id: 'ap6', name: 'SELMOXI', generic: 'Moxifloxacin', form: 'Tablet' },
    { id: 'ap7', name: 'LUMEZA', generic: 'Artemether / Lumefantrine', form: 'Tablet' },
    { id: 'ap8', name: 'NEWVIT IQ', generic: 'Multivitamin', form: 'Syrup' },
    { id: 'ap9', name: 'AULTADEX', generic: 'Duloxetine', form: 'Capsule' },
    { id: 'ap10', name: 'AYTIMAX', generic: 'Atorvastatin', form: 'Tablet' },
    // Serving Health
    { id: 'sh1', name: 'PROCORT', generic: 'Corticosteroid', form: 'Cream' },
    { id: 'sh2', name: 'FUSICARE', generic: 'Fusidic Acid', form: 'Cream' },
    { id: 'sh3', name: 'GK', generic: 'Skincare', form: 'Cream' },
    { id: 'sh4', name: 'IVERSAV', generic: 'Ivermectin', form: 'Tablet' },
    { id: 'sh5', name: 'TERBINASAV', generic: 'Terbinafine', form: 'Tablet' },
    { id: 'sh6', name: 'ACNEEZ', generic: 'Anti-Acne', form: 'Gel' },
    { id: 'sh7', name: 'NOURISHME', generic: 'Skin Serum', form: 'Liquid' },
    { id: 'sh8', name: 'ITRALOX', generic: 'Itraconazole', form: 'Capsule' },
    { id: 'sh9', name: 'MELANEEZ', generic: 'Whitening Cream', form: 'Cream' },
    { id: 'sh10', name: 'FLOTIZOL', generic: 'Antifungal', form: 'Cream' },
    // Swiss
    { id: 'sp1', name: 'STRACEF', generic: 'Ceftriaxone', form: 'Injection' },
    { id: 'sp2', name: 'SANAMIDOL', generic: 'Esomeprazole', form: 'Capsule' },
    { id: 'sp3', name: 'SWISSMETHER', generic: 'Artemether / Lumefantrine', form: 'Tablet' },
    { id: 'sp4', name: 'SWICEF', generic: 'Cefixime', form: 'Capsule' },
    { id: 'sp5', name: 'LEPITAM', generic: 'Levetiracetam', form: 'Tablet' },
    { id: 'sp6', name: 'KAIRDON', generic: 'Risperidone', form: 'Tablet' },
    { id: 'sp7', name: 'PAX CR', generic: 'Paroxetine', form: 'Tablet' },
    { id: 'sp8', name: 'SCRODOP', generic: 'Duloxetine', form: 'Capsule' },
    { id: 'sp9', name: 'VITAGLOBIN', generic: 'Multivitamin', form: 'Syrup' },
    { id: 'sp10', name: 'D-ABS', generic: 'Diclofenac', form: 'Tablet' },
    // Curatech
    { id: 'cp1', name: 'CURAXONE', generic: 'Ceftriaxone', form: 'Injection' },
    { id: 'cp2', name: 'EMT', generic: 'Esomeprazole', form: 'Capsule' },
    { id: 'cp3', name: 'CURAZOLE', generic: 'Esomeprazole', form: 'Capsule' },
    { id: 'cp4', name: 'CURASPAN', generic: 'Cefixime', form: 'Capsule' },
    { id: 'cp5', name: 'TECHMOX', generic: 'Moxifloxacin', form: 'Tablet' },
    { id: 'cp6', name: 'CURAFLOXIN', generic: 'Ciprofloxacin', form: 'Tablet' },
    { id: 'cp7', name: 'MELATHER', generic: 'Artemether / Lumefantrine', form: 'Tablet' },
    { id: 'cp8', name: 'ZICURE', generic: 'Azithromycin', form: 'Tablet' },
    { id: 'cp9', name: 'FERIFER-F', generic: 'Iron + Folic Acid', form: 'Tablet' },
    { id: 'cp10', name: 'FEXOZIN', generic: 'Fexofenadine', form: 'Tablet' },
    // Araf
    { id: 'ar1', name: 'ZALTER', generic: 'Olanzapine', form: 'Tablet' },
    { id: 'ar2', name: 'ZAXINE XR', generic: 'Venlafaxine', form: 'Capsule' },
    { id: 'ar3', name: 'ZITRIGINE', generic: 'Lamotrigine', form: 'Tablet' },
    { id: 'ar4', name: 'MIZIO', generic: 'Ceftriaxone', form: 'Injection' },
    { id: 'ar5', name: 'EZONE', generic: 'Ceftriaxone', form: 'Injection' },
    { id: 'ar6', name: 'FALRAF', generic: 'Pregabalin', form: 'Capsule' },
    { id: 'ar7', name: 'NETLO', generic: 'Escitalopram', form: 'Tablet' },
    { id: 'ar8', name: 'TAZAP', generic: 'Mirtazapine', form: 'Tablet' },
    { id: 'ar9', name: 'ZEEBON', generic: 'Supplements', form: 'Tablet' },
    { id: 'ar10', name: 'ZANZIA', generic: 'Olanzapine', form: 'Tablet' },
    // Qurrum
    { id: 'qp1', name: 'XEEBON', generic: 'Multivitamin', form: 'Tablet' },
    { id: 'qp2', name: 'EXTENZE', generic: 'Multivitamin', form: 'Syrup' },
    { id: 'qp3', name: 'HURMA', generic: 'Supplement', form: 'Tablet' },
    { id: 'qp4', name: 'MAXISURE', generic: 'Nutrition', form: 'Powder' },
    { id: 'qp5', name: 'MEGA-3', generic: 'Omega 3', form: 'Capsule' },
    { id: 'qp6', name: 'OVASITOL', generic: 'Inositol', form: 'Sachet' },
    { id: 'qp7', name: 'EVEX', generic: 'Vitamin E', form: 'Capsule' },
    { id: 'qp8', name: 'ACT-C', generic: 'Vitamin C', form: 'Tablet' },
    { id: 'qp9', name: 'ARTHROMAX', generic: 'Joint Care', form: 'Tablet' },
    { id: 'qp10', name: 'BIOCART', generic: 'Cartilage Support', form: 'Tablet' }
];

async function run() {
    const results = {};
    for (const p of ALL_PRODUCTS) {
        const path = await generateBrandedImage(p.name, p.generic, p.form);
        if (path) {
            results[p.id] = path;
        }
        await new Promise(r => setTimeout(r, 1000));
    }
    await fs.writeJson(path.join(__dirname, 'generation_results.json'), results, { spaces: 2 });
    console.log('--- ALL GENERATIONS COMPLETE ---');
}

run();
