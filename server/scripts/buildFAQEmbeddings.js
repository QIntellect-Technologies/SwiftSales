const fs = require('fs-extra');
const path = require('path');
const { getEmbeddingService } = require('../services/embeddings');

async function buildFAQEmbeddings() {
    console.log('🚀 Starting FAQ Vector Indexing...\n');

    try {
        const faqPath = path.join(__dirname, '../data/faq_data.json');

        if (!await fs.pathExists(faqPath)) {
            throw new Error(`FAQ file not found at: ${faqPath}`);
        }

        const faqs = await fs.readJson(faqPath);
        console.log(`📦 Loaded ${faqs.length} FAQs from faq_data.json\n`);

        // Initialize embedding service
        const embeddingService = getEmbeddingService();
        await embeddingService.initialize();

        const embeddings = [];
        const metadata = faqs; // Metadata is the FAQ object itself {question, answer, category}
        const BATCH_SIZE = 50;

        console.log(`🔄 Generating embeddings in batches of ${BATCH_SIZE}...`);

        for (let i = 0; i < faqs.length; i += BATCH_SIZE) {
            const batch = faqs.slice(i, i + BATCH_SIZE);
            const batchTexts = batch.map(f => f.question); // Embed the question text

            try {
                // Use embedBatch for faster inference
                const batchEmbeddings = await embeddingService.embedBatch(batchTexts);

                embeddings.push(...batchEmbeddings);

                const progress = Math.min(i + BATCH_SIZE, faqs.length);
                const percent = ((progress / faqs.length) * 100).toFixed(1);
                process.stdout.write(`\r   Progress: ${progress}/${faqs.length} (${percent}%)          `);
            } catch (batchError) {
                console.error(`\n❌ Error in batch ${i}-${i + BATCH_SIZE}:`, batchError.message);
            }
        }

        console.log(`\n\n✅ Generated ${embeddings.length} FAQ embeddings successfully.\n`);

        // Save embeddings
        const embeddingsDir = path.join(__dirname, '../data/embeddings');
        await fs.ensureDir(embeddingsDir);

        const embeddingsPath = path.join(embeddingsDir, 'faq_embeddings.json');
        // We don't need separate metadata file as faq_data.json IS the metadata, 
        // but for consistency with vectorSearch service (which expects metadata array matching embeddings index),
        // we can save it or just use the loaded faq_data.json if we guarantee order.
        // To be safe and compatible with standard vectorSearch, let's save a paired metadata file valid for these embeddings.
        const metadataPath = path.join(embeddingsDir, 'faq_metadata.json');

        console.log('💾 Saving to disk...');
        await fs.writeJson(embeddingsPath, embeddings);
        await fs.writeJson(metadataPath, metadata);

        console.log(`✅ Saved FAQ embeddings and metadata.`);

    } catch (error) {
        console.error('\n❌ Critical Error:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    buildFAQEmbeddings().catch(console.error);
}

module.exports = { buildFAQEmbeddings };
