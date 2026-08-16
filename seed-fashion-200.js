require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const categories = ['Men', 'Women', 'Shoes', 'Accessories'];
const subCategories = {
  Men: ['T-Shirts', 'Polos', 'Shirts', 'Jeans', 'Jackets', 'Hoodies', 'Shorts'],
  Women: ['T-Shirts', 'Tops', 'Jeans', 'Leggings', 'Jackets', 'Dresses'],
  Shoes: ['Sneakers', 'Running Shoes', 'Casual Shoes', 'Formal Shoes', 'Boots', 'Sandals'],
  Accessories: ['Watches', 'Sunglasses', 'Belts', 'Wallets', 'Backpacks', 'Caps & Hats']
};

const brandNames = ['FORGE Elite', 'Urban Track', 'Nexus Gear', 'Pulse Active', 'Apex Wear'];
const products = [];

for (const cat of categories) {
  const subs = subCategories[cat];
  for (let i = 0; i < 50; i++) {
    const sub = subs[Math.floor(Math.random() * subs.length)];
    const brand = brandNames[Math.floor(Math.random() * brandNames.length)];
    const title = `${brand} ${sub} ${i + 1}`;
    const price = Math.floor(Math.random() * 80) + 20; // $20 - $100

    const keyword = `${cat}-${sub}`.toLowerCase();
    const images = [
      `https://picsum.photos/seed/${keyword}-1/600/600`,
      `https://picsum.photos/seed/${keyword}-2/600/600`,
      `https://picsum.photos/seed/${keyword}-3/600/600`,
      `https://picsum.photos/seed/${keyword}-4/600/600`
    ];

    products.push({
      title: title,
      price: price,
      description: `Premium ${sub} designed for ${cat}. Crafted with high-quality materials for performance and style.`,
      images: images,
      category: cat,
      subCategory: sub,
      inStock: true
    });
  }
}

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
    await Product.insertMany(products);
    console.log(`🎉 Successfully added ${products.length} pure fashion products!`);
    console.log(`📦 Categories: Men(${50}), Women(${50}), Shoes(${50}), Accessories(${50})`);
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}
seedDB();
