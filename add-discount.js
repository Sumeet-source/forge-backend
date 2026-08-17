// forge-backend/add-discount.js
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = "mongodb+srv://sumeetfromsummit_db_user:DFeeNwTr46aY7cl9@cluster0.bdwux5y.mongodb.net/forge_db?retryWrites=true&w=majority&appName=Cluster0";

async function addDiscountField() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB!");

    console.log("⏳ Adding discountPercent: 0 to all products...");
    const result = await Product.updateMany(
      {}, 
      { $set: { discountPercent: 0 } }
    );
    
    console.log(`✅ Success! ${result.modifiedCount} products updated with discountPercent: 0`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addDiscountField();