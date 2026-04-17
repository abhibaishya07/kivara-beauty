const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:              { type: String, required: true, trim: true },
  slug:              { type: String, required: true, unique: true, lowercase: true },
  description:       { type: String, required: true },
  price:             { type: Number, required: true, min: 0 },
  comparePrice:      { type: Number },
  images:            [{ type: String }],
  category:          {
    type: String,
    enum: ['Lips', 'Eyes', 'Face', 'Skincare', 'Hair Care', 'Fragrance', 'Nails', 'Tools'],
    required: true,
  },
  brand:             { type: String },
  stock:             { type: Number, required: true, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  isFeatured:        { type: Boolean, default: false },
  isActive:          { type: Boolean, default: true },
  tags:              [String],
  rating:            { type: Number, default: 0 },
  numReviews:        { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
