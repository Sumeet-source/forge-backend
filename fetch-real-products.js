require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function fetchRealProducts() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  // 🟢 Fake Store API se real products fetch karo
  const res = await fetch('https://fakestoreapi.com/products');
  const fakeProducts = await res.json();

  let insertedCount = 0;
  for (const item of fakeProducts) {
    // Category map karo
    let category = 'Men';
    if (item.category.includes('women')) category = 'Women';
    else if (item.category.includes('jewelery')) category = 'Accessories';
    else if (item.category.includes('shoes')) category = 'Shoes';

    const newProduct = new Product({
      title: item.title,
      price: item.price,
      description: item.description,
      images: [item.image],
      category: category,
      subCategory: item.category, // Original category hi sub-category ban jayegi
      inStock: true
    });

    await newProduct.save();
    insertedCount++;
    console.log(`✅ Added: "${item.title}" (Category: ${category})`);
  }

  console.log(`\n🎉 Done! Inserted ${insertedCount} REAL products with original photos!`);
  process.exit();
}
fetchRealProducts();
