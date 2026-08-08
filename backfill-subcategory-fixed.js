require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product'); // 🟢 FIX: ../models se ./models kar diya

async function backfill() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  const emptyOrMissing = { $or: [{ subCategory: { $exists: false } }, { subCategory: '' }] };

  const menResult = await Product.updateMany(
    { category: 'Men', ...emptyOrMissing },
    { $set: { subCategory: 'T-Shirts' } }
  );
  const womenResult = await Product.updateMany(
    { category: 'Women', ...emptyOrMissing },
    { $set: { subCategory: 'T-Shirts' } }
  );
  const shoesResult = await Product.updateMany(
    { category: 'Shoes', ...emptyOrMissing },
    { $set: { subCategory: 'Sneakers' } }
  );
  const accessoriesResult = await Product.updateMany(
    { category: 'Accessories', ...emptyOrMissing },
    { $set: { subCategory: 'Caps & Hats' } }
  );

  console.log(`Men updated: ${menResult.modifiedCount}`);
  console.log(`Women updated: ${womenResult.modifiedCount}`);
  console.log(`Shoes updated: ${shoesResult.modifiedCount}`);
  console.log(`Accessories updated: ${accessoriesResult.modifiedCount}`);
  process.exit(0);
}
backfill();
