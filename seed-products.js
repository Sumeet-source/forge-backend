require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [];

// 🟢 Helper to generate dummy data
const categories = ['Men', 'Women', 'Shoes', 'Accessories', 'Outlet'];
const subCategories = {
  Men: ['T-Shirts', 'Polos', 'Shirts', 'Jeans', 'Jackets', 'Hoodies', 'Shorts'],
  Women: ['T-Shirts', 'Tops', 'Jeans', 'Leggings', 'Jackets', 'Dresses'],
  Shoes: ['Sneakers', 'Running Shoes', 'Casual Shoes', 'Formal Shoes', 'Boots', 'Sandals'],
  Accessories: ['Watches', 'Sunglasses', 'Belts', 'Wallets', 'Backpacks', 'Caps & Hats'],
  Outlet: ['Clearance', 'Last Chance', 'Sale']
};

const titles = {
  Men: ['Performance Tee', 'Cargo Pants', 'Hooded Sweatshirt', 'Slim Fit Jeans'],
  Women: ['Seamless Leggings', 'Yoga Top', 'Oversized Hoodie', 'Pleated Skirt'],
  Shoes: ['Running Sneakers', 'Trail Hiking Boots', 'Office Loafers', 'Casual Slip-ons'],
  Accessories: ['Leather Wallet', 'Aviator Sunglasses', 'Digital Watch', 'Baseball Cap'],
  Outlet: ['Clearance Sneakers', 'Sale Running Vest', 'Last Chance Polo']
};

const placeholderImages = [
  'https://placehold.co/600x600/333/fff?text=Product+Image',
  'https://placehold.co/600x600/444/fff?text=Image+2'
];

// Generate products
let idCounter = 1;
for (const cat of categories) {
  const subs = subCategories[cat] || ['Default'];
  const catsTitles = titles[cat] || ['Product'];
  
  // 30 products per category
  for (let i = 0; i < 30; i++) {
    const sub = subs[Math.floor(Math.random() * subs.length)];
    const title = `${cat} ${sub} ${Math.floor(Math.random() * 100) + 1}`;
    const price = Math.floor(Math.random() * 90) + 10; // $10 - $100
    
    products.push({
      title: title,
      price: price,
      description: `Premium quality ${sub} designed for ${cat}. Perfect for daily wear.`,
      images: [placeholderImages[Math.floor(Math.random() * placeholderImages.length)]],
      category: cat,
      subCategory: sub,
      inStock: Math.random() > 0.1 // 90% in stock
    });
    idCounter++;
  }
}

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
    
    // 🟢 CLEAR PREVIOUS DUMMY DATA (Agar pehle se koi test data ho toh clear karo)
    // await Product.deleteMany({}); // Pehle se kuch hataana hai toh uncomment karo
    
    await Product.insertMany(products);
    console.log(`🎉 Successfully added ${products.length} products to the database!`);
    console.log('📦 Men, Women, Shoes, Accessories & Outlet all populated.');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedDB();
