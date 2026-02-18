# Product Knowledge Enhancement - Testing Guide

## Overview
This guide covers testing the enhanced chatbot with comprehensive product knowledge for 2000+ products, including stock availability, detailed product information, and intelligent question answering.

---

## Setup

### 1. Initialize Product Inventory

```bash
cd server
node scripts/initializeInventory.js
```

**Expected Output:**
```
✅ Successfully initialized: 2136 products
📦 Total in catalog: 2136 products
Stock Status Breakdown:
   IN_STOCK: 2136 products (312,400 units)
```

### 2. Start the Server

```bash
cd server
npm start
```

**Expected:**
- Server running on http://localhost:5000
- Vector embeddings loaded (2136 products)
- Product details loaded from productDetails.json

### 3. Start the Frontend

```bash
npm run dev
```

**Expected:**
- Frontend accessible at http://localhost:5173

---

## Test Cases

### Category 1: Stock Availability Queries

#### Test 1.1: Check Stock for Specific Product
**Query:** "What is the stock of POFEN?"

**Expected Response:**
```
📦 POFEN - Complete Product Information

Basic Details:
• Product Code: [ID]
• Manufacturer: [Company]
• Pack Size: [Size]
• Stock: ✅ In Stock (150 units available)

[Additional product details...]
```

**Verification:**
- ✅ Stock status displayed (In Stock/Low Stock/Out of Stock)
- ✅ Quantity shown
- ✅ Status icon appropriate (✅/⚠️/❌)

#### Test 1.2: Low Stock Product
**Setup:** Manually reduce a product's stock to 8 units

**Query:** "Tell me about [low stock product]"

**Expected:**
```
• Stock: ⚠️ Low Stock (8 units remaining)
```

#### Test 1.3: Out of Stock Product
**Setup:** Set a product's quantity_in_stock to 0

**Query:** "Is [product] available?"

**Expected:**
```
• Stock: ❌ Out of Stock
```

---

### Category 2: Comprehensive Product Information

#### Test 2.1: Full Product Details
**Query:** "Tell me everything about DETTOL ANTISEPTIC LIQUID"

**Expected Response:**
```
📦 DETTOL ANTISEPTIC LIQUID - Complete Product Information

Basic Details:
• Product Code: [ID]
• Manufacturer: Reckitt Benckiser
• Pack Size: [Size]
• Stock: ✅ In Stock ([X] units available)
• Category: Antiseptic
• Prescription Required: ✅ No

Primary Uses & Benefits:
✓ Kills 99.9% of germs and bacteria
✓ Prevents infection in cuts and wounds
✓ Can be used for cleaning surfaces

How to Use:
• Adults: Dilute with water (1:20 ratio)
• When: As needed for wound cleaning
• Duration: Until wound heals

⚠️ Safety Precautions:
• Do not ingest
• Keep out of reach of children
• Avoid contact with eyes

Possible Side Effects:
• Skin irritation in sensitive individuals
• Mild burning sensation (temporary)

Storage:
• Store in a cool, dry place
• Keep bottle tightly closed
```

**Verification:**
- ✅ All sections present
- ✅ Stock information included
- ✅ Formatted clearly with emojis

#### Test 2.2: Product Without Detailed Info
**Query:** "Tell me about [product only in medicines_data.json]"

**Expected:**
```
📦 [PRODUCT NAME]

Basic Details:
• Product Code: [ID]
• Manufacturer: [Company]
• Pack Size: [Size]
• Stock: ✅ In Stock ([X] units available)

For detailed information about [PRODUCT NAME], please contact our pharmacist:
📞 [Phone number]
They can provide complete guidance on usage, dosage, and safety.
```

---

### Category 3: Intelligent Question Answering

#### Test 3.1: Usage Questions
**Query:** "How to use PANADOL?"

**Expected Response:**
```
**How to Use PANADOL:**

👤 **Adults:** 1-2 tablets every 4-6 hours, max 8 tablets daily
👶 **Children:** Consult pediatrician for dosage
⏰ **Timing:** Take with or without food
📅 **Duration:** Do not exceed 3 days without medical advice

⚠️ Important:
• Do not exceed recommended dose
• Avoid alcohol while taking
• Consult doctor if pregnant
```

#### Test 3.2: Side Effects Questions
**Query:** "What are the side effects of AUGMENTIN?"

**Expected Response:**
```
**AUGMENTIN - Possible Side Effects:**

• Nausea or vomiting
• Diarrhea
• Skin rash
• Stomach discomfort

⚕️ **Important:** Most side effects are mild and temporary.
If you experience severe reactions, contact a doctor immediately.

📞 For personalized advice: [Phone]
```

#### Test 3.3: Benefits Questions
**Query:** "What is BRUFEN good for?"

