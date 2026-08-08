require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const res = await Product.updateMany(
    {}, 
    { $set: { subCategory: 'T-Shirts' } }
  );
  console.log(`✅ Updated ${res.modifiedCount} products to subCategory: 'T-Shirts'`);
  process.exit();
}
run().catch(console.error);
