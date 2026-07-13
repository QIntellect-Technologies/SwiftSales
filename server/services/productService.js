
const fs   = require('fs-extra');
const path = require('path');
const { db } = require('../database');

class ProductService {
    constructor() {
        this.products = [];
        this.lastSync = null;
    }

    /**
     * Fetch all active medicines from SQLite
     */
    getAllProducts() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM medicines', [], (err, rows) => {
                if (err) {
                    console.error('❌ Error in getAllProducts SQLite:', err.message);
                    return resolve([]); // return empty to avoid crashes
                }

                this.products = rows.map(item => ({
                    id: item.id,
                    name: item.name,
                    company: item.company || 'Unknown',
                    pack_size: item.pack_size || 'Standard',
                    price: item.price || 0,
                    stock: (item.stock != null && item.stock !== '') ? Number(item.stock) : 100,
                    status: item.status || 'Available',
                    generic_name: item.generic_name || '',
                    description: item.description || item.name || '',
                    original_data: item
                }));

                this.lastSync = new Date();
                resolve(this.products);
            });
        });
    }



    /**
     * Get real-time details
     */
    async getRealTimeDetails(productIds) {
        if (!productIds || productIds.length === 0) return [];

        // If we have products in memory, use them (Simulating real-time for local)
        if (this.products.length > 0) {
            return this.products
                .filter(p => productIds.includes(p.id))
                .map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    stock: p.stock,
                    status: p.status,
                    company: p.company,
                    pack_size: p.pack_size
                }));
        }

        return [];
    }

    getAllCategories() {
        if (this.products.length === 0) return { categories: [], companies: [] };
        
        const categories = new Set();
        const companies = new Set();

        this.products.forEach(p => {
            if (p.original_data.category) categories.add(p.original_data.category);
            if (p.company && p.company !== 'Unknown') companies.add(p.company);
        });

        return {
            categories: Array.from(categories).sort(),
            companies: Array.from(companies).sort()
        };
    }

    getProductsByFilter(filterType, filterValue) {
        if (!filterValue) return [];
        const lowerValue = filterValue.toLowerCase();

        return this.products.filter(p => {
            if (filterType === 'category') {
                return p.original_data.category && p.original_data.category.toLowerCase() === lowerValue;
            } else if (filterType === 'company') {
                return p.company.toLowerCase() === lowerValue;
            }
            return false;
        });
    }

    levenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    async searchProducts(query, forceReload = false) {
        const CACHE_TTL = 300 * 1000;
        const isStale = this.lastSync && (new Date() - this.lastSync > CACHE_TTL);

        if (!this.products.length || forceReload || isStale) {
            await this.getAllProducts();
        }

        if (!query) return { products: [] };
        const lowerQuery = query.toLowerCase().trim();

        // ── Tier 1: Exact substring match ──────────────────────────────────
        let matches = this.products.filter(p => {
            const name = p.name.toLowerCase();
            // Full match in either direction
            if (name.includes(lowerQuery) || lowerQuery.includes(name)) return true;
            // First-word (brand) present in query  e.g. 'AEROMAX' inside 'buy aeromax'
            const firstWord = name.split(/\s+/)[0];
            if (firstWord.length > 2 && lowerQuery.includes(firstWord)) return true;
            return false;
        });

        // ── Tier 2: Fuzzy on brand name only (Levenshtein) ─────────────────
        // Only kicks in when nothing matched at all, avoiding false positives
        // caused by numbers (e.g. '30' matching 'ISOCEF 30ML').
        if (matches.length === 0 && lowerQuery.length >= 3) {
            const queryFirstWord = lowerQuery.split(/\s+/)[0];
            matches = this.products.filter(p => {
                const pFirstWord = p.name.toLowerCase().split(/\s+/)[0];
                if (pFirstWord.length < 3) return false;
                const distance = this.levenshteinDistance(queryFirstWord, pFirstWord);
                // Allow at most 2 edits (catches 'aeromex' → 'aeromax', 'mepcid' typos)
                return distance <= 2;
            });
            if (matches.length > 0) {
                console.log(`[FUZZY] Brand-name fuzzy fallback matched ${matches.length} product(s) for "${lowerQuery}"`);
            }
        }

        // ── Scoring ────────────────────────────────────────────────────────
        // Rank: exact name > exact start > full-name contains query > first-word match
        matches.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            const score = (name) => {
                if (name === lowerQuery) return 0;
                if (name.startsWith(lowerQuery)) return 1;
                if (lowerQuery.includes(name)) return 2;   // full product name inside query
                if (name.includes(lowerQuery)) return 3;
                return 4;                                   // first-word fuzzy match
            };
            return score(aName) - score(bName);
        });

        return {
            products: matches.slice(0, 10).map(p => ({
                metadata: {
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    stock: p.stock,
                    status: p.status,
                    company: p.company,
                    pack_size: p.pack_size,
                    generic_name: p.generic_name
                }
            }))
        };
    }

    async updateProductStock(productId, quantity, operation = 'subtract') {
        return new Promise((resolve, reject) => {
            // Update in-memory cache first
            const product = this.products.find(p => String(p.id) === String(productId));
            if (product) {
                if (operation === 'subtract') {
                    product.stock = Math.max(0, product.stock - quantity);
                } else if (operation === 'add') {
                    product.stock += quantity;
                }
                product.status = product.stock === 0 ? 'Out of Stock' : 'Available';
                product.original_data.stock = product.stock;
                product.original_data.status = product.status;
            }

            // Update SQLite DB
            const sql = operation === 'subtract'
                ? `UPDATE medicines SET stock = MAX(0, stock - ?), status = CASE WHEN (stock - ?) <= 0 THEN 'Out of Stock' ELSE 'Available' END WHERE id = ?`
                : `UPDATE medicines SET stock = stock + ?, status = 'Available' WHERE id = ?`;

            const params = operation === 'subtract'
                ? [quantity, quantity, productId]
                : [quantity, productId];

            db.run(sql, params, function (err) {
                if (err) {
                    console.error('❌ Failed to update stock in SQLite:', err.message);
                    resolve(false);
                } else {
                    console.log(`✅ Updated stock for product ${productId} in SQLite medicines table`);
                    resolve(true);
                }
            });
        });
    }
}

const productService = new ProductService();
module.exports = { productService };
