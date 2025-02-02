const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser, validateProperty } = require('../middleware/validation');
const auth = require('../middleware/auth');

// User registration
router.post('/register', validateUser, userController.registerUser);

// User login
router.post('/login', userController.loginUser);

// Get user profile
router.get('/profile', auth, userController.getUserProfile);

// Update user profile
router.put('/profile', auth, validateUser, userController.updateUserProfile);

// Add property
router.post('/properties', auth, validateProperty, userController.addProperty);

// Get all properties
router.get('/properties', auth, userController.getUserProperties);

// Delete property
router.delete('/properties/:id', auth, userController.deleteProperty);

module.exports = router;