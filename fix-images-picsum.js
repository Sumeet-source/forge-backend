require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function fixImages() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');
  
  const products = await Product.find({});
  let updatedCount = 0;

  for (const p of products) {
    // 🟢 Title se clean keyword nikaalo (Picsum seed ke liye)
    let keyword = p.title
      .replace(/[^a-zA-Z0-9 ]/g, '') // Special chars hatao
      .split(' ')
      .slice(0, 2) // Sirf 2 words ka seed use karo (jaise "Men Shirts")
      .join('-')
      .toLowerCase();
    
    if (!keyword) keyword = p.category || 'product';

    // 🟢 FIX: Picsum seed URL use kar rahe hain. Ye kabhi fail nahi hota!
    const imageUrl = `https://picsum.photos/seed/${keyword}/600/600`;
    
    p.images = [imageUrl];
    await p.save();
    updatedCount++;
    console.log(`✅ Updated: "${p.title}" -> Seed: "${keyword}"`);
  }
  
  console.log(`\n🎉 Done! Updated ${updatedCount} products with Picsum seed images!`);
  process.exit();
}
fixImages();
