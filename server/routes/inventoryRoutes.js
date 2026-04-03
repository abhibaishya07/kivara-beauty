const express = require('express');
const router = express.Router();
const { getInventory, updateStock } = require('../controllers/inventoryController');
const adminAuth = require('../middleware/adminAuth');

router.get('/', adminAuth, getInventory);
router.patch('/:id/stock', adminAuth, updateStock);

module.exports = router;
