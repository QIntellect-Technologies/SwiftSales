// Ordering Service - Mirrors WhatsApp bot logic for website
class OrderingService {
    constructor(medicinesData) {
        this.medicines = medicinesData;
    }

    /**
     * Parse "add X product_name" or "X product_name" patterns
     * Examples: "add 10 ACTRAC SOFT CAP", "89 ACULEAF COUGH SYP"
     */
    parseAddCommand(text) {
        const patterns = [
            /add\s+(\d+)\s+(.+)/i,  // "add 10 ACTRAC"
            /(\d+)\s+(.+)/,          // "10 ACTRAC"
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return {
                    quantity: parseInt(match[1]),
                    productName: match[2].trim().toUpperCase()
                };
            }
        }
        return null;
    }

    /**
     * Find product in medicines database
     */
    findProduct(productName) {
        // Exact match first
        let product = this.medicines.find(m => 
            m.medicine_name?.toUpperCase() === productName ||
            m.name?.toUpperCase() === productName
        );

        // Partial match if no exact match
        if (!product) {
            product = this.medicines.find(m => 
                productName.includes(m.medicine_name?.toUpperCase() || m.name?.toUpperCase() || '')
            );
        }

        return product;
    }

    /**
     * Add item to cart and return updated cart
     */
    addToCart(currentCart, product, quantity) {
        const price = product.price || product.unit_price || 100; // Default price
        const existingItem = currentCart.find(item => 
            item.productName === (product.medicine_name || product.name)
        );

        if (existingItem) {
            // Update quantity if already in cart
            existingItem.quantity += quantity;
            existingItem.totalPrice = existingItem.quantity * price;
        } else {
            // Add new item
            currentCart.push({
                productId: product.id || product.product_id,
                productName: product.medicine_name || product.name,
                quantity,
                unitPrice: price,
                totalPrice: quantity * price,
                company: product.company || 'Unknown'
            });
        }

        return currentCart;
    }

    /**
     * Calculate cart totals
     */
    calculateTotals(cart) {
        return cart.reduce((total, item) => total + item.totalPrice, 0);
    }

    /**
     * Format cart display for user
     */
    formatCartDisplay(cart) {
        let display = '**Your current cart:**\n';
        cart.forEach((item, idx) => {
            display += `${idx + 1}. ${item.productName} - ${item.quantity} units (Total: Rs.${item.totalPrice})\n`;
        });
        const total = this.calculateTotals(cart);
        display += `\n**Total: Rs.${total}**`;
        return display;
    }

    /**
     * Load customer from localStorage (simulated)
     */
    getStoredCustomer() {
        // In real implementation, this would come from localStorage
        return {
            name: null,
            phone: null,
            address: null
        };
    }

    /**
     * Parse customer details from text like "Imran Khalid\n03006782867\nStreet No 4..."
     */
    parseCustomerDetails(text) {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length >= 3) {
            return {
                name: lines[0],
                phone: lines[1],
                address: lines.slice(2).join(', ')
            };
        }
        return null;
    }

    /**
     * Generate order summary
     */
    formatOrderSummary(cart, customer) {
        let summary = '**Order Summary:**\n\n';
        summary += `**Customer Name:** ${customer.name}\n`;
        summary += `**Phone:** ${customer.phone}\n`;
        summary += `**Delivery Address:** ${customer.address}\n\n`;
        summary += '**Items:**\n';
        
        cart.forEach((item, idx) => {
            summary += `${idx + 1}. ${item.productName} (${item.quantity} units) = Rs.${item.totalPrice}\n`;
        });

        const total = this.calculateTotals(cart);
        summary += `\n**Total Cost: Rs.${total}**`;
        return summary;
    }
}

module.exports = { OrderingService };
