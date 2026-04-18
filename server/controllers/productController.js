const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (err) { next(err); }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) { next(err); }
};

exports.getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (err) { next(err); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const base = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${base}-${Date.now()}`;
    const product = await Product.create({ ...req.body, slug });
    res.status(201).json({ success: true, product });
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deactivated' });
  } catch (err) { next(err); }
};
