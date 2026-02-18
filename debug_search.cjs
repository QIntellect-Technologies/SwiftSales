const { getEmbeddingService } = require('./server/services/embeddings');
const { getVectorSearch } = require('./server/services/vectorSearch');
const fs = require('fs-extra');
const path = require('path');

async function testSearch() {
    const embeddingsPath = path.join(__dirname, './server/data/embeddings/embeddings.json');
    const metadataPath = path.join(__dirname, './server/data/embeddings/metadata.json');

    if (!await fs.pathExists(embeddingsPath)) {
        console.error('Embeddings not found');
        return;
    }

    const metadata = await fs.readJson(metadataPath);
    const vectorSearch = getVectorSearch();
    await vectorSearch.initialize(embeddingsPath, metadata);
    const embeddingService = getEmbeddingService();

    const queries = ["Add 30 NEUROBION tablets", "Add 10 NAPA instead"];

    for (const q of queries) {
        console.log(`\nResults for "${q}":`);
        const results = await vectorSearch.searchByText(embeddingService, q, 5);
        results.forEach((r, i) => {
            console.log(`${i + 1}. ${r.metadata.name} (Similarity: ${r.similarity.toFixed(4)})`);
        });
    }
}

testSearch();
