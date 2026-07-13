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

        let finalData;
        let updatedCount = 0;
        let addedCount = 0;

        if (clearExisting) {
            // Replace mode: wipe and use new items
            finalData = newItems;
            addedCount = newItems.length;
        } else {
            // Merge mode: upsert by ID first, then fallback to name + company + pack_size
            const existingMap = new Map(
                currentData.map((p, idx) => {
                    const id = p.id || p.item_id;
                    if (id && !id.toString().startsWith('PROD_')) {
                        return [id.toString().toLowerCase().trim(), idx];
                    }
                    const n = p.name?.toLowerCase().trim() || '';
                    const c = p.company?.toLowerCase().trim() || 'unknown';
                    const ps = p.pack_size?.toLowerCase().trim() || '';
                    return [`${n}_|_${c}_|_${ps}`, idx];
                })
            );
            finalData = [...currentData];
            for (const incoming of newItems) {
                let uniqueKey = null;
                const incomingId = incoming.id || incoming.item_id;
                
                if (incomingId && !incomingId.toString().startsWith('PROD_')) {
                    uniqueKey = incomingId.toString().toLowerCase().trim();
                } else {
                    const n = incoming.name?.toLowerCase().trim() || '';
                    const c = incoming.company?.toLowerCase().trim() || 'unknown';
                    const ps = incoming.pack_size?.toLowerCase().trim() || '';
                    if (n) uniqueKey = `${n}_|_${c}_|_${ps}`;
                }

                if (uniqueKey && existingMap.has(uniqueKey)) {
                    // Duplicate — update in place, keep original id
                    // Stock ADDS UP instead of being replaced
                    const idx = existingMap.get(uniqueKey);
                    finalData[idx] = {
                        ...finalData[idx],
                        stock: (finalData[idx].stock || 0) + (incoming.stock || 0),
                        price: incoming.price,
                        company: incoming.company || finalData[idx].company,
                        category: incoming.category || finalData[idx].category,
                        pack_size: incoming.pack_size || finalData[idx].pack_size,
                        generic_name: incoming.generic_name || finalData[idx].generic_name,
                        status: ((finalData[idx].stock || 0) + (incoming.stock || 0)) > 0 ? 'Available' : 'Out of Stock',
                    };
                    updatedCount++;
                } else {
                    // New product — append
                    finalData.push(incoming);
                    if (uniqueKey) existingMap.set(uniqueKey, finalData.length - 1);
                    addedCount++;
                }
            }
        }
        await fs.writeJson(dataPath, finalData, { spaces: 2 });
        
        // Delete embeddings cache to force RAG rebuild
        const vectorPath = VECTORS_FILE;
        if (await fs.pathExists(vectorPath)) {
            await fs.remove(vectorPath);
            console.log('🗑️ Deleted old embeddings cache to force rebuild.');
        }

        // Reload products in service
        await productService.getAllProducts();

        const message = clearExisting
            ? `Replaced entire catalog with ${finalData.length} products.`
            : `Sync complete: ${addedCount} new, ${updatedCount} updated. Total: ${finalData.length}.`;

        res.json({
            success: true,
            message,
            count: finalData.length,
            added: addedCount,
            updated: updatedCount,
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
        // When manually marking Out of Stock, set stock to 0 so the display stays consistent.
        // When marking Available, do NOT override stock — preserve the real post-order count.
        // Only zero out if explicitly marking Out of Stock.
        if (status === 'Out of Stock') {
            currentData[idx].stock = 0;
        }
        // NOTE: We intentionally do NOT reset stock to 100 when toggling back to Available.
        // The real stock figure (e.g. 0 after selling all units) must be preserved.
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
 * PUT /api/products/:id
 * Edit all fields of a product
 */
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const dataPath = MEDICINES_FILE;

        if (!(await fs.pathExists(dataPath))) {
            return res.status(404).json({ success: false, message: 'Data file not found.' });
        }

        const currentData = await fs.readJson(dataPath);
        const idx = currentData.findIndex(p => (p.id === id || p.item_id === id));

        if (idx === -1) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        currentData[idx] = {
            ...currentData[idx],
            ...updates,
            id: currentData[idx].id, // never overwrite the id
        };

        await fs.writeJson(dataPath, currentData, { spaces: 2 });
        await productService.getAllProducts();

        // Invalidate embeddings so RAG rebuilds with new data
        const { VECTORS_FILE: vf } = require('../paths');
        if (await fs.pathExists(vf)) {
            await fs.remove(vf);
        }

        res.json({ success: true, product: currentData[idx] });
    } catch (error) {
        console.error('Error updating product:', error);
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
