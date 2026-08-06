const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order'); // <--- Added

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // <--- Added

// Health Checks
app.get('/ping', (req, res) => res.send('pong'));
app.get('/', (req, res) => res.send('FORGE Backend is running!'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

const wishlistRoutes = require('./routes/wishlist');
app.use('/api/wishlist', wishlistRoutes);

const wishlistRoutes = require('./routes/wishlist');
app.use('/api/wishlist', wishlistRoutes);

const reviewRoutes = require('./routes/review');
app.use('/api/reviews', reviewRoutes);
