const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Get user's orders
router.get('/', auth, orderController.getUserOrders);

// Get order by ID
router.get('/:id', auth, orderController.getOrderById);

// Create new order
router.post('/', auth, orderController.createOrder);

// Update order status (admin only)
router.put('/:id', auth, orderController.updateOrderStatus);

module.exports = router;
