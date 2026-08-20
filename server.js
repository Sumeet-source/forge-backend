const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// --- Routes Imports ---
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const reviewRoutes = require('./routes/review');
const wishlistRoutes = require('./routes/wishlist');
const couponRoutes = require('./routes/coupon');
const uploadRoutes = require('./routes/upload');
const addressRoutes = require('./routes/address');
const pincodeRoutes = require('./routes/pincode');

// --- API Routes Configuration ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin/upload', uploadRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/delivery', pincodeRoutes);

// --- Ping Test ---
app.get('/ping', (req, res) => res.send('pong'));
app.get('/', (req, res) => res.send('FORGE Backend is running!'));

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));

// 🟢 VERCEL: Export for serverless deployment
module.exports = app;