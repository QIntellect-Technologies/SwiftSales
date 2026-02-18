const { pipeline } = require('@xenova/transformers');

class ReRankingService {
    constructor() {
        this.reranker = null;
        this.initialized = false;
        this.modelName = 'Xenova/ms-marco-MiniLM-L-6-v2'; // Optimized for re-ranking
    }

    async initialize() {
        if (this.initialized) return;
        this.initialized = true;
        console.log('✅ Re-ranking service processed (Using LLM for intelligence)');
    }

    /**
     * Re-rank a list of candidates based on the query using fast heuristics
     * OPTIMIZED: No LLM calls - uses scoring algorithm for instant results
     * @param {string} query - user query
     * @param {Array} candidates - list of objects
     * @param {number} topK - number of results to return
     */
    async rerank(query, candidates, topK = 5) {
        if (candidates.length === 0) return [];
        if (candidates.length <= topK) return candidates.slice(0, topK);

        const lowerQuery = query.toLowerCase();
        const queryTokens = lowerQuery.split(/\s+/).filter(t => t.length > 2);

        // Score each candidate based on multiple factors
        const scored = candidates.map(candidate => {
            const meta = candidate.metadata;
            const name = (meta.name || '').toLowerCase();
            const description = (meta.description || '').toLowerCase();
            const company = (meta.company || '').toLowerCase();
            const category = (meta.category || '').toLowerCase();
            
            let score = candidate.similarity || 0; // Start with vector similarity

            // Boost exact name matches
            if (name.includes(lowerQuery)) score += 0.3;
            
            // Boost token matches in name
            const nameTokens = name.split(/\s+/);
            const tokenMatches = queryTokens.filter(qt => nameTokens.some(nt => nt.includes(qt)));
            score += (tokenMatches.length / queryTokens.length) * 0.2;

            // Boost if product name starts with query
            if (name.startsWith(lowerQuery)) score += 0.15;

            // Penalize non-medicine products for medical queries
            const medicalKeywords = ['pain', 'fever', 'headache', 'cold', 'flu', 'infection', 'diabetes', 'pressure'];
            const nonMedicineCategories = ['baby care', 'hygiene', 'cosmetics', 'shampoo', 'lotion'];
            
            if (medicalKeywords.some(kw => lowerQuery.includes(kw))) {
                if (nonMedicineCategories.some(cat => category.includes(cat) || name.includes(cat))) {
                    score -= 0.2;
                }
            }

            // Boost pharmaceutical companies
            if (company && !company.includes('not specified')) {
                score += 0.05;
            }

            return { ...candidate, rerankScore: score };
        });

        // Sort by re-rank score and return top K
        return scored
            .sort((a, b) => b.rerankScore - a.rerankScore)
            .slice(0, topK);
    }
}

// Singleton
let reRankingInstance = null;

function getReRankingService() {
    if (!reRankingInstance) {
        reRankingInstance = new ReRankingService();
    }
    return reRankingInstance;
}

module.exports = { ReRankingService, getReRankingService };
