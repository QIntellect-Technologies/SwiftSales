const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');

// Create new chat session
router.post('/session', async (req, res) => {
    try {
        const { sessionId, userIp, userAgent } = req.body;
        const id = await dbHelpers.createSession(sessionId, userIp, userAgent);

        // Update analytics
        await dbHelpers.updateAnalytics('total_sessions');

        res.json({ success: true, id, sessionId });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save chat message
router.post('/message', async (req, res) => {
    try {
        const { sessionId, messageId, sender, messageText, messageType, intent } = req.body;
        const id = await dbHelpers.saveMessage(
            sessionId,
            messageId,
            sender,
            messageText,
            messageType,
            intent
        );

        // Update analytics
        await dbHelpers.updateAnalytics('total_messages');

        // Track specific intents
        if (intent === 'emergency_medical') {
            await dbHelpers.updateAnalytics('total_emergencies');
        } else if (intent === 'complaint') {
            await dbHelpers.updateAnalytics('total_complaints');
        }

        res.json({ success: true, id });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save product inquiry
router.post('/product-inquiry', async (req, res) => {
    try {
        const { sessionId, messageId, productName, productId, productCompany, inquiryType } = req.body;
        const id = await dbHelpers.saveProductInquiry(
            sessionId,
            messageId,
            productName,
            productId,
            productCompany,
            inquiryType
        );

        // Update analytics
        await dbHelpers.updateAnalytics('total_product_searches');

        res.json({ success: true, id });
    } catch (error) {
        console.error('Error saving product inquiry:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save user condition
router.post('/condition', async (req, res) => {
    try {
        const { sessionId, conditionType, productsRecommended } = req.body;
        const id = await dbHelpers.saveUserCondition(
            sessionId,
            conditionType,
            productsRecommended
        );

        // Update analytics
        await dbHelpers.updateAnalytics('total_condition_queries');

        res.json({ success: true, id });
    } catch (error) {
        console.error('Error saving condition:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get chat history
router.get('/history/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const messages = await dbHelpers.getChatHistory(sessionId);
        res.json({ success: true, messages });
    } catch (error) {
        console.error('Error getting chat history:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Clear/End session
router.delete('/session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        await dbHelpers.endSession(sessionId);
        res.json({ success: true, message: 'Session ended successfully' });
    } catch (error) {
        console.error('Error ending session:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get analytics
router.get('/analytics', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const analytics = await dbHelpers.getAnalytics(days);
        const topProducts = await dbHelpers.getMostSearchedProducts(10);
        const topConditions = await dbHelpers.getMostCommonConditions(10);

        res.json({
            success: true,
            analytics,
            topProducts,
            topConditions
        });
    } catch (error) {
        console.error('Error getting analytics:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get most searched products
router.get('/top-products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const products = await dbHelpers.getMostSearchedProducts(limit);
        res.json({ success: true, products });
    } catch (error) {
        console.error('Error getting top products:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get most common conditions
router.get('/top-conditions', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const conditions = await dbHelpers.getMostCommonConditions(limit);
        res.json({ success: true, conditions });
    } catch (error) {
        console.error('Error getting top conditions:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
