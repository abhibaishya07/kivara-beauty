const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  {
    name: 'Velvet Matte Lip Color',
    slug: 'velvet-matte-lip-color',
    description: 'A long-lasting matte lipstick with a lush velvet finish. Delivers opaque color in a single stroke. Infused with vitamin E for all-day comfort.',
    price: 1299, comparePrice: 1799,
    images: ['https://images.unsplash.com/photo-1586495777744-977b0dc3fd2a?auto=format&fit=crop&w=800&q=80'],
    category: 'Lips', brand: 'Lumière', stock: 45, lowStockThreshold: 10, isFeatured: true,
    tags: ['lipstick', 'matte', 'bestseller'],
  },
  {
    name: 'Silk Foundation SPF 20',
    slug: 'silk-foundation-spf-20',
    description: 'A buildable, medium-to-full coverage foundation with a natural satin finish. Blurs imperfections and stays fresh for 24 hours.',
    price: 2499, comparePrice: 2999,
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'],
    category: 'Face', brand: 'Lumière', stock: 30, lowStockThreshold: 8, isFeatured: true,
    tags: ['foundation', 'spf', 'coverage'],
  },
  {
    name: 'Smoky Eye Palette',
    slug: 'smoky-eye-palette',
    description: '12 richly pigmented eyeshadows ranging from champagne nudes to deep espressos. Velvety texture for effortless blending.',
    price: 3199, comparePrice: 3999,
    images: ['https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?auto=format&fit=crop&w=800&q=80'],
    category: 'Eyes', brand: 'Lumière', stock: 25, lowStockThreshold: 6, isFeatured: true,
    tags: ['eyeshadow', 'palette', 'smoky'],
  },
  {
    name: 'Volume Surge Mascara',
    slug: 'volume-surge-mascara',
    description: 'Volumizing mascara with a precision brush that coats every lash from root to tip. Waterproof formula lasts all day.',
    price: 999, comparePrice: 1299,
    images: ['https://images.unsplash.com/photo-1631214503851-9e56a22693f0?auto=format&fit=crop&w=800&q=80'],
    category: 'Eyes', brand: 'Lumière', stock: 60, lowStockThreshold: 15, isFeatured: false,
    tags: ['mascara', 'volume', 'waterproof'],
  },
  {
    name: 'Rose Gold Highlighter',
    slug: 'rose-gold-highlighter',
    description: 'A finely-milled powder highlighter that imparts a luminous rose gold gleam. Buildable from subtle to blinding.',
    price: 1799,
    images: ['https://images.unsplash.com/photo-1599232197723-dfd982dcb0a6?auto=format&fit=crop&w=800&q=80'],
    category: 'Face', brand: 'Lumière', stock: 20, lowStockThreshold: 5, isFeatured: true,
    tags: ['highlighter', 'glow', 'rose gold'],
  },
  {
    name: 'Hyaluronic Glow Serum',
    slug: 'hyaluronic-glow-serum',
    description: 'Concentrated serum with 2% hyaluronic acid complex and niacinamide. Plumps, hydrates, and visibly diminishes fine lines in 4 weeks.',
    price: 2999, comparePrice: 3499,
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80'],
    category: 'Skincare', brand: 'Lumière', stock: 18, lowStockThreshold: 6, isFeatured: true,
    tags: ['serum', 'hydrating', 'hyaluronic acid'],
  },
  {
    name: 'Luminous Blush Duo',
    slug: 'luminous-blush-duo',
    description: 'Two flattering shades of powder blush in one elegant compact. Build from a natural flush to a vibrant statement cheek.',
    price: 1599,
    images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80'],
    category: 'Face', brand: 'Lumière', stock: 7, lowStockThreshold: 8, isFeatured: false,
    tags: ['blush', 'duo', 'powder'],
  },
  {
    name: 'Precision Eyeliner Pen',
    slug: 'precision-eyeliner-pen',
    description: 'Ultra-fine felt-tip liner for precise lines and dramatic wings. Smudge-proof, waterproof, and long-wearing up to 16 hours.',
    price: 799,
    images: ['https://images.unsplash.com/photo-1607748851687-ba9a10438621?auto=format&fit=crop&w=800&q=80'],
    category: 'Eyes', brand: 'Lumière', stock: 55, lowStockThreshold: 12, isFeatured: false,
    tags: ['eyeliner', 'pen', 'precision'],
  },
  {
    name: 'Lip Gloss Crystal Clear',
    slug: 'lip-gloss-crystal-clear',
    description: 'High-shine lip gloss with a non-sticky formula. Plumps lips with a juicy, glass-like finish that catches every light.',
    price: 699, comparePrice: 899,
    images: ['https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?auto=format&fit=crop&w=800&q=80'],
    category: 'Lips', brand: 'Lumière', stock: 40, lowStockThreshold: 10, isFeatured: false,
    tags: ['gloss', 'shine', 'plumping'],
  },
  {
    name: 'Noir Intense Perfume EDP',
    slug: 'noir-intense-perfume-edp',
    description: 'An intoxicating eau de parfum with top notes of bergamot and black pepper, a heart of rose and oud, and a warm amber base.',
    price: 5999, comparePrice: 7000,
    images: ['https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=800&q=80'],
    category: 'Fragrance', brand: 'Lumière Noir', stock: 12, lowStockThreshold: 5, isFeatured: true,
    tags: ['perfume', 'edp', 'oud', 'luxury'],
  },
  {
    name: 'Peptide Rich Moisturizer',
    slug: 'peptide-rich-moisturizer',
    description: 'Luxurious day and night cream packed with collagen-boosting peptides. Restores suppleness and deeply nourishes dry skin.',
    price: 2499,
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'],
    category: 'Skincare', brand: 'Lumière', stock: 0, lowStockThreshold: 8, isFeatured: false,
    tags: ['moisturizer', 'peptide', 'anti-aging'],
  },
  {
    name: 'Matte Setting Powder',
    slug: 'matte-setting-powder',
    description: 'A translucent, finely-milled setting powder that locks makeup in place, controls oil, and leaves a seamless, airbrushed finish.',
    price: 1899,
    images: ['https://images.unsplash.com/photo-1631214503819-95d98b43baf8?auto=format&fit=crop&w=800&q=80'],
    category: 'Face', brand: 'Lumière', stock: 33, lowStockThreshold: 8, isFeatured: false,
    tags: ['setting powder', 'matte', 'translucent'],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);

    // Upsert admin user
    const adminEmail = 'admin@lumiere.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'Admin@1234',
        role: 'admin',
      });
      console.log('✅ Admin user created: admin@lumiere.com / Admin@1234');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('\n🎉 Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seedDB();
