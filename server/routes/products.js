const express = require('express');
const router = express.Router();
const { productService } = require('../services/productService');
const { db } = require('../database');
const fs = require('fs-extra');
const { VECTORS_FILE } = require('../paths');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * GET /api/products
 * Fetch all products from SQLite
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

        let currentData = [];
        if (!clearExisting) {
            currentData = await new Promise((resolve, reject) => {
                db.all('SELECT * FROM medicines', [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }

        // Helper: case-insensitive field lookup on each Excel row
        const get = (item, ...keys) => {
            for (const key of keys) {
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
            description: get(item, 'description', 'Description', 'name') || ''
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

        // Write finalData to SQLite
        await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                db.run('DELETE FROM medicines'); // Clear current table
                const stmt = db.prepare(`
                    INSERT INTO medicines (id, name, generic_name, category, company, price, stock, pack_size, status, description)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);
                for (const item of finalData) {
                    stmt.run(
                        item.id || item.item_id,
                        item.name || '',
                        item.generic_name || '',
                        item.category || 'General',
                        item.company || 'Unknown',
                        item.price || 0,
                        item.stock != null ? item.stock : 100,
                        item.pack_size || '',
                        item.status || 'Available',
                        item.description || item.name || ''
                    );
                }
                stmt.finalize();
                db.run('COMMIT', (err) => {
                    if (err) {
                        db.run('ROLLBACK');
                        reject(err);
                    } else resolve();
                });
            });
        });
        
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
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const product = req.body;
        const newItem = {
            id: `PROD_${Date.now()}`,
            ...product,
            status: 'Available'
        };

        await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO medicines (id, name, generic_name, category, company, price, stock, pack_size, status, description)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                newItem.id,
                newItem.name || '',
                newItem.generic_name || '',
                newItem.category || 'General',
                newItem.company || 'Unknown',
                newItem.price || 0,
                newItem.stock != null ? newItem.stock : 100,
                newItem.pack_size || '',
                newItem.status,
                newItem.description || newItem.name || ''
            ], function (err) {
                if (err) reject(err);
                else resolve();
            });
        });

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
        const { status } = req.body;

        if (!status || !['Available', 'Out of Stock'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status.' });
        }

        const stockUpdate = status === 'Out of Stock' ? 0 : null; // Only update stock to 0 if out of stock, else preserve

        await new Promise((resolve, reject) => {
            if (stockUpdate !== null) {
                db.run('UPDATE medicines SET status = ?, stock = ? WHERE id = ?', [status, stockUpdate, id], function (err) {
                    if (err) reject(err);
                    else resolve();
                });
            } else {
                db.run('UPDATE medicines SET status = ? WHERE id = ?', [status, id], function (err) {
                    if (err) reject(err);
                    else resolve();
                });
            }
        });

        await productService.getAllProducts();

        // Get updated product to return
        const product = productService.products.find(p => String(p.id) === String(id));
        res.json({ success: true, product: product || {} });
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
        
        await new Promise((resolve, reject) => {
            db.run(`
                UPDATE medicines 
                SET name = ?, generic_name = ?, category = ?, company = ?, price = ?, stock = ?, pack_size = ?, description = ?, status = CASE WHEN ? <= 0 THEN 'Out of Stock' ELSE 'Available' END
                WHERE id = ?
            `, [
                updates.name || '',
                updates.generic_name || '',
                updates.category || 'General',
                updates.company || 'Unknown',
                updates.price || 0,
                updates.stock != null ? updates.stock : 100,
                updates.pack_size || '',
                updates.description || updates.name || '',
                updates.stock != null ? updates.stock : 100,
                id
            ], function (err) {
                if (err) reject(err);
                else resolve();
            });
        });

        await productService.getAllProducts();

        // Invalidate embeddings
        if (await fs.pathExists(VECTORS_FILE)) {
            await fs.remove(VECTORS_FILE);
        }

        const product = productService.products.find(p => String(p.id) === String(id));
        res.json({ success: true, product: product || updates });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * DELETE /api/products/:id
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM medicines WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve();
            });
        });

        await productService.getAllProducts();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
