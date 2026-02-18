
/**
 * Test Script for Local LLM + RAG Integration
 * 
 * Usage: node server/test-llm-rag.js
 */

const fs = require('fs-extra');
const path = require('path');
const { RAGService } = require('./services/rag');
const { LLMService, getLLMService } = require('./services/llm');

async function testRAGPipeline() {
    console.log("🚀 Starting LLM RAG Test...");

    // 1. Initialize RAG Service
    console.log("初始化 RAG Service...");
    const ragService = new RAGService();
    // We mock global.productDetails since we are not loading the full server
    // But RAGService might need it for findBestProductNameMatch
    global.productDetails = {};

    // 2. Initialize LLM Service (Normally done via getLLMService singleton)
    console.log("初始化 LLM Service...");
    const llmService = getLLMService();

    // 3. Simulate a query
    const query = "What is Panadol used for?";
    console.log(`\n❓ Test Query: "${query}"`);

    // 4. Mock Context Data (Simulating output from Vector Search + ReRanker)
    // In real app, this comes from index.js calling vectorSearch.search()
    const mockRelevantProducts = [
        {
            metadata: {
                id: "101",
                name: "PANADOL",
                company: "GSK",
                pack_size: "200 Tablets",
                description: "Panadol contains Paracetamol and is used for pain relief and fever reduction.",
                active_ingredients: ["Paracetamol"],
                category: "Pain Relief"
            },
            score: 0.95
        },
        {
            metadata: {
                id: "102",
                name: "CALPOL",
                company: "GSK",
                pack_size: "Suspension",
                description: "Calpol also contains Paracetamol and is suitable for children.",
                active_ingredients: ["Paracetamol"],
                category: "Pain Relief"
            },
            score: 0.85
        }
    ];

    console.log(`📚 Mock Context: ${mockRelevantProducts.length} items.`);

    // 5. Generate Response via LLM
    console.log("\n🤖 Generative Response (Ollama)...");
    try {
        const response = await llmService.generateResponse(query, mockRelevantProducts, []);

        console.log("\n✅ LLM Response:");
        console.log("---------------------------------------------------");
        console.log(response);
        console.log("---------------------------------------------------");

    } catch (error) {
        console.error("\n❌ LLM Generation Failed:", error);
    }
}

// Mock minimal environment for RAGService if needed
process.env.HF_TOKEN = "mock";

testRAGPipeline();
