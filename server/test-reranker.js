
/**
 * Test Script for RAG Re-Ranking
 * Verifies that Re-Ranker can distinguish relevant pain meds from irrelevant shampoo
 * for a headache query.
 */

const { ReRankingService } = require('./services/reRanker');

async function testReRanker() {
    console.log("🚀 Starting Re-Ranker Test...");

    const reRanker = new ReRankingService();
    await reRanker.initialize();

    const query = "My head is paining very much";

    // Simulate Vector Search results (where Shampoo might have high cosine similarity due to 'head' vs 'scalp')
    const mockCandidates = [
        {
            metadata: { name: "SCALP VI SHAMPOO", question: "Shampoo for scalp care", description: "Anti-dandruff shampoo for scalp." },
            similarity: 0.85 // Artificially high vector score
        },
        {
            metadata: { name: "KETOZ LOTION", question: "Lotion for skin", description: "Antifungal lotion." },
            similarity: 0.82
        },
        {
            metadata: { name: "PANADOL", question: "Pain relief for headache", description: "Effective for headaches and fever." },
            similarity: 0.75 // Lower vector score (maybe due to exact keyword mismatch)
        },
        {
            metadata: { name: "BRUFEN", question: "Anti-inflammatory pain killer", description: "Relieves pain and inflammation." },
            similarity: 0.72
        }
    ];

    console.log(`\n❓ Query: "${query}"`);
    console.log("📊 Initial Vector Ranking (Simulated):");
    mockCandidates.forEach((c, i) => console.log(`${i + 1}. ${c.metadata.name} (Score: ${c.similarity})`));

    console.log("\n🔄 Re-Ranking...");
    const reranked = await reRanker.rerank(query, mockCandidates, 4);

    console.log("\n✅ Re-Ranked Results:");
    reranked.forEach((c, i) => {
        console.log(`${i + 1}. ${c.metadata.name} (New Score: ${c.rerankScore?.toFixed(4)})`);
    });

    // Validation
    if (reranked[0].metadata.name === 'PANADOL' || reranked[0].metadata.name === 'BRUFEN') {
        console.log("\n✅ SUCCESS: Pain meds ranked higher than shampoo!");
    } else {
        console.log("\n❌ Hmmm, Shampoo is still top. Re-ranker might need tuning.");
    }
}

testReRanker();
