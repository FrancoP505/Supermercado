const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', auth, authController.logout);

// Get profile (requires authentication)
router.get('/profile', auth, authController.getProfile);

module.exports = router;
