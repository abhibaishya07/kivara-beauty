const Product = require('../models/Product');

exports.getInventory = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .select('name category price stock lowStockThreshold isActive images brand')
      .sort({ stock: 1 });
    const inventory = products.map(p => ({
      ...p.toObject(),
      stockStatus: p.stock === 0 ? 'out-of-stock'
        : p.stock <= p.lowStockThreshold ? 'low' : 'in-stock',
    }));
    res.json({ success: true, inventory });
  } catch (err) { next(err); }
};

exports.updateStock = async (req, res, next) => {
  try {
    const { operation, quantity } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let newStock;
    if (operation === 'set')       newStock = Number(quantity);
    else if (operation === 'add')  newStock = product.stock + Number(quantity);
    else if (operation === 'sub')  newStock = Math.max(0, product.stock - Number(quantity));
    else return res.status(400).json({ success: false, message: 'Invalid operation. Use set, add, or sub' });

    product.stock = newStock;
    await product.save();
    res.json({
      success: true,
      product: {
        _id: product._id, name: product.name, stock: product.stock,
        stockStatus: product.stock === 0 ? 'out-of-stock'
          : product.stock <= product.lowStockThreshold ? 'low' : 'in-stock',
      },
    });
  } catch (err) { next(err); }
};
