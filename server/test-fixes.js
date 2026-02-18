/**
 * FOCUSED TEST FOR BUG FIXES
 * Tests the specific issues that were fixed:
 * 1. "get out" false positive matching
 * 2. Update command handling (update 1 to 10)
 * 3. Profanity filtering
 * 4. Cart persistence during updates
 */

const { getRAGService } = require('./services/rag');
const { getVectorSearch } = require('./services/vectorSearch');
const { getEmbeddingService } = require('./services/embeddings');
const { getReRankingService } = require('./services/reRanker');

// Colors
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    red: '\x1b[31m',
    bright: '\x1b[1m'
};

let passedTests = 0;
let failedTests = 0;

function createUserContext() {
    return {
        chatHistory: [],
        orderState: null,
        orderData: null,
        cart: [],
        sessionId: `test_${Date.now()}`
    };
}

async function testMessage(ragService, vectorSearch, embeddingService, reRanker, message, userContext, testName, expectedConditions) {
    console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.bright}TEST: ${testName}${colors.reset}`);
    console.log(`${colors.yellow}Input: "${message}"${colors.reset}`);

    try {
        // Get products
        const candidates = await vectorSearch.searchByText(embeddingService, message, 20);
        let rankedResults = await reRanker.rerank(message, candidates, 5);

        // Apply minimum score filter
        const MIN_RERANK_SCORE = 0.25;
        rankedResults = rankedResults.filter(r => {
            const score = r.rerankScore || r.similarity || 0;
            return score >= MIN_RERANK_SCORE;
        });

        // Generate response
        const response = await ragService.generateResponse(message, rankedResults, userContext);

        console.log(`${colors.green}Response:${colors.reset}`);
        console.log(response.substring(0, 300) + (response.length > 300 ? '...' : ''));

        // Check expected conditions
        let allPassed = true;
        for (const condition of expectedConditions) {
            const passed = condition.check(response, userContext, rankedResults);
            if (passed) {
                console.log(`${colors.green}✅ ${condition.description}${colors.reset}`);
                passedTests++;
            } else {
                console.log(`${colors.red}❌ ${condition.description}${colors.reset}`);
                failedTests++;
                allPassed = false;
            }
        }

        return allPassed;

    } catch (error) {
        console.log(`${colors.red}❌ ERROR: ${error.message}${colors.reset}`);
        failedTests += expectedConditions.length;
        return false;
    }
}

async function runTests() {
    console.log(`${colors.bright}${colors.blue}
