const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Explicit CORS to allow your specific Vercel domain and localhost
const allowedOrigins = [
  'https://my-ui-project-six.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// --- ROUTES ---
const authRoutes = require('./routes/authRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// --- DATABASE (DIRECT CONNECTION - IPv4 FORCED) ---
const MONGO_URI = 'mongodb://dhakad458669_db_user:f1xRo9VUjGwPtsu@cluster0-shard-00-00.alwcqf.mongodb.net:27017,cluster0-shard-00-01.alwcqf.mongodb.net:27017,cluster0-shard-00-02.alwcqf.mongodb.net:27017/forge_db?ssl=true&authSource=admin&retryWrites=true&w=majority&directConnection=true&connectTimeoutMS=10000';

const connectDB = async () => {
    try {
        const options = {
            family: 4, // Forces IPv4 to bypass ISP/Railway blocks
            serverSelectionTimeoutMS: 10000
        };
        await mongoose.connect(MONGO_URI, options);
        console.log('✅ MongoDB Connected Successfully (Direct IP Bypass)');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
connectDB();

app.get('/', (req, res) => res.send('FORGE Backend is running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));