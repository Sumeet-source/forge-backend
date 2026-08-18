// forge-backend/routes/fix-sport.js
const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGO_URI = "mongodb+srv://sumeetfromsummit_db_user:DFeeNwTr46aY7cl9@cluster0.bdwux5y.mongodb.net/forge_db?retryWrites=true&w=majority&appName=Cluster0";

async function fixSports() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB!");

    // 1. Sabhi products ko 'Sportswear' set karo
    await Product.updateMany({}, { $set: { sport: "Sportswear" } });
    console.log("✅ All products set to 'Sportswear'.");

    // 2. 10 random products ko 'Running' set karo
    const runningProducts = await Product.find().limit(10);
    const runningIds = runningProducts.map(p => p._id);
    await Product.updateMany(
      { _id: { $in: runningIds } },
      { $set: { sport: "Running" } }
    );
    console.log(`✅ ${runningIds.length} products assigned to 'Running'.`);

    // 3. Agle 10 random products ko 'Training' set karo
    const trainingProducts = await Product.find().skip(10).limit(10);
    const trainingIds = trainingProducts.map(p => p._id);
    await Product.updateMany(
      { _id: { $in: trainingIds } },
      { $set: { sport: "Training" } }
    );
    console.log(`✅ ${trainingIds.length} products assigned to 'Training'.`);

    console.log("🎉 Database update complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixSports();