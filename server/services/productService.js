
const fs   = require('fs-extra');
const path = require('path');
const { supabase } = require('./supabase');
const { MEDICINES_FILE } = require('../paths');

class ProductService {
    constructor() {
        this.products = [];
        this.lastSync = null;
        // Use Railway-aware path from paths.js (respects DATA_PATH env var)
        this.localDataPath = MEDICINES_FILE;
    }

    /**
     * Fetch all active medicines
     * Defaults to LOCAL JSON if Supabase is unavailable
     */
    async getAllProducts() {
        try {
            // Try Supabase first if available
            if (supabase && process.env.VITE_SUPABASE_URL) {
                console.log('🔄 Attempting to fetch products from Supabase...');
                const { data, error } = await supabase
                    .from('medicines')
                    .select('*')
                    .eq('status', 'Available');

                if (!error && data && data.length > 0) {
                    console.log(`✅ Fetched ${data.length} medicines from Supabase.`);
                    return this.normalizeSupabaseData(data);
                }
            }

            // Fallback to Local JSON
            console.log('📦 Loading products from local JSON database...');
            if (await fs.pathExists(this.localDataPath)) {
                const localData = await fs.readJson(this.localDataPath);
                console.log(`✅ Loaded ${localData.length} medicines from local storage.`);
                
                this.products = localData.map(item => ({
                    id: item.id || item.item_id,
                    name: item.name || item.description,
                    company: item.company || 'Unknown',
                    pack_size: item.pack_size || 'Standard',
                    price: item.price || 0,
                    stock: item.stock || 100,
                    status: item.status || 'Available', // Read actual status from file, not hardcoded
                    generic_name: item.generic_name || '',
                    description: item.description || item.name || '',
                    original_data: item
                }));

                this.lastSync = new Date();
                return this.products;
            } else {
                console.warn('⚠️ Local medicines.json not found!');
                return [];
            }
        } catch (error) {
            console.error('❌ Error in getAllProducts:', error.message);
            return [];
        }
    }

    normalizeSupabaseData(data) {
        this.products = data.map(item => ({
            id: item.id,
            name: item.name,
            company: item.manufacturer || 'Unknown',
            pack_size: item.package_size || 'Standard',
            price: item.price,
            stock: item.stock,
            status: item.status,
            generic_name: item.generic_name,
            description: item.description,
            original_data: item
        }));
        this.lastSync = new Date();
        return this.products;
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
        const CACHE_TTL = 300 * 1000; // Increase to 5 mins for local
        const isStale = this.lastSync && (new Date() - this.lastSync > CACHE_TTL);

        if (!this.products.length || forceReload || isStale) {
            await this.getAllProducts();
        }

        if (!query) return { products: [] };
        const lowerQuery = query.toLowerCase().trim();

        let matches = this.products.filter(p => {
            const name = p.name.toLowerCase();
            return name.includes(lowerQuery) || lowerQuery.includes(name);
        });

        if (matches.length === 0 && lowerQuery.length >= 3) {
            matches = this.products.filter(p => {
                const pName = p.name.toLowerCase();
                const distance = this.levenshteinDistance(lowerQuery, pName);
                const threshold = Math.max(2, Math.floor(lowerQuery.length * 0.3));
                return distance <= threshold;
            });
        }

        matches.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            if (aName === lowerQuery) return -1;
            if (bName === lowerQuery) return 1;
            if (aName.startsWith(lowerQuery)) return -1;
            if (bName.startsWith(lowerQuery)) return 1;
            return 0;
        });

        return {
            products: matches.slice(0, 10).map(p => ({
                metadata: {
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    stock: p.stock,
                    status: p.status,  // Always include status so all callers can check it
                    company: p.company,
                    pack_size: p.pack_size,
                    generic_name: p.generic_name
                }
            }))
        };
    }

    async updateProductStock(productId, quantity, operation = 'subtract') {
        try {
            // Update in-memory
            const product = this.products.find(p => p.id === productId);
            if (product) {
                if (operation === 'subtract') {
                    product.stock = Math.max(0, product.stock - quantity);
                } else if (operation === 'add') {
                    product.stock += quantity;
                }
                if (product.stock === 0) {
                    product.status = 'Out of Stock';
                }
                product.original_data.stock = product.stock;
                product.original_data.status = product.status;
            }

            // Update JSON file
            if (await fs.pathExists(this.localDataPath)) {
                let localData = await fs.readJson(this.localDataPath);
                let updated = false;
                for (let item of localData) {
                    const itemId = item.id || item.item_id;
                    if (itemId === productId) {
                        if (operation === 'subtract') {
                            item.stock = Math.max(0, (item.stock || 0) - quantity);
                        } else if (operation === 'add') {
                            item.stock = (item.stock || 0) + quantity;
                        }
                        if (item.stock === 0) {
                            item.status = 'Out of Stock';
                        }
                        updated = true;
                        break;
                    }
                }
                if (updated) {
                    await fs.writeJson(this.localDataPath, localData, { spaces: 2 });
                    console.log(`✅ Updated stock for product ${productId} in medicines.json`);
                }
            }
        } catch (err) {
            console.error('❌ Failed to update stock in medicines.json:', err.message);
        }
    }
}

const productService = new ProductService();
module.exports = { productService };
