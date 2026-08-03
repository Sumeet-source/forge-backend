const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.options('*', cors({ origin: '*', credentials: true }));
app.use(express.json());

// --- DATABASE ONLY (NO ROUTES) ---


const MONGO_URI = 'mongodb+srv://dhakads458669_db_user:f1xRo9VUjGwPtsu@cluster0.alwcqf.mongodb.net/forge_db?retryWrites=true&w=majority&appName=Cluster0';

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