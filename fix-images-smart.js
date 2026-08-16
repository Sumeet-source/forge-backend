require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function fixImages() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');
  
  const products = await Product.find({});
  let updatedCount = 0;

  for (const p of products) {
    // 🟢 Title se keywords nikaalo (Jaise "Men's Running Sneakers" -> "Men Running Sneakers")
    let keyword = p.title
      .replace(/[^a-zA-Z0-9 ]/g, '') // Special characters hatao
      .split(' ')
      .slice(0, 3) // Sirf pehle 3 words use karo
      .join(' ');
    
    // Agar title khali hai toh category use karo
    if (!keyword) keyword = p.category || 'product';

    // 🟢 Unsplash source URL jo keyword ke hisaab se real photo return karega
    const imageUrl = `https://source.unsplash.com/600x600/?${keyword}`;
    
    p.images = [imageUrl];
    await p.save();
    updatedCount++;
    console.log(`✅ Updated: "${p.title}" -> Keyword: "${keyword}"`);
  }
  
  console.log(`\n🎉 Done! Updated ${updatedCount} products with smart images!`);
  process.exit();
}
fixImages();
