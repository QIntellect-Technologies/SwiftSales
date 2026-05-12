require('dotenv').config();
const { productService } = require('./services/productService');
const { generateAIResponse } = require('./services/groqService');
const fs = require('fs-extra');
const path = require('path');

async function testQuery() {
    try {
        console.log('--- TEST START ---');
        const query = "i want to order";
        const products = await productService.getAllProducts();
        console.log(`Loaded ${products.length} products`);

        const context = {
            chatHistory: [],
            cart: []
        };

        console.log('Sending to AI...');
        const response = await generateAIResponse(query, products.slice(0, 5), context);
        console.log('AI Response:', JSON.stringify(response, null, 2));
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testQuery();
