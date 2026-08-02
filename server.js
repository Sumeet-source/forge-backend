const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// --- ROUTES ---
const authRoutes = require('./routes/authRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// --- DATABASE (HTTPS DATA API) ---
const MONGO_URI = 'mongodb+srv://dhakad458669_db_user:f1xRo9VUjGwPtsu@cluster0.alwcqf.mongodb.net/forge_db?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
    try {
        // apiVersion: '1' forces Mongoose to use the HTTPS Data API (bypassing port 27017 entirely)
        const options = {
            apiVersion: '1',
            driverInfo: { name: 'nodejs', version: '4.x' }
        };
        await mongoose.connect(MONGO_URI, options);
        console.log('MongoDB Connected Successfully via Data API');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
connectDB();

app.get('/', (req, res) => res.send('FORGE Backend is running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));