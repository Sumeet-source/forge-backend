const dns = require('dns');
dns.setDefaultResultOrder('ipv4first'); // FIX: Railway pe IPv6 ENETUNREACH issue se bachne ke liye

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const wishlistRoutes = require('./routes/wishlist');
const reviewRoutes = require('./routes/review');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/ping', (req, res) => res.send('pong'));
app.get('/', (req, res) => res.send('FORGE Backend is running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

const couponRoutes = require('./routes/coupon');
app.use('/api/coupons', couponRoutes);
