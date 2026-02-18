
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs-extra');

class ExcelService {
    constructor() {
        this.downloadDir = path.join(__dirname, '../public/downloads');
        fs.ensureDirSync(this.downloadDir);
    }

    /**
     * Generate an Excel file for a list of products
     * @param {Array} products - List of product objects
     * @param {string} title - Title for the file (e.g., "Category_Name")
     * @returns {string} - Relative URL to download the file
     */
    async generateProductList(products, title) {
        try {
            // preparing data for excel
            const data = products.map((p, index) => ({
                '#': index + 1,
                'Name': p.name,
                'Company': p.company,
                'Pack Size': p.pack_size,
                'Price (PKR)': p.price ? parseFloat(p.price).toFixed(2) : 'N/A',
                'Stock': p.stock || 0,
                'Status': p.stock > 0 ? 'Available' : 'Out of Stock'
            }));

            // Create workbook and worksheet
            const wb = xlsx.utils.book_new();
            const ws = xlsx.utils.json_to_sheet(data);

            // Auto-width for columns
            const colWidths = [
                { wch: 5 },  // #
                { wch: 30 }, // Name
                { wch: 20 }, // Company
                { wch: 15 }, // Pack Size
                { wch: 10 }, // Price
                { wch: 8 },  // Stock
                { wch: 12 }  // Status
            ];
            ws['!cols'] = colWidths;

            xlsx.utils.book_append_sheet(wb, ws, "Products");

            // Generate filename
            const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
            const filename = `Product_List_${cleanTitle}_${Date.now()}.xlsx`;
            const filePath = path.join(this.downloadDir, filename);

            // Write to file
            xlsx.writeFile(wb, filePath);
            console.log(`✅ Excel file generated: ${filePath}`);

            return `/downloads/${filename}`;
        } catch (error) {
            console.error('❌ Error generating Excel:', error);
            return null;
        }
    }
}

const excelService = new ExcelService();
module.exports = { excelService };