**Expected Response:**
```
**BRUFEN - Uses & Benefits:**

✓ Reduces pain and inflammation
✓ Treats fever
✓ Relieves headaches and muscle aches
✓ Helps with arthritis symptoms

**Category:** Anti-inflammatory
```

#### Test 3.4: Safety Questions
**Query:** "Is CALPOL safe for children?"

**Expected Response:**
```
**CALPOL - Safety & Precautions:**

⚠️ Generally safe for children when used as directed
⚠️ Always follow age-appropriate dosing
⚠️ Do not exceed recommended dose
⚠️ Consult pediatrician for infants under 2 months

**Prescription Required:** No - but follow usage instructions carefully.
```

---

### Category 4: Product Search with Stock Display

#### Test 4.1: Search Multiple Products
**Query:** "Show me antibiotics"

**Expected Response:**
```
I found **45 relevant items** in our pharmaceutical catalog:

1. **AUGMENTIN**
   • Manufacturer: GSK
   • Pack Size: 625mg x 10 tablets
   • Stock: ✅ Available
   • Category: antibiotic
   • Primary Use: Treats bacterial infections

2. **CIZIDIM**
   • Manufacturer: Searle
   • Pack Size: 1gm injection
   • Stock: ⚠️ Low Stock (7 left)
   • Category: antibiotic
   • Primary Use: Serious infections

[... more products ...]

Would you like more details about any of these, or should I help you with the ordering process? 😊
```

**Verification:**
- ✅ Stock status shown for each product
- ✅ Products sorted by relevance
- ✅ Category and primary use displayed

#### Test 4.2: Product Not Found
**Query:** "Do you have aspirin?"

**Expected:**
```
I couldn't find a specific match for "aspirin" in our medicine catalog. However, I can check with our support team for you! Would you like our contact details? 😊
```

---

### Category 5: Order Flow with Stock Validation

#### Test 5.1: Order Available Product
**Conversation Flow:**

1. **User:** "I want to order POFEN"
   **Bot:** 
   ```
   Great! You're interested in **POFEN** from [Company].
   
   📋 **How many would you like to order?**
   Please specify the quantity (e.g., "5 pieces" or "10 packs")
   ```

2. **User:** "5"
   **Bot:**
   ```
   Perfect! I'm adding **5 x POFEN** to your order.
   
   📦 **Product Details:**
   • Manufacturer: [Company]
   • Pack Size: [Size]
   
   Would you like to:
   1️⃣ Add more items?
   2️⃣ Proceed to checkout?
   3️⃣ Cancel this order?
   ```

3. **User:** "proceed"
   **Bot:** `👤 **Great! What's your full name?**`

4. **User:** "Ahmed Khan"
   **Bot:** `📞 **Please share your phone number for delivery confirmation.**`

5. **User:** "03001234567"
   **Bot:**
   ```
   Perfect! 📍 **Please provide your complete delivery address.**
   
   Include:
   • Street/house number
   • Area/locality
   • City
   ```

6. **User:** "House 123, Block A, Sardar Colony, Rahim Yar Khan"
   **Bot:**
   ```
   Excellent! 📧 **Would you like to provide an email for order updates?**
   
   (Optional - type "skip" if you don't want to provide email)
   ```

7. **User:** "ahmed@email.com"
   **Bot:**
   ```
   📋 **Order Summary - Please Confirm**
   
   **Customer Details:**
   • Name: Ahmed Khan
   • Phone: 03001234567
   • Email: ahmed@email.com
   
   **Delivery Address:**
   House 123, Block A, Sardar Colony, Rahim Yar Khan
   City: Rahim Yar Khan
   
   **Order Items:**
   1. **POFEN** x 5
      [Company] • [Pack Size]
   
   **Total Items:** 5
   
   ✅ **Is everything correct?**
   Type 'yes' to confirm and place your order, or 'no' to restart.
   ```

8. **User:** "yes"
   **Bot:**
   ```
   ✅ Stock verified! 150 units available.
   Processing your order... 🔄
   
   [Order submitted with ID: SS-1234567890-ABCD]
   ```

**Verification:**
- ✅ Stock checked before confirmation
- ✅ Order only proceeds if stock available
- ✅ Stock quantity displayed in confirmation

#### Test 5.2: Order Out of Stock Product
**Setup:** Set product stock to 0

**Conversation:**

1. **User:** "I want to order [out of stock product]"
   **Bot:** [Normal order flow starts]

2. **User:** [Complete all steps until confirmation]

3. **User:** "yes" (to confirm order)
   **Bot:**
   ```
   ⚠️ Sorry, **[PRODUCT]** is currently out of stock.
   
   Current availability: 0 units
   
   Would you like to:
   1. Order a different product
   2. Reduce quantity
   3. Get notified when back in stock
   ```

