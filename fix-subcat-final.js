require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  const menRes = await Product.updateMany({ category: 'Men' }, { $set: { subCategory: 'T-Shirts' } });
  const womenRes = await Product.updateMany({ category: 'Women' }, { $set: { subCategory: 'T-Shirts' } });
  const shoesRes = await Product.updateMany({ category: 'Shoes' }, { $set: { subCategory: 'Sneakers' } });
  const accRes = await Product.updateMany({ category: 'Accessories' }, { $set: { subCategory: 'Caps & Hats' } });

  console.log(`Men: ${menRes.modifiedCount}, Women: ${womenRes.modifiedCount}, Shoes: ${shoesRes.modifiedCount}, Accessories: ${accRes.modifiedCount}`);
  console.log('✅ Database fixed!');

  process.exit();
})();
