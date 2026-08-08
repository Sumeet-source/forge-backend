require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI;

async function backfill() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clothing → T-Shirts (default)
    const clothingResult = await Product.updateMany(
      { category: 'Clothing', subCategory: { $exists: false } },
      { $set: { subCategory: 'T-Shirts' } }
    );

    // Shoes → Sneakers (default)
    const shoesResult = await Product.updateMany(
      { category: 'Shoes', subCategory: { $exists: false } },
      { $set: { subCategory: 'Sneakers' } }
    );

    // Accessories → Caps & Hats (default)
    const accessoriesResult = await Product.updateMany(
      { category: 'Accessories', subCategory: { $exists: false } },
      { $set: { subCategory: 'Caps & Hats' } }
    );

    console.log(`Clothing updated: ${clothingResult.modifiedCount}`);
    console.log(`Shoes updated: ${shoesResult.modifiedCount}`);
    console.log(`Accessories updated: ${accessoriesResult.modifiedCount}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

backfill();
