require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function fixCategories() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  const products = await Product.find();
  let updatedCount = 0;

  for (const p of products) {
    let newCategory = p.category;
    const title = p.title.toLowerCase();

    if (title.includes("women's")) newCategory = 'Women';
    else if (title.includes("men's")) newCategory = 'Men';
    else if (title.includes("shoes")) newCategory = 'Shoes';
    else if (title.includes("accessories")) newCategory = 'Accessories';

    if (newCategory !== p.category) {
      p.category = newCategory;
      await p.save();
      updatedCount++;
      console.log(`✅ Fixed: "${p.title}" -> Category: ${newCategory}`);
    }
  }

  console.log(`🎉 Done! Fixed ${updatedCount} products.`);
  process.exit();
}
fixCategories();
