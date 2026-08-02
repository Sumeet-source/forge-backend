const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// --- ROUTES ---
const authRoutes = require('./routes/authRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js'); // Added this

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // Added this

// --- DATABASE ---
const MONGO_URI = 'mongodb+srv://dhakads458669_db_user:123456@cluster0.alwcqff.mongodb.net/forge_db?retryWrites=true&w=majority&appName=Cluster0';
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected Successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
connectDB();

app.get('/', (req, res) => res.send('FORGE Backend is running!'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));