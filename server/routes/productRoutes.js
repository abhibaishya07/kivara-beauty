const express = require('express');
const router = express.Router();
const {
  getProducts, getProductBySlug, createProduct, updateProduct,
  deleteProduct, getAllProductsAdmin
} = require('../controllers/productController');
const adminAuth = require('../middleware/adminAuth');
const protect = require('../middleware/protect');
const { createReview, getProductReviews } = require('../controllers/reviewController');

router.get('/', getProducts);
router.get('/admin/all', adminAuth, getAllProductsAdmin);
router.get('/:slug', getProductBySlug);
router.post('/', adminAuth, createProduct);
router.put('/:id', adminAuth, updateProduct);
router.delete('/:id', adminAuth, deleteProduct);

// Reviews
router.route('/:id/reviews')
  .get(getProductReviews)
  .post(protect, createReview);

module.exports = router;
