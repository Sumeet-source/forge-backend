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

// --- DATABASE (HTTPS DATA API - BYPASSES ALL RAILWAY BLOCKS) ---
const MONGO_URI = 'mongodb+srv://dhakad458669_db_user:f1xRo9VUjGwPtsu@cluster0.alwcqf.mongodb.net/forge_db?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
    try {
        const options = {
            apiVersion: '1',
            driverInfo: { name: 'nodejs', version: '4.x' }
        };
        await mongoose.connect(MONGO_URI, options);
        console.log('✅ MongoDB Connected Successfully via Data API');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
connectDB();

app.get('/', (req, res) => res.send('FORGE Backend is running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));