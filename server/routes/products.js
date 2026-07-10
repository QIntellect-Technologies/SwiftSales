const express = require('express');
const router = express.Router();
const { productService } = require('../services/productService');
const fs = require('fs-extra');
const path = require('path');
const { MEDICINES_FILE, VECTORS_FILE } = require('../paths');
const authMiddleware = require('../middleware/authMiddleware');

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
router.post('/upload', authMiddleware, async (req, res) => {
    try {
        const { items, clearExisting } = req.body;
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, message: 'Invalid items array.' });
        }

        const dataPath = MEDICINES_FILE;
        let currentData = [];

        if (!clearExisting && await fs.pathExists(dataPath)) {
            currentData = await fs.readJson(dataPath);
        }

        // Helper: case-insensitive field lookup on each Excel row
        const get = (item, ...keys) => {
            for (const key of keys) {
                // Try exact match first, then case-insensitive scan
                if (item[key] !== undefined && item[key] !== null && item[key] !== '') return item[key];
                const found = Object.keys(item).find(k => k.toLowerCase() === key.toLowerCase());
                if (found && item[found] !== undefined && item[found] !== null && item[found] !== '') return item[found];
            }
            return undefined;
        };

        // Map incoming Excel rows to our internal product format
        const newItems = items.map(item => ({
            id: get(item, 'id', 'item_id') || `PROD_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            name: get(item, 'name_en', 'name', 'Name', 'description', 'Description') || '',
            generic_name: get(item, 'generic_name', 'Generic Name', 'genericName') || '',
            category: get(item, 'category', 'Category') || 'General',
            company: get(item, 'company', 'Company', 'manufacturer', 'Manufacturer') || 'Unknown',
            price: parseFloat(get(item, 'price', 'Price', 'unit_price') || 0),
            stock: parseInt(get(item, 'stock', 'Stock', 'quantity', 'Quantity') || 100),
            pack_size: get(item, 'pack_size', 'Pack Size', 'package_size', 'packaging', 'Pack') || '',
            status: get(item, 'status', 'Status') || 'Available',
        }));

        const finalData = [...currentData, ...newItems];
        await fs.writeJson(dataPath, finalData, { spaces: 2 });
        
        // Delete embeddings cache to force RAG rebuild
        const vectorPath = VECTORS_FILE;
        if (await fs.pathExists(vectorPath)) {
            await fs.remove(vectorPath);
            console.log('🗑️ Deleted old embeddings cache to force rebuild.');
        }

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
        const dataPath = MEDICINES_FILE;
        
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
 * PATCH /api/products/:id/status
 * Toggle product stock status (Available / Out of Stock)
 */
router.patch('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Available' or 'Out of Stock'

        if (!status || !['Available', 'Out of Stock'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status. Must be "Available" or "Out of Stock".' });
        }

        const dataPath = MEDICINES_FILE;

        if (!(await fs.pathExists(dataPath))) {
            return res.status(404).json({ success: false, message: 'Data file not found.' });
        }

        const currentData = await fs.readJson(dataPath);
        const idx = currentData.findIndex(p => (p.id === id || p.item_id === id));

        if (idx === -1) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        currentData[idx].status = status;
        await fs.writeJson(dataPath, currentData, { spaces: 2 });

        // Reload products in memory
        await productService.getAllProducts();

        res.json({ success: true, product: currentData[idx] });
    } catch (error) {
        console.error('Error updating product status:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * DELETE /api/products/:id
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const dataPath = MEDICINES_FILE;
        
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
