const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'name email');
    res.json({ success: true, count: orders.length, orders });
  } catch (err) { next(err); }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) { next(err); }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { customer, items, subtotal, shipping, total, payment } = req.body;
    const order = await Order.create({
      user: req.user?._id,
      customer, items, subtotal,
      shipping: shipping || 0, total,
      payment: payment || {},
    });
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }
    res.status(201).json({ success: true, order });
  } catch (err) { next(err); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber } = req.body;
    const update = { 'fulfillment.status': status };
    if (trackingNumber) update['fulfillment.trackingNumber'] = trackingNumber;
    if (status === 'Shipped')   update['fulfillment.shippedAt'] = new Date();
    if (status === 'Delivered') update['fulfillment.deliveredAt'] = new Date();
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) { next(err); }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) { next(err); }
};
