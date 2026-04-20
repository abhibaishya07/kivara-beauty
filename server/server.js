const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, same-origin)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain, the exact custom domain, or an explicitly listed origin
    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /kivarabeauty\.in$/.test(origin)
    ) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));

// Routes
app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/products',  require('./routes/productRoutes'));
app.use('/api/orders',    require('./routes/orderRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/payment',   require('./routes/paymentRoutes'));
app.use('/api/glowbot',   require('./routes/glowbotRoutes'));
app.use('/api/krizma',    require('./routes/krizmaRoutes'));

app.get('/api/health', (_, res) => res.json({ status: 'OK', app: 'Kivara Beauty API' }));

app.use(errorHandler);

// Only bind a port when running locally (not in Vercel serverless)
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`\n✨ Kivara Beauty Server running on port ${PORT}\n`));
}

module.exports = app;
