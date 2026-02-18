const { pipeline } = require('@xenova/transformers');

class EmbeddingService {
    constructor() {
        this.model = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        console.log('🔄 Loading embedding model (Xenova/all-MiniLM-L6-v2)...');
        try {
            this.model = await pipeline(
                'feature-extraction',
                'Xenova/all-MiniLM-L6-v2'
            );
            this.initialized = true;
            console.log('✅ Embedding model loaded successfully!');
        } catch (error) {
            console.error('❌ Error loading embedding model:', error);
            throw error;
        }
    }

    async embed(text) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            const output = await this.model(text, {
                pooling: 'mean',
                normalize: true
            });

            // Convert to regular array
            return Array.from(output.data);
        } catch (error) {
            console.error('Error embedding text:', error);
            throw error;
        }
    }

    async embedBatch(texts) {
        if (!this.initialized) {
            await this.initialize();
        }

        const embeddings = [];
        for (const text of texts) {
            const embedding = await this.embed(text);
            embeddings.push(embedding);
        }
        return embeddings;
    }
}

// Singleton instance
let embeddingServiceInstance = null;

function getEmbeddingService() {
    if (!embeddingServiceInstance) {
        embeddingServiceInstance = new EmbeddingService();
    }
    return embeddingServiceInstance;
}

module.exports = { EmbeddingService, getEmbeddingService };
