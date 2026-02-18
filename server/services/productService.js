
const { supabase } = require('./supabase');

class ProductService {
    constructor() {
        this.products = [];
        this.lastSync = null;
    }

    /**
     * Fetch all active medicines from Supabase
     * Used for initializing the Vector Index
     */
    async getAllProducts() {
        try {
            console.log('🔄 Fetching all products from Supabase...');

            const { data, error } = await supabase
                .from('medicines')
                .select('*')
                .eq('status', 'Available');

            if (error) throw error;

            console.log(`✅ Fetched ${data.length} active medicines from DB.`);

            // Normalize data to match chatbot's expected format
            this.products = data.map(item => ({
                id: item.id,
                name: item.name,
                company: item.manufacturer || 'Unknown', // Map manufacturer -> company
                pack_size: !isNaN(parseFloat(item.package_size))
                    ? parseFloat(item.package_size).toFixed(0) + (item.package_size_unit || '') // round number + unit if exists
                    : item.package_size || 'Standard',
                price: item.price,
                stock: item.stock,
                generic_name: item.generic_name,
                description: item.description,
                original_data: item
            }));

            this.lastSync = new Date();
            return this.products;
        } catch (error) {
            console.error('❌ Error fetching products from Supabase:', error.message);
            return [];
        }
    }

    /**
     * Get real-time details for specific products
     * Used during RAG generation to get latest Price/Stock
     * @param {Array<string>} productIds - List of UUIDs or Names
     */
    async getRealTimeDetails(productIds) {
        if (!productIds || productIds.length === 0) return [];

        try {
            // If IDs are UUIDs, query by ID. If names, query by name.
            // Our vector search returns 'metadata' which has the specific ID from the index.
            // So we should expect UUIDs if the index was built from DB data.

            const { data, error } = await supabase
                .from('medicines')
                .select('id, name, price, stock, status, manufacturer, package_size')
                .in('id', productIds);

            if (error) throw error;

            // Map to friendly format
            return data.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                stock: item.stock,
                status: item.status,
                company: item.manufacturer,
                pack_size: item.package_size
            }));

        } catch (error) {
            console.error('❌ Error fetching real-time details:', error.message);
            return [];
        }
    }
    /**
     * Get all unique categories from products
     */
    getAllCategories() {
        if (this.products.length === 0) return { categories: [], companies: [] };

        // Extract unique categories (e.g. from 'category' field in metadata, or derive from existing data)
        // Note: Our current normalized product object has: id, name, company, pack_size, price, stock, generic_name, description
        // It seems 'category' might be missing in normalization, let's check original_data or infer.
        // The user mentioned "Fetch all available categories dynamically from the dashboard".
        // Let's assume 'category' exists in DB or we use 'manufacturer' as a proxy if category is missing/sparse.
        // Actually, let's look at the raw data again.

        // For now, let's return unique manufacturers as "Companies" and unique categories if available.
        const categories = new Set();
        const companies = new Set();

        this.products.forEach(p => {
            if (p.original_data.category) categories.add(p.original_data.category); // Assuming column exists
            if (p.company && p.company !== 'Unknown') companies.add(p.company);
        });

        return {
            categories: Array.from(categories).sort(),
            companies: Array.from(companies).sort()
        };
    }

    /**
     * Get products filtered by category or company
     */
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

    /**
     * Helper: Calculate Levenshtein Distance for fuzzy matching
     */
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

    /**
     * Search products by name (Local Memory Search with Fuzzy Fallback)
     * @param {string} query - The search term
     * @param {boolean} forceReload - Whether to refresh from Supabase first
     */
    async searchProducts(query, forceReload = false) {
        // AUTO-REFRESH: If cache is empty or older than 30 seconds, reload.
        const CACHE_TTL = 30 * 1000; // 30 seconds
        const isStale = this.lastSync && (new Date() - this.lastSync > CACHE_TTL);

        if (!this.products.length || forceReload || isStale) {
            if (isStale) console.log(`[SYNC] Cache is stale (${Math.floor((new Date() - this.lastSync) / 1000)}s old). Refreshing...`);
            await this.getAllProducts();
        }

        if (!query) return { products: [] };
        console.log(`[SEARCH] Query: "${query}", Products in memory: ${this.products.length}`);
        const lowerQuery = query.toLowerCase().trim();

        // 1. PRIMRY SEARCH: Exact or Contains
        let matches = this.products.filter(p => {
            const name = p.name.toLowerCase();
            return name.includes(lowerQuery) || lowerQuery.includes(name);
        });

        // 2. SECONDARY SEARCH: Fuzzy matching if no primary matches found
        if (matches.length === 0 && lowerQuery.length >= 3) {
            console.log(`[FUZZY SEARCH] No exact match for "${lowerQuery}", trying fuzzy...`);
            matches = this.products.filter(p => {
                const pName = p.name.toLowerCase();
                const distance = this.levenshteinDistance(lowerQuery, pName);

                // Threshold: If query is long, allow more distance. 
                // Approx 30% error allowed
                const threshold = Math.max(2, Math.floor(lowerQuery.length * 0.3));
                return distance <= threshold;
            });

            if (matches.length > 0) {
                console.log(`[FUZZY SEARCH] Found ${matches.length} potential matches.`);
            }
        }

        // Sort: Exact matches first, then starts with, then includes
        matches.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            if (aName === lowerQuery) return -1;
            if (bName === lowerQuery) return 1;
            if (aName.startsWith(lowerQuery) && !bName.startsWith(lowerQuery)) return -1;
            if (bName.startsWith(lowerQuery) && !aName.startsWith(lowerQuery)) return 1;
            return 0;
        });

        // Wrap in metadata structure
        return {
            products: matches.map(p => ({
                metadata: {
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    stock: p.stock,
                    company: p.company,
                    pack_size: p.pack_size
                }
            }))
        };
    }
}

const productService = new ProductService();
module.exports = { productService };
