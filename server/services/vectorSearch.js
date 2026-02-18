const path = require('path');
const fs = require('fs-extra');

class VectorSearch {
    constructor() {
        this.embeddings = null;
        this.metadata = [];
        this.dimensions = 0;
        this.initialized = false;
        this.numItems = 0;
    }

    /**
     * Initialize the Vector Search
     * @param {string} indexPath - Path to load the index (JSON file)
     * @param {Array} metadata - Metadata array
     */
    async initialize(indexPath, metadata) {
        this.metadata = metadata;
        this.numItems = metadata.length;

        try {
            if (fs.existsSync(indexPath)) {
                console.log(`Loading Vector Index from ${indexPath}...`);
                const rawData = await fs.readJson(indexPath);

                if (rawData && rawData.length > 0) {
                    this.dimensions = rawData[0].length;
                    // Flatten to simple array of Float32Arrays for speed
                    this.embeddings = rawData.map(vec => new Float32Array(vec));
                    this.initialized = true;
                    console.log(`✅ Vector Index loaded with ${this.numItems} items (Optimized JS).`);
                }
            } else {
                console.warn(`⚠️ Index file not found at ${indexPath}.`);
            }
        } catch (error) {
            console.error('❌ Error initializing Vector Index:', error);
        }
    }

    /**
     * Build index (In-Memory) and save to disk
     */
    async buildIndex(embeddings, metadata, savePath) {
        this.dimensions = embeddings[0].length;
        this.metadata = metadata;

        console.log(`Optimizing ${embeddings.length} vectors...`);
        // Save as standard JSON array of arrays
        await fs.writeJson(savePath, embeddings);
        console.log(`Saved vector data to ${savePath}`);

        // Update in-memory state
        this.embeddings = embeddings.map(vec => new Float32Array(vec));
        this.numItems = embeddings.length;
        this.initialized = true;
    }

    /**
     * Search (Brute-Force Cosine Similarity - Optimized)
     */
    async search(queryEmbedding, topK = 20) {
        if (!this.initialized || !this.embeddings) return [];

        const numDimensions = this.dimensions;
        const numItems = this.embeddings.length;

        // 1. Normalize Query Vector
        let qNorm = 0;
        for (let i = 0; i < numDimensions; i++) {
            qNorm += queryEmbedding[i] * queryEmbedding[i];
        }
        qNorm = Math.sqrt(qNorm);

        const qVec = new Float32Array(numDimensions);
        for (let i = 0; i < numDimensions; i++) {
            qVec[i] = queryEmbedding[i] / (qNorm || 1);
        }

        const results = [];

        for (let i = 0; i < numItems; i++) {
            const vec = this.embeddings[i];
            let dot = 0;
            // Assuming index vectors are pre-normalized for speed (standard practice)
            // standard Xenova pipeline output is usually normalized if {normalize: true} is set.
            for (let j = 0; j < numDimensions; j++) {
                dot += vec[j] * qVec[j];
            }

            results.push({ index: i, similarity: dot, metadata: this.metadata[i] });
        }

        return results.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
    }

    async searchByText(embeddingService, queryText, topK = 20) {
        const queryEmbedding = await embeddingService.embed(queryText);
        return this.search(queryEmbedding, topK);
    }
}

let vectorSearchInstance = null;

function getVectorSearch() {
    if (!vectorSearchInstance) {
        vectorSearchInstance = new VectorSearch();
    }
    return vectorSearchInstance;
}

module.exports = { VectorSearch, getVectorSearch };
