const fs = require('fs-extra');
const path = require('path');
const { getEmbeddingService } = require('../services/embeddings');
const { getVectorSearch } = require('../services/vectorSearch');

async function buildEmbeddings() {
    console.log('🚀 Starting Large-Scale Embedding Generation...\n');

    try {
        // Use the full dataset from root
        const medicinesPath = path.join(__dirname, '../../medicines_data.json');

        if (!await fs.pathExists(medicinesPath)) {
            throw new Error(`Medicines file not found at: ${medicinesPath}`);
        }

        const rawData = await fs.readJson(medicinesPath);
        console.log(`📦 Loaded ${rawData.length} items from medicines_data.json\n`);

        // Map to standard format
        const medicines = rawData.map(product => ({
            id: product.item_id,
            name: product.description,
            pack_size: product.pack_size,
            company: product.company
        }));

        // Initialize embedding service
        const embeddingService = getEmbeddingService();
        await embeddingService.initialize();

        const embeddings = [];
        const metadata = [];
        const BATCH_SIZE = 50;

        console.log(`🔄 Generating embeddings in batches of ${BATCH_SIZE}...`);

        for (let i = 0; i < medicines.length; i += BATCH_SIZE) {
            const batch = medicines.slice(i, i + BATCH_SIZE);
            const batchTexts = batch.map(m =>
                `${m.name} ${m.pack_size || ''} ${m.company} pharmaceutical product medicine`
            );

            try {
                // Use embedBatch for faster inference
                const batchEmbeddings = await embeddingService.embedBatch(batchTexts);

                embeddings.push(...batchEmbeddings);
                metadata.push(...batch);

                const progress = Math.min(i + BATCH_SIZE, medicines.length);
                const percent = ((progress / medicines.length) * 100).toFixed(1);
                process.stdout.write(`\r   Progress: ${progress}/${medicines.length} (${percent}%)          `);
            } catch (batchError) {
                console.error(`\n❌ Error in batch ${i}-${i + BATCH_SIZE}:`, batchError.message);
                // Continue to next batch instead of failing entirely
            }
        }

        console.log(`\n\n✅ Generated ${embeddings.length} embeddings successfully.\n`);

        // Save embeddings and metadata
        const embeddingsDir = path.join(__dirname, '../data/embeddings');
        await fs.ensureDir(embeddingsDir);

        const embeddingsPath = path.join(embeddingsDir, 'embeddings.json');
        const metadataPath = path.join(embeddingsDir, 'metadata.json');

        console.log('💾 Saving to disk (this might take a moment)...');
        await fs.writeJson(embeddingsPath, embeddings);
        await fs.writeJson(metadataPath, metadata);

        console.log(`✅ Saved embeddings and metadata.`);

        // Final verification
        const vectorSearch = getVectorSearch();
        await vectorSearch.initialize(embeddings, metadata);

        console.log('\n🧪 Testing Search Accuracy...');
        const testQueries = ['pain relief', 'ACER 50MG', 'insulin'];

        for (const query of testQueries) {
            const results = await vectorSearch.searchByText(embeddingService, query, 3);
            console.log(`\nQuery: "${query}"`);
            results.forEach((res, i) => {
                console.log(`  ${i + 1}. ${res.metadata.name} (${res.metadata.company}) [Score: ${res.similarity.toFixed(4)}]`);
            });
        }

        console.log('\n🎉 RAG System Scaled and Ready!');

    } catch (error) {
        console.error('\n❌ Critical Error:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    buildEmbeddings().catch(console.error);
}

module.exports = { buildEmbeddings };
