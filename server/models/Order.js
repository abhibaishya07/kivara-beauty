const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     String,
  price:    Number,
  quantity: { type: Number, required: true, min: 1 },
  image:    String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customer: {
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    phone:   String,
    address: { line1: String, city: String, state: String, pincode: String },
  },
  items:    [itemSchema],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  total:    { type: Number, required: true },
  payment: {
    method:            { type: String, default: 'razorpay' },
    razorpayOrderId:   String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status:            { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  },
  fulfillment: {
    status:         { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    trackingNumber: String,
    shippedAt:      Date,
    deliveredAt:    Date,
  },
}, { timestamps: true });

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const d = new Date();
    const part = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `LB-${part}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
