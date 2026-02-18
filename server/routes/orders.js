const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');

// Generate unique order ID
const generateOrderId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `SS-${timestamp}-${random}`;
};

// Create new order
router.post('/create', async (req, res) => {
    try {
        const {
            sessionId,
            customerName,
            customerPhone,
            customerEmail,
            deliveryAddress,
            deliveryCity,
            deliveryArea,
            orderItems,
            orderNotes
        } = req.body;

        // Validation
        if (!sessionId || !customerPhone || !deliveryAddress || !orderItems || orderItems.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: sessionId, customerPhone, deliveryAddress, orderItems'
            });
        }

        // Generate order ID
        const orderId = generateOrderId();

        // Calculate totals
        const totalItems = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const totalAmount = orderItems.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0);

        // Create order
        const orderData = {
            orderId,
            sessionId,
            customerName: customerName || 'Guest',
            customerPhone,
            customerEmail: customerEmail || null,
            deliveryAddress,
            deliveryCity: deliveryCity || 'Not specified',
            deliveryArea: deliveryArea || 'Not specified',
            orderItems,
            totalItems,
            totalAmount,
            orderNotes: orderNotes || null
        };

        const result = await dbHelpers.createOrder(orderData);

        // Save each order item
        for (const item of orderItems) {
            await dbHelpers.addOrderItem({
                orderId,
                productName: item.productName,
                productId: item.productId || null,
                productCompany: item.productCompany || 'Unknown',
                packSize: item.packSize || 'Standard',
                quantity: item.quantity,
                unitPrice: item.unitPrice || 0,
                subtotal: (item.quantity || 0) * (item.unitPrice || 0)
            });
        }

        // Decrement inventory for each item (best-effort)
        try {
            for (const item of orderItems) {
                if (item.productId) {
                    await dbHelpers.updateProductStock(item.productId, item.quantity || 0, 'subtract');
                }
            }
        } catch (err) {
            console.warn('Warning: Failed to update inventory for order', orderId, err.message || err);
        }

        // Update analytics
        await dbHelpers.updateAnalytics('total_orders');
        await dbHelpers.updateAnalytics('total_order_items', { count: totalItems });

        res.json({
            success: true,
            order: {
                orderId,
                totalItems,
                totalAmount,
                status: 'pending',
                message: 'Order created successfully!'
            }
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await dbHelpers.getOrder(orderId);
        const items = await dbHelpers.getOrderItems(orderId);

        res.json({
            success: true,
            order: {
                ...order,
                items
            }
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
});

// Get orders by session
router.get('/session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const orders = await dbHelpers.getSessionOrders(sessionId);

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error fetching session orders:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Update order status
router.patch('/:orderId/status', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        await dbHelpers.updateOrderStatus(orderId, status);

        res.json({
            success: true,
            message: `Order ${orderId} status updated to ${status}`
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get all orders with filters
router.get('/', async (req, res) => {
    try {
        const { status, startDate, endDate, limit } = req.query;

        const filters = {
            status: status || null,
            startDate: startDate || null,
            endDate: endDate || null,
            limit: limit ? parseInt(limit) : 100
        };

        const orders = await dbHelpers.getAllOrders(filters);

        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Cancel order
router.delete('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        await dbHelpers.updateOrderStatus(orderId, 'cancelled');

        res.json({
            success: true,
            message: `Order ${orderId} has been cancelled`
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
