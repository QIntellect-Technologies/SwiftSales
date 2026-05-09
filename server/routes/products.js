const express = require('express');
const router = express.Router();
const { productService } = require('../services/productService');
const fs = require('fs-extra');
const path = require('path');

/**
 * GET /api/products
 * Fetch all products from local JSON
 */
router.get('/', async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        const { categories, companies } = productService.getAllCategories();
        res.json({
            success: true,
            count: products.length,
            products,
            categories,
            companies
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * POST /api/products/upload
 * Handle bulk upload from Admin Panel
 */
router.post('/upload', async (req, res) => {
    try {
        const { items, clearExisting } = req.body;
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, message: 'Invalid items array.' });
        }

        const dataPath = path.join(__dirname, '../data/medicines.json');
        let currentData = [];

        if (!clearExisting && await fs.pathExists(dataPath)) {
            currentData = await fs.readJson(dataPath);
        }

        // Map incoming ExcelMenuItem to the format expected by the frontend/chatbot
        const newItems = items.map(item => ({
            id: item.id || `PROD_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            name: item.name_en || item.name,
            generic_name: item.generic_name || '',
            category: item.category || 'General',
            price: item.price || 0,
            stock: item.stock || 100,
            manufacturer: item.manufacturer || item.company || 'Unknown',
            batch_number: item.batch_number || '',
            expiry_date: item.expiry_date || '',
            package_size: item.packaging || item.package_size || '',
            status: 'Available'
        }));

        const finalData = [...currentData, ...newItems];
        await fs.writeJson(dataPath, finalData, { spaces: 2 });
        
        // Reload products in service
        await productService.getAllProducts();

        res.json({
            success: true,
            message: `Successfully uploaded ${newItems.length} products.`,
            count: finalData.length
        });
    } catch (error) {
        console.error('Error uploading products:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * POST /api/products/add
 * Add a single product
 */
router.post('/add', async (req, res) => {
    try {
        const product = req.body;
        const dataPath = path.join(__dirname, '../data/medicines.json');
        
        let currentData = [];
        if (await fs.pathExists(dataPath)) {
            currentData = await fs.readJson(dataPath);
        }

        const newItem = {
            id: `PROD_${Date.now()}`,
            ...product,
            status: 'Available'
        };

        currentData.unshift(newItem);
        await fs.writeJson(dataPath, currentData, { spaces: 2 });
        await productService.getAllProducts();

        res.json({ success: true, product: newItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * DELETE /api/products/:id
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const dataPath = path.join(__dirname, '../data/medicines.json');
        
        if (await fs.pathExists(dataPath)) {
            const currentData = await fs.readJson(dataPath);
            const filteredData = currentData.filter(p => (p.id !== id && p.item_id !== id));
            await fs.writeJson(dataPath, filteredData, { spaces: 2 });
            await productService.getAllProducts();
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Data file not found.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
