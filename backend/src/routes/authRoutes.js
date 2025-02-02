const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        // TODO: Replace with actual database validation
        if (email === 'admin@example.com' && password === 'admin123') {
            const token = jwt.sign(
                { id: 1, email, role: 'admin' },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );
            
            return res.json({
                success: true,
                token,
                user: { id: 1, email, role: 'admin' }
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

router.post('/logout', (req, res) => {
    res.json({ success: true });
});

module.exports = router;
