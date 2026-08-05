const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000, // 🟢 Added: 45 seconds ka timeout
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('ℹ️ Server will continue running to allow debugging...');
    }
};

module.exports = connectDB;
