/**
 * Build Comprehensive FAQ Embeddings
 * 
 * This script processes ALL FAQ files and creates vector embeddings
 * for semantic search and NLP-based question answering.
 * 
 * Usage: node server/scripts/buildComprehensiveFAQs.js
 */

const fs = require('fs');
const path = require('path');

// Import embedding pipeline
const { pipeline } = require('@xenova/transformers');

console.log('🚀 Starting Comprehensive FAQ Embedding Generation...\n');

// FAQ file paths
const FAQ_DIR = path.join(__dirname, '../data/faqs');
const FAQ_FILES = [
    'faq_medical_conditions.json',
    'faq_product_information.json',
    'faq_ordering_delivery.json',
    'faq_conversational.json',
    'faq_company_info.json',
    'faq_catalog_browsing.json',
    'faq_medical_generated.json',
    'faq_products_generated.json',
    'faq_ordering_generated.json',
    'faq_conversational_generated.json',
    'faq_company_generated.json'
];

// Output paths
const OUTPUT_DIR = path.join(__dirname, '../data/embeddings');
const EMBEDDINGS_FILE = path.join(OUTPUT_DIR, 'faq_embeddings_comprehensive.json'); // Main Index File
const METADATA_FILE = path.join(OUTPUT_DIR, 'faq_metadata_comprehensive.json');

async function buildFAQEmbeddings() {
    try {
        // Ensure output directory exists
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        console.log('📂 Loading FAQ files...\n');

        // Load all FAQ files
        let allFAQs = [];
        let stats = {};

        for (const file of FAQ_FILES) {
            const filePath = path.join(FAQ_DIR, file);

            if (!fs.existsSync(filePath)) {
                console.log(`⚠️  Skipping ${file} (not found)`);
                continue;
            }

            const faqs = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const category = file.replace('faq_', '').replace('.json', '');

            allFAQs = allFAQs.concat(faqs);
            stats[category] = faqs.length;

            console.log(`✅ Loaded ${faqs.length} FAQs from ${file}`);
        }

        console.log(`\n📊 Total FAQs loaded: ${allFAQs.length}\n`);
        console.log('Category Breakdown:');
        Object.entries(stats).forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count} FAQs`);
        });

        console.log('\n🔄 Initializing embedding model (Xenova/all-MiniLM-L6-v2)...');
        const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log('✅ Model loaded!\n');

        // Generate embeddings for all questions and variations
        console.log('🧠 Generating embeddings...\n');

        const embeddings = [];
        const metadata = [];
        let processedCount = 0;

        for (const faq of allFAQs) {
            // Create entries for main question and all variations
            const allQuestions = [faq.question, ...(faq.variations || [])];

            for (const question of allQuestions) {
                if (!question || typeof question !== 'string') {
                    console.log(`⚠️  Skipping invalid question in FAQ ${faq.id}`);
                    continue;
                }

                try {
                    // Generate embedding
                    const output = await embedder(question, { pooling: 'mean', normalize: true });
                    const embedding = Array.from(output.data);

                    // Store embedding
                    embeddings.push(embedding);

                    // Store metadata
                    metadata.push({
                        id: faq.id,
                        question: question,
                        original_question: faq.question,
                        answer: faq.answer,
                        category: faq.category,
                        products: faq.products || [],
                        tags: faq.tags || [],
                        requires_prescription: faq.requires_prescription,
                        severity: faq.severity,
                        age_group: faq.age_group
                    });

                    processedCount++;

                    // Progress indicator
                    if (processedCount % 50 === 0) {
                        console.log(`   ✓ Processed ${processedCount} questions...`);
                    }
                } catch (err) {
                    console.error(`❌ Error embedding question: "${question}" (ID: ${faq.id}):`, err.message);
                }
            }
        }

        console.log(`\n✅ Generated ${embeddings.length} embeddings!\n`);

        // Initialize Vector Search (Optimized JS)
        console.log('🏗️ Building Vector Index...');
        const { VectorSearch } = require('../services/vectorSearch');
        const vectorSearch = new VectorSearch();

        const INDEX_FILE = path.join(OUTPUT_DIR, 'faq_embeddings_comprehensive.json');

        await vectorSearch.buildIndex(embeddings, metadata, INDEX_FILE);

        // Save metadata separately
        console.log('💾 Saving metadata...');
        fs.writeFileSync(
            METADATA_FILE,
            JSON.stringify(metadata, null, 2),
            'utf-8'
        );
        console.log(`✅ Metadata saved to: ${METADATA_FILE}`);

        // Generate summary report
        console.log('\n' + '='.repeat(60));
        console.log('📊 FAQ EMBEDDING GENERATION SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total FAQ Entries:        ${allFAQs.length}`);
        console.log(`Total Questions/Variants: ${embeddings.length}`);
        console.log(`Embedding Dimension:      ${embeddings[0].length}`);
        console.log(`Model Used:               Xenova/all-MiniLM-L6-v2`);
        console.log(`Embeddings File:          ${path.basename(INDEX_FILE)}`);
        console.log(`Metadata File:            ${path.basename(METADATA_FILE)}`);
        console.log('='.repeat(60));

        console.log('\n✅ FAQ embeddings built successfully!');
        console.log('\n📝 Next Steps:');
        console.log('1. Update server/index.js to load these embeddings');
        console.log('2. Update RAG service to search FAQs first');
        console.log('3. Test with various questions');

        console.log('\n🎉 Done!\n');

    } catch (error) {
        console.error('\n❌ Error building FAQ embeddings:', error);
        process.exit(1);
    }
}

// Run the script
buildFAQEmbeddings();
