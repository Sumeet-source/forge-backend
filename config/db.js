const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
            serverSelectionTimeoutMS: 30000,
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        // Log the error, but DO NOT kill the app (process.exit)
        console.error('❌ MongoDB connection error:', error.message);
        console.log('ℹ️ Server will continue running to allow debugging...');
    }
};

module.exports = connectDB;
