
const { getVectorSearch } = require('./services/vectorSearch');
const { getEmbeddingService } = require('./services/embeddings');

async function test() {
    console.log("Initializing Embedding Service...");
    const embeddingService = getEmbeddingService();
    await embeddingService.initialize();
    
    const vectorSearch = getVectorSearch();
    await vectorSearch.initialize(embeddingService); // Ensure standard init (if any)

    console.log("Searching for 'PANADOL'...");
    const results = await vectorSearch.searchByText(embeddingService, "PANADOL", 5);
    console.log("Results for PANADOL:", results);

    console.log("Searching for 'Augmentin'...");
    const results2 = await vectorSearch.searchByText(embeddingService, "Augmentin", 5);
    console.log("Results for Augmentin:", results2);
}

test().catch(console.error);
