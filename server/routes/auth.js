const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Rate limiting: max 5 login attempts per 15 minutes per IP
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { success: false, message: 'Too many login attempts from this IP, please try again after 15 minutes.' }
});

// POST /api/auth/admin-login
router.post('/admin-login', loginLimiter, (req, res) => {
    const { username, password } = req.body;
    const trimmedUsername = (username || '').trim();
    const trimmedPassword = (password || '').trim();

    // Strictly use environment variables for security. No fallbacks.
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    // Ensure the variables actually exist on the server before comparing
    if (!validUsername || !validPassword) {
        return res.status(500).json({ success: false, message: 'Server configuration error: Admin credentials not set' });
    }

    if (trimmedUsername === validUsername && trimmedPassword === validPassword) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ success: false, message: 'Server configuration error: JWT_SECRET not set' });
        }
        const token = jwt.sign({ username: trimmedUsername }, secret, { expiresIn: '8h' });
        
        return res.json({ success: true, token });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

module.exports = router;
