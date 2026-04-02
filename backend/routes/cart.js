const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

// Get user's cart
router.get('/', auth, cartController.getCart);

// Add item to cart
router.post('/items', auth, cartController.addItem);

// Update cart item
router.put('/items/:id', auth, cartController.updateItem);

// Remove item from cart
router.delete('/items/:id', auth, cartController.removeItem);

module.exports = router;
