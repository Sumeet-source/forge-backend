// forge-backend/routes/seed-prod-sport.js
const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGO_URI = "mongodb+srv://sumeetfromsummit_db_user:DFeeNwTr46aY7cl9@cluster0.bdwux5y.mongodb.net/forge_db?retryWrites=true&w=majority&appName=Cluster0";

async function seedSport() {
  try {
    console.log("⏳ Connecting to Production MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to Production DB!");

    // Sabhi products ko Sportswear set karo
    await Product.updateMany({}, { $set: { sport: "Sportswear" } });
    console.log("✅ All products set to Sportswear.");

    // Pehle 5 products ko Running assign karo
    const runProducts = await Product.find().limit(5);
    const runIds = runProducts.map(p => p._id);
    await Product.updateMany(
      { _id: { $in: runIds } },
      { $set: { sport: "Running" } }
    );
    console.log(`✅ ${runIds.length} products assigned to Running.`);

    // Agle 5 products ko Training assign karo
    const trainProducts = await Product.find().skip(5).limit(5);
    const trainIds = trainProducts.map(p => p._id);
    await Product.updateMany(
      { _id: { $in: trainIds } },
      { $set: { sport: "Training" } }
    );
    console.log(`✅ ${trainIds.length} products assigned to Training.`);

    console.log("🎉 Production DB update complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedSport();