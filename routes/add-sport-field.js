// forge-backend/routes/add-sport-field.js
const mongoose = require('mongoose');
const Product = require('../models/Product');

// ✅ Aapki exact Connection String (Aapka asli password already yahan daal diya gaya hai)
const MONGO_URI = "mongodb+srv://sumeetfromsummit_db_user:DFeeNwTr46aY7cl9@cluster0.bdwux5y.mongodb.net/forge_db?retryWrites=true&w=majority";

async function addSportField() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB!");

    // 1. Sabhi 175 products mein default 'Sportswear' daalo (Bina kisi ID ke)
    console.log("⏳ Adding default 'Sportswear' to all products...");
    const result = await Product.updateMany(
      { sport: { $exists: false } },
      { $set: { sport: "Sportswear" } }
    );
    console.log(`✅ Success! ${result.modifiedCount} products updated to 'Sportswear'.`);

    console.log("🎉 Database update complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addSportField();