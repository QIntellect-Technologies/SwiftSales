const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ success: false, message: 'Server configuration error: JWT_SECRET not set' });
        }
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // add user payload to request
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
};

module.exports = authMiddleware;