**Verification:**
- ✅ Stock validation happens before order submission
- ✅ User informed of stock status
- ✅ Alternative options provided

#### Test 5.3: Order Quantity Exceeds Stock
**Setup:** Product has 3 units in stock

**Conversation:**

1. **User:** "I want to order 10 pieces of [product]"
2. [Complete order flow]
3. **User:** "yes" (to confirm)
   **Bot:**
   ```
   ⚠️ We only have 3 units of **[PRODUCT]** in stock.
   
   Your requested quantity: 10
   Available: 3
   
   Would you like to order 3 units instead?
   ```

**Verification:**
- ✅ Quantity validation works
- ✅ Alternative quantity suggested
- ✅ Order resets for user to decide

---

### Category 6: Edge Cases

#### Test 6.1: Multiple Products in Search
**Query:** "paracetamol"

**Expected:** List of all paracetamol products with stock status

#### Test 6.2: Product Name Variations
**Query:** "panadol" vs "PANADOL" vs "Panadol Extra"

**Verification:**
- ✅ Case-insensitive search works
- ✅ Partial matches returned
- ✅ Most relevant product first

#### Test 6.3: Typos in Product Names
**Query:** "panado" (typo for panadol)

**Expected:** Should still find PANADOL due to similarity threshold

---

## Performance Benchmarks

### Response Time Targets
- ✅ Product search: < 100ms
- ✅ Stock check: < 50ms
- ✅ Full product details: < 150ms
- ✅ Order flow step: < 100ms

### Vector Search Performance
- ✅ 2136 products indexed
- ✅ Search time: < 50ms
- ✅ Similarity threshold: > 0.45

---

## Manual Verification Checklist

### Stock System
- [ ] All 2136 products initialized in inventory
- [ ] Stock status displays correctly (In Stock/Low Stock/Out of Stock)
- [ ] Low stock threshold triggers at reorder_level (default 10)
- [ ] Out of stock shows when quantity = 0
- [ ] Stock validation prevents orders exceeding availability

### Product Knowledge
- [ ] Products with detailed info show complete details
- [ ] Products without detailed info show basic info + contact message
- [ ] All question types answered correctly (usage, side effects, benefits, safety)
- [ ] Stock information included in all product responses

### Order Flow
- [ ] Stock validated before order confirmation
- [ ] Out of stock products cannot be ordered
- [ ] Quantity exceeding stock is rejected with alternative
- [ ] Order flow completes successfully for available products
- [ ] Stock information displayed in order summary

### Search & Retrieval
- [ ] Vector search returns relevant products
- [ ] Stock status shown in search results
- [ ] Top 10 results displayed with pagination info
- [ ] Case-insensitive search works
- [ ] Partial matches handled correctly

---

## Database Queries for Verification

### Check Total Inventory
```sql
SELECT COUNT(*) as total_products FROM product_inventory;
```
**Expected:** 2136

### Check Stock Distribution
```sql
SELECT status, COUNT(*) as count 
FROM product_inventory 
GROUP BY status;
```
**Expected:**
```
in_stock: ~2100+
low_stock: ~20-30
out_of_stock: 0-5
```

### Check Low Stock Products
```sql
SELECT product_name, quantity_in_stock, status 
FROM product_inventory 
WHERE status = 'low_stock' 
ORDER BY quantity_in_stock ASC 
LIMIT 10;
```

### Find Product by ID
```sql
SELECT * FROM product_inventory WHERE product_id = '[ID]';
```

---

## Troubleshooting

### Issue: Stock always shows default value
**Solution:** Run `node scripts/initializeInventory.js` to populate inventory

### Issue: Products not returning detailed info
**Solution:** Check if productDetails.json is loaded at server startup

### Issue: Vector search not working
**Solution:** Verify embeddings.json exists and is loaded

### Issue: Order flow not validating stock
**Solution:** Check server logs for stock check errors, verify database connection

---

## Success Criteria

✅ **Product Knowledge:**
- All products searchable by name
- Detailed information displayed when available
- Stock status shown for all products
- Question answering works for common queries

✅ **Stock Management:**
- Inventory initialized for all 2000+ products
- Stock status accurate and real-time
- Low stock warnings display correctly
- Out of stock prevents ordering

✅ **Order Flow:**
- Orders validate stock before submission
- Insufficient stock handled gracefully
- Order confirmation includes stock verification
- Users informed of stock status throughout

✅ **Performance:**
- Response times under benchmarks
- Vector search fast and accurate
- Database queries optimized
- No blocking operations

---

## Next Steps After Testing

1. **Monitor stock levels** - Set up alerts for low stock products
2. **Implement stock replenishment** - Auto-reorder system
3. **Add stock history tracking** - Track stock changes over time
4. **Enhance product details** - Add more products to productDetails.json
5. **Implement analytics** - Track popular products, out-of-stock frequency
