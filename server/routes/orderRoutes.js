const express = require('express');
const router = express.Router();
const { getOrders, getOrder, createOrder, updateOrderStatus, getMyOrders } = require('../controllers/orderController');
const protect = require('../middleware/protect');
const adminAuth = require('../middleware/adminAuth');
const optionalAuth = require('../middleware/optionalAuth');

router.get('/', adminAuth, getOrders);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', adminAuth, getOrder);
router.post('/', optionalAuth, createOrder);
router.patch('/:id/status', adminAuth, updateOrderStatus);

module.exports = router;
