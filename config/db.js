const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
            replicaSet: 'atlas-q7r1ci-shard-0', // 🟢 Added: Yeh replica set ka naam hai
            serverSelectionTimeoutMS: 30000,
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('ℹ️ Server will continue running to allow debugging...');
    }
};

module.exports = connectDB;
