const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.options('*', cors({ origin: '*', credentials: true }));
app.use(express.json());

const authRoutes = require('./routes/authRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

const MONGO_URI = 'mongodb://dhakad458669_db_user:f1xRo9VUjGwPtsu@cluster0-shard-00-00.alwcqf.mongodb.net:27017,cluster0-shard-00-01.alwcqf.mongodb.net:27017,cluster0-shard-00-02.alwcqf.mongodb.net:27017/forge_db?ssl=true&authSource=admin&retryWrites=true&w=majority&connectTimeoutMS=30000';

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