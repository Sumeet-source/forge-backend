require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function addMultiImages() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  const products = await Product.find({});
  let updatedCount = 0;

  for (const p of products) {
    let keyword = p.title
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(' ')
      .slice(0, 2)
      .join('-')
      .toLowerCase();

    if (!keyword) keyword = p.category || 'product';

    // 🟢 4 alag-alag angles ki images generate karo
    const multiImages = [
      `https://picsum.photos/seed/${keyword}-1/600/600`,
      `https://picsum.photos/seed/${keyword}-2/600/600`,
      `https://picsum.photos/seed/${keyword}-3/600/600`,
      `https://picsum.photos/seed/${keyword}-4/600/600`
    ];

    p.images = multiImages;
    await p.save();
    updatedCount++;
    console.log(`✅ Updated: "${p.title}" -> Added 4 images.`);
  }

  console.log(`\n🎉 Done! Updated ${updatedCount} products with 4-5 images each!`);
  process.exit();
}
addMultiImages();
