const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// --- Routes ---
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const reviewRoutes = require('./routes/review');
const wishlistRoutes = require('./routes/wishlist');
const couponRoutes = require('./routes/coupon');
const uploadRoutes = require('./routes/upload');
const addressRoutes = require('./routes/address'); // 🟢 Address route add kar diya

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin/upload', uploadRoutes);
app.use('/api/addresses', addressRoutes); // 🟢 Address route use kar liya

// Ping test
app.get('/ping', (req, res) => res.send('pong'));
app.get('/', (req, res) => res.send('FORGE Backend is running!'));

// --- Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));