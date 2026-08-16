require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

(async() => {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find({});
  const junk = products.filter(p => !['Men','Women','Shoes','Accessories'].includes(p.category) || !p.category);
  console.log('🚨 Junk products:', junk.map(p => ({title: p.title, category: p.category, _id: p._id})));
  process.exit();
})();
