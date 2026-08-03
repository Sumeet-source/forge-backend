const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product.js');
const authRoutes = require('./routes/authRoutes.js');

const app = express();

// --- CORS FIX (REMOVED THE BUGGY app.options('*') LINE) ---
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

// --- DATABASE ---
const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
    try {
        const options = { family: 4, serverSelectionTimeoutMS: 10000 };
        await mongoose.connect(MONGO_URI, options);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
connectDB();

app.get('/', (req, res) => res.send('FORGE Backend is running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));