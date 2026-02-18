const { RAGService } = require('./services/rag');
const { pipeline } = require('@xenova/transformers');

async function check() {
    const rag = new RAGService();
    await rag.loadFAQVectors();
    const pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    const queries = [
        "what is your favorite movie?",
        "will you marry me?",
        "panadol vs brufen comparison",
        "how to store insulin"
    ];

    for (const q of queries) {
        const out = await pipe(q, { pooling: 'mean', normalize: true });
        const match = await rag.findBestFAQVectorMatch(Array.from(out.data));
        console.log(`Q: ${q} -> ID: ${match.id} (Score: ${match.score.toFixed(2)})`);
    }
}
check();
