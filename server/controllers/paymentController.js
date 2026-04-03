const Razorpay = require('razorpay');
const crypto = require('crypto');

exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });
    res.json({ success: true, order });
  } catch (err) { next(err); }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated = hmac.digest('hex');
    if (generated !== razorpay_signature)
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    res.json({ success: true, message: 'Payment verified' });
  } catch (err) { next(err); }
};
