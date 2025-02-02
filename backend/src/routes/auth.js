// This file contains routes for authentication-related operations.

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignUp, validateLogin } = require('../middleware/validation');

// Debug route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

// Registration route - support both /register and /signup
router.post(['/register', '/signup'], async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;
    const result = await authController.signUp(name, email, password);
    res.json(result);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;
    const result = await authController.login(email, password);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: error.message || 'Authentication failed' });
  }
});

module.exports = router;