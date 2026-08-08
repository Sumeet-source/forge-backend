require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB Connected');

  const total = await Product.countDocuments();
  console.log(`📦 Total products in DB: ${total}`);

  const hasSubCat = await Product.countDocuments({ subCategory: { $exists: true, $ne: '' } });
  console.log(`📦 Products with valid subCategory set: ${hasSubCat}`);

  // Category wise count
  const men = await Product.countDocuments({ category: 'Men' });
  const women = await Product.countDocuments({ category: 'Women' });
  const shoes = await Product.countDocuments({ category: 'Shoes' });
  const acc = await Product.countDocuments({ category: 'Accessories' });
  console.log(`Men: ${men}, Women: ${women}, Shoes: ${shoes}, Accessories: ${acc}`);
  
  process.exit();
})();
