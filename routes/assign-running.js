// forge-backend/assign-running.js
const mongoose = require('mongoose');
const Product = require('../models/Product');

// ✅ Connection string (Password pehle se set hai)
const MONGO_URI = "mongodb+srv://sumeetfromsummit_db_user:DFeeNwTr46aY7cl9@cluster0.bdwux5y.mongodb.net/forge_db?retryWrites=true&w=majority&appName=Cluster0";

async function assignSports() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB!");

    // 1. Pehle 5 products ko 'Running' assign karo
    const runningResult = await Product.updateMany(
      {}, 
      { $set: { sport: "Running" } },
      { limit: 5 }
    );
    console.log(`✅ ${runningResult.modifiedCount} products assigned to 'Running'.`);

    // 2. Agle 5 products ko 'Training' assign karo
    const trainingResult = await Product.updateMany(
      {}, 
      { $set: { sport: "Training" } },
      { skip: 5, limit: 5 }
    );
    console.log(`✅ ${trainingResult.modifiedCount} products assigned to 'Training'.`);

    console.log("🎉 Database update complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

assignSports();