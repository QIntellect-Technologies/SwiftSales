# 🧪 Quick Testing Guide - Conversational Ordering System

## Prerequisites
1. Backend running: `cd server && npm run start`
2. Frontend running: `npm run dev`
3. Embeddings built: `node server/scripts/buildEmbeddings.js` (done ✅)

---

## Test Scenario 1: Simple Order (Happy Path)

**User Input Sequence:**
```
1. "I want 5 POFEN tablets"
2. "proceed" (or "checkout")
3. "Muhammad Ali"
4. "+92 321 1234567"
5. "House 45, Street 12, Model Town, Lahore"
6. "ali@email.com" (or "skip")
7. "yes" (to confirm)
```

**Expected Output:**
- ✅ Order ID generated (format: `SS-XXXXX-XXXXX`)
- ✅ Confirmation message with order details
- ✅ Order saved in database
- ✅ Order items recorded

**Verify:**
```bash
# Check database
cd server
sqlite3 chatbot.db "SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;"
sqlite3 chatbot.db "SELECT * FROM order_items ORDER BY created_at DESC LIMIT 5;"
```

---

## Test Scenario 2: Multi-Item Order

**User Input:**
```
1. "I need 10 CIZIDIM 1GM INJ"
2. "also add 3 POFEN"
3. "also 5 SIDOCAM"
4. "proceed"
5. [Follow name/phone/address/email prompts]
6. "yes"
```

**Expected:**
- ✅ Cart builds with 3 items
- ✅ Summary shows all 3 products
- ✅ Total items count: 18
- ✅ All items in order_items table

---

## Test Scenario 3: Order Cancellation

**User Input:**
```
1. "I want 7 PROXCAM"
2. "cancel"
```

**Expected:**
- ✅ "Order has been cancelled" message
- ✅ No order in database
- ✅ Context cleared
- ✅ Ready for new conversation

---

## Test Scenario 4: Product Not Found → Order Flow

**User Input:**
```
1. "do you have RANDOMMED999"
2. [Bot suggests alternatives]
3. "I want 5 POFEN" (selecting from alternatives)
4. [Continue order flow]
```

**Expected:**
- ✅ RAG finds similar products
- ✅ User can select alternative
- ✅ Order proceeds normally

---

## Test Scenario 5: Context Persistence

**User Input:**
```
1. "I want 10 CIZIDIM"
2. "actually make it 15"
3. "proceed"
4. [Complete order]
```

**Expected:**
- ✅ Quantity updates to 15
- ✅ Order shows correct quantity
- ✅ Context maintained throughout

---

## Test Scenario 6: Validation Errors

**User Input (Invalid Phone):**
```
1. "I want 5 POFEN"
2. "proceed"
3. "John Doe"
4. "invalid" (invalid phone)
```

**Expected:**
- ✅ "I need a valid phone number" error
- ✅ Re-prompts for phone
- ✅ Order flow continues after valid input

**User Input (Short Address):**
```
1. [Get to address step]
2. "abc" (too short)
```

**Expected:**
- ✅ "Please provide a complete delivery address" error
- ✅ Re-prompts for address

---

## Test Scenario 7: API Endpoints

### Create Order Directly
```bash
curl -X POST http://localhost:5000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-123",
    "customerName": "Test User",
    "customerPhone": "+92 321 1234567",
    "customerEmail": "test@email.com",
    "deliveryAddress": "House 1, Street 2, City 3",
    "deliveryCity": "Lahore",
    "orderItems": [
      {
        "productName": "POFEN",
        "productCompany": "Test Company",
        "packSize": "10 tablets",
        "quantity": 5,
        "unitPrice": 0
      }
    ]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "order": {
    "orderId": "SS-XXXXX-XXXXX",
    "totalItems": 5,
    "totalAmount": 0,
    "status": "pending"
  }
}
```

### Get Order
```bash
curl http://localhost:5000/api/orders/SS-XXXXX-XXXXX
```

### Get Session Orders
```bash
curl http://localhost:5000/api/orders/session/test-session-123
```

---

## Database Queries for Verification

```sql
-- Check latest orders
SELECT 
  order_id, 
  customer_name, 
  customer_phone, 
  total_items, 
  status, 
  created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;

-- Check order items for specific order
SELECT 
  product_name, 
  quantity, 
  pack_size 
FROM order_items 
WHERE order_id = 'SS-XXXXX-XXXXX';

-- Count orders by status
SELECT status, COUNT(*) as count 
FROM orders 
GROUP BY status;

-- Today's orders
SELECT COUNT(*) as today_orders 
FROM orders 
WHERE DATE(created_at) = DATE('now');
```

---

## Expected Chatbot Responses

### ✅ Order Started
```
Perfect! I'm adding **5 x POFEN** to your order.

📦 **Product Details:**
• Manufacturer: [Company Name]
• Pack Size: [Pack Size]

Would you like to:
1️⃣ Add more items? (Just tell me what else you need)
2️⃣ Proceed to checkout? (Type "proceed" or "checkout")
3️⃣ Cancel this order? (Type "cancel")
```

### ✅ Order Summary
```
📋 **Order Summary - Please Confirm**

**Customer Details:**
• Name: Muhammad Ali
• Phone: +92 321 1234567
• Email: ali@email.com

**Delivery Address:**
House 45, Street 12, Model Town, Lahore
City: Lahore

**Order Items:**
1. **POFEN** x 5
   Test Company • 10 tablets

**Total Items:** 5

✅ **Is everything correct?**
Type 'yes' to confirm and place your order, or 'no' to restart.
```

### ✅ Order Confirmed
```
✅ **Order Placed Successfully!**

📋 **Order ID:** SS-XXXXX-XXXXX
📦 **Total Items:** 5
📞 **Contact:** +92 321 1234567

**What happens next?**
1️⃣ Our team will confirm your order via phone within 30 minutes
2️⃣ We'll verify product availability and finalize pricing
3️⃣ Your order will be prepared for delivery
4️⃣ Delivery within 24-48 hours

💡 **Pro Tip:** Save your Order ID: **SS-XXXXX-XXXXX** for tracking!

📞 Questions? Call us: +92 321 7780623

Thank you for choosing Swift Sales Healthcare! 🙏
```

---

## Performance Benchmarks

**Expected Timings:**
- Product search: < 100ms
- Order creation: < 200ms
- Full order flow: 2-3 minutes (user-dependent)
- Database query: < 50ms
- Vector search: < 50ms (2K products)

---

## Troubleshooting

### Issue: "embeddings.json not found"
**Solution:**
```bash
node server/scripts/buildEmbeddings.js
```

### Issue: Orders not saving
**Check:**
1. Database file exists: `server/chatbot.db`
2. Database permissions
3. Server logs for SQL errors

### Issue: Context not persisting
**Solution:**
- Verify `updatedContext` in API responses
- Check frontend `setContext()` calls
- Inspect browser console for errors

---

## Success Criteria

✅ User can place multi-item order conversationally  
✅ Order ID generated and returned  
✅ Order saved in database  
✅ Order items recorded correctly  
✅ Customer details captured  
✅ Validation works for all fields  
✅ Context persists between messages  
✅ Cancellation works at any step  
✅ Error messages are clear and helpful  

---

**All tests passing? You're ready for production! 🚀**