╔═══════════════════════════════════════════════════════════════╗
║         BUG FIX VERIFICATION TEST SUITE                       ║
╚═══════════════════════════════════════════════════════════════╝
${colors.reset}`);

    // Initialize services
    console.log(`${colors.yellow}🔄 Initializing services...${colors.reset}`);
    const embeddingService = getEmbeddingService();
    await embeddingService.initialize();

    const vectorSearch = getVectorSearch();
    const fs = require('fs-extra');
    const path = require('path');
    const metadataPath = path.join(__dirname, 'data/embeddings/metadata.json');
    const embeddingsPath = path.join(__dirname, 'data/embeddings/embeddings.json');

    if (await fs.pathExists(metadataPath)) {
        const metadata = await fs.readJson(metadataPath);
        await vectorSearch.initialize(embeddingsPath, metadata);
    } else {
        console.warn(`${colors.red}⚠️ Vector metadata not found at ${metadataPath}${colors.reset}`);
    }

    const reRanker = getReRankingService();
    const ragService = getRAGService();

    console.log(`${colors.green}✅ Services initialized${colors.reset}\n`);

    // ==================== TEST 1: Profanity Filter ====================
    console.log(`\n${colors.bright}═══ TEST CATEGORY 1: PROFANITY FILTERING ═══${colors.reset}`);

    let ctx = createUserContext();
    await testMessage(ragService, vectorSearch, embeddingService, reRanker,
        "fuck you", ctx, "Profanity handling - offensive language",
        [{
            description: "Should NOT match any products",
            check: (response, context, products) => products.length === 0
        },
        {
            description: "Should respond professionally about respectful conversation",
            check: (response) => response.toLowerCase().includes('professional') || response.toLowerCase().includes('respectful')
        }]
    );

    ctx = createUserContext();
    await testMessage(ragService, vectorSearch, embeddingService, reRanker,
        "get out", ctx, "False positive test - 'get out' should NOT match GETXIME",
        [{
            description: "Should NOT match GETXIME product",
            check: (response, context, products) => !response.toLowerCase().includes('getxime')
        },
        {
            description: "Should handle as frustrated user professionally",
            check: (response) => response.toLowerCase().includes('help') || response.toLowerCase().includes('assist')
        }]
    );

    ctx = createUserContext();
    await testMessage(ragService, vectorSearch, embeddingService, reRanker,
        "stupid", ctx, "Profanity - 'stupid' alone",
        [{
            description: "Should respond professionally without product match",
            check: (response) => response.toLowerCase().includes('professional') || response.toLowerCase().includes('respectful')
        }]
    );

    // ==================== TEST 2: Cart Operations ====================
    console.log(`\n${colors.bright}═══ TEST CATEGORY 2: CART OPERATIONS ═══${colors.reset}`);

    ctx = createUserContext();
    await testMessage(ragService, vectorSearch, embeddingService, reRanker,
        "add 4 CURAZOLE and 22 FEXOZIN", ctx, "Multi-item add",
        [{
            description: "Should add CURAZOLE to cart with qty 4",
            check: (response, context) => context.cart.some(item =>
                item.productName.includes('CURAZOLE') && item.quantity === 4
            )
        },
        {
            description: "Should add FEXOZIN to cart with qty 22",
            check: (response, context) => context.cart.some(item =>
                item.productName.includes('FEXOZIN') && item.quantity === 22
            )
        },
        {
            description: "Cart should have 2 products",
            check: (response, context) => context.cart.length === 2
        }]
    );

    await testMessage(ragService, vectorSearch, embeddingService, reRanker,
        "add FLOTIZOL", ctx, "Add single item to existing cart",
        [{
            description: "Should add FLOTIZOL to cart",
            check: (response, context) => context.cart.some(item =>
                item.productName.includes('FLOTIZOL')
            )
        },
        {
            description: "Should still have CURAZOLE in cart (not cleared)",
            check: (response, context) => context.cart.some(item =>
                item.productName.includes('CURAZOLE')
            )
        },
        {
            description: "Should still have FEXOZIN in cart (not cleared)",
            check: (response, context) => context.cart.some(item =>
                item.productName.includes('FEXOZIN')
            )
        },
        {
            description: "Cart should have 3 products total",
            check: (response, context) => context.cart.length === 3
        }]
    );

    // ==================== TEST 3: Update Command ====================
    console.log(`\n${colors.bright}═══ TEST CATEGORY 3: UPDATE COMMAND ═══${colors.reset}`);

    await testMessage(ragService, vectorSearch, embeddingService, reRanker,
        "update 1 FLOTIZOL to 10 FLOTIZOL", ctx, "Update quantity from 1 to 10",
        [{
            description: "FLOTIZOL quantity should be updated to 10",
            check: (response, context) => context.cart.some(item =>
                item.productName.includes('FLOTIZOL') && item.quantity === 10
            )
        },
        {
            description: "Should NOT add a second FLOTIZOL item",
            check: (response, context) => context.cart.filter(item =>
                item.productName.includes('FLOTIZOL')
            ).length === 1
        },
        {
            description: "Should still have CURAZOLE (cart not cleared)",
            check: (response, context) => context.cart.some(item =>
                item.productName.includes('CURAZOLE')
            )
        },
        {
            description: "Should still have FEXOZIN (cart not cleared)",
            check: (response, context) => context.cart.some(item =>
                item.productName.includes('FEXOZIN')
            )
        },
        {
            description: "Cart should still have exactly 3 products",
            check: (response, context) => context.cart.length === 3
        }]
    );

    // Different update patterns
    await testMessage(ragService, vectorSearch, embeddingService, reRanker,
        "change CURAZOLE to 15", ctx, "Update using 'change X to Y' pattern",
        [{
            description: "CURAZOLE quantity should be 15",
            check: (response, context) => context.cart.some(item =>
                item.productName.includes('CURAZOLE') && item.quantity === 15
            )
        },
        {
            description: "Cart still has 3 items (no duplication)",
            check: (response, context) => context.cart.length === 3
        }]
    );

    await testMessage(ragService, vectorSearch, embeddingService, reRanker,
        "modify FEXOZIN quantity to 30", ctx, "Update using 'modify quantity to Y' pattern",
        [{
            description: "FEXOZIN quantity should be 30",
            check: (response, context) => context.cart.some(item =>
                item.productName.includes('FEXOZIN') && item.quantity === 30
            )
        }]
    );

    // ==================== TEST 4: Edge Cases ====================
    console.log(`\n${colors.bright}═══ TEST CATEGORY 4: EDGE CASES ═══${colors.reset}`);

    ctx = createUserContext();
    await testMessage(ragService, vectorSearch, embeddingService, reRanker,
        "hi", ctx, "Greeting should not match products",
        [{
            description: "Should be a greeting response",
            check: (response) => response.toLowerCase().includes('hello') ||
                response.toLowerCase().includes('hi') ||
                response.toLowerCase().includes('welcome')
        }]
    );

    ctx = createUserContext();
    await testMessage(ragService, vectorSearch, embeddingService, reRanker,
        "who is the CEO?", ctx, "Company info question",
        [{
            description: "Should mention CEO name (Ejaz Malik)",
            check: (response) => response.toLowerCase().includes('ejaz malik')
        }]
    );

    // ==================== FINAL RESULTS ====================
    console.log(`\n${colors.bright}${'═'.repeat(70)}${colors.reset}`);
    console.log(`${colors.bright}${colors.blue}FINAL RESULTS${colors.reset}`);
    console.log(`${colors.bright}${'═'.repeat(70)}${colors.reset}`);

    const total = passedTests + failedTests;
    const passRate = ((passedTests / total) * 100).toFixed(1);

    console.log(`\n${colors.bright}📊 Test Statistics:${colors.reset}`);
    console.log(`   Total Assertions: ${total}`);
    console.log(`   ${colors.green}✅ Passed: ${passedTests}${colors.reset}`);
    console.log(`   ${colors.red}❌ Failed: ${failedTests}${colors.reset}`);
    console.log(`   Pass Rate: ${passRate}%`);

    if (failedTests === 0) {
        console.log(`\n${colors.bright}${colors.green}🎉 ALL TESTS PASSED! All bugs are fixed!${colors.reset}\n`);
    } else {
        console.log(`\n${colors.bright}${colors.yellow}⚠️  Some tests failed. Review needed.${colors.reset}\n`);
    }
}

runTests().catch(console.error);
