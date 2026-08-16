require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function seedShoesOutlet() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  const categories = ['Shoes', 'Outlet'];
  const subCategories = {
    Shoes: ['Sneakers', 'Running Shoes', 'Casual Shoes', 'Formal Shoes', 'Loafers', 'Boots', 'Sandals'],
    Outlet: ['Clearance Sale', 'Last Chance', 'Season End', 'Final Stock']
  };
  const brandNames = ['FORGE Elite', 'Urban Track', 'Nexus Gear', 'Pulse Active', 'Apex Wear'];

  const productsToInsert = [];

  for (const cat of categories) {
    const subs = subCategories[cat];
    for (let i = 0; i < 50; i++) {
      const sub = subs[Math.floor(Math.random() * subs.length)];
      const brand = brandNames[Math.floor(Math.random() * brandNames.length)];
      const title = `${brand} ${sub} ${i + 1}`;
      const price = Math.floor(Math.random() * 80) + 20;

      const keyword = `${cat}-${sub}`.toLowerCase();
      const images = [
        `https://picsum.photos/seed/${keyword}-1/600/600`,
        `https://picsum.photos/seed/${keyword}-2/600/600`,
        `https://picsum.photos/seed/${keyword}-3/600/600`,
        `https://picsum.photos/seed/${keyword}-4/600/600`
      ];

      productsToInsert.push({
        title: title,
        price: price,
        description: `Premium ${sub} designed for ${cat}. Perfect for your daily needs.`,
        images: images,
        category: cat,
        subCategory: sub,
        inStock: true
      });
    }
  }

  await Product.insertMany(productsToInsert);
  console.log(`🎉 Successfully added ${productsToInsert.length} products!`);
  console.log(`📦 Categories: Shoes (50), Outlet (50)`);
  process.exit();
}
seedShoesOutlet();
