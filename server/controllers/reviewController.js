const Review = require('../models/Review');
const Order = require('../models/Order');

exports.createReview = async (req, res, next) => {
  try {
    const { rating, reviewText } = req.body;
    const productId = req.params.id;

    // Validation
    if (!rating || !reviewText) {
      return res.status(400).json({ success: false, message: 'Rating and review text are required' });
    }

    // Check if the user has already reviewed this product
    const existingReview = await Review.findOne({ product: productId, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    // Verify the user actually ordered this product, and that the order is 'Delivered'
    const orders = await Order.find({ user: req.user._id });
    let hasDeliveredProduct = false;

    for (const order of orders) {
      if (order.fulfillment?.status === 'Delivered') {
        const itemExists = order.items.some(item => item.product.toString() === productId);
        if (itemExists) {
          hasDeliveredProduct = true;
          break;
        }
      }
    }

    if (!hasDeliveredProduct) {
      return res.status(403).json({ success: false, message: 'You can only review products that have been delivered to you' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      customerName: req.user.name,
      rating: Number(rating),
      reviewText
    });

    res.status(201).json({ success: true, message: 'Review successfully added!', review });
  } catch (err) {
    next(err);
  }
};

exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.id, flaggedForReview: false })
      .sort({ createdAt: -1 })
      .select('customerName rating reviewText createdAt');

    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    next(err);
  }
};
