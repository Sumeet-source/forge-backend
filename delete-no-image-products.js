// forge-backend/delete-no-image-products.js
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = "mongodb+srv://sumeetfromsummit_db_user:DFeeNwTr46aY7cl9@cluster0.bdwux5y.mongodb.net/forge_db?retryWrites=true&w=majority&appName=Cluster0";

async function deleteNoImageProducts() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB!");

    // 🟢 DELETE: Jis product ka images array empty (0 elements) hai
    const result = await Product.deleteMany({ 
      $or: [
        { images: { $size: 0 } },
        { images: { $exists: false } }
      ]
    });

    console.log(`✅ ${result.deletedCount} products without images deleted successfully!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

deleteNoImageProducts();