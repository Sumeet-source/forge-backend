const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product.js');
const authRoutes = require('./routes/authRoutes.js');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// --- ROUTES ---
app.use('/api/auth', authRoutes);

// --- DIRECT PRODUCT HANDLER ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// --- KEEP-ALIVE ROUTE (Stops Railway from sleeping) ---
app.get('/ping', (req, res) => res.send('pong'));

// --- DATABASE (Added 30s timeout to handle slow wake-ups) ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://dhakad458669_db_user:f1xRo9VUjGwPtsu@cluster0-shard-00-00.alwcqf.mongodb.net:27017,cluster0-shard-00-01.alwcqf.mongodb.net:27017,cluster0-shard-00-02.alwcqf.mongodb.net:27017/forge_db?ssl=true&authSource=admin&retryWrites=true&w=majority&connectTimeoutMS=30000';

const connectDB = async () => {
    try {
        const options = { family: 4, serverSelectionTimeoutMS: 30000 }; // 30 SECONDS
        await mongoose.connect(MONGO_URI, options);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
connectDB();

app.get('/', (req, res) => res.send('FORGE Backend is running!'));

// Add a simple "ping" endpoint to keep the backend awake
app.get('/ping', (req, res) => {
    res.send('pong');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));