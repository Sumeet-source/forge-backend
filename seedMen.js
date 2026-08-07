const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

// Helper to generate 4 picsum images per product
const getImages = (seed) => {
  return [
    `https://picsum.photos/seed/${seed}/600/600`,
    `https://picsum.photos/seed/${seed}_2/600/600`,
    `https://picsum.photos/seed/${seed}_3/600/600`,
    `https://picsum.photos/seed/${seed}_4/600/600`
  ];
};

const menProducts = [
  { title: "Men's Pro Compression Shorts", price: 49.99, description: "High-performance compression shorts.", images: getImages('men1'), category: "Men", inStock: true },
  { title: "Men's Performance Tee", price: 34.99, description: "Breathable fabric for sweat-wicking.", images: getImages('men2'), category: "Men", inStock: true },
  { title: "Men's Tech Joggers", price: 59.99, description: "Lightweight joggers with zippered pockets.", images: getImages('men3'), category: "Men", inStock: true },
  { title: "Men's Running Vest", price: 39.99, description: "Wind-resistant vest for runs.", images: getImages('men4'), category: "Men", inStock: true },
  { title: "Men's Duffel Gym Bag", price: 79.99, description: "Spacious bag with shoe compartment.", images: getImages('men5'), category: "Men", inStock: true },
  { title: "Men's Bodybuilding Tank", price: 24.99, description: "Classic sleeveless top.", images: getImages('men6'), category: "Men", inStock: true },
  { title: "Men's Track Pants", price: 44.99, description: "Classic track pants with side stripes.", images: getImages('men7'), category: "Men", inStock: true },
  { title: "Men's Fleece Hoodie", price: 69.99, description: "Warm pullover for cooldown.", images: getImages('men8'), category: "Men", inStock: true },
  { title: "Men's Training Shorts", price: 29.99, description: "Lightweight shorts for cross-training.", images: getImages('men9'), category: "Men", inStock: true },
  { title: "Men's Athletic Socks (3 Pack)", price: 14.99, description: "Cushioned crew socks.", images: getImages('men10'), category: "Men", inStock: true },
  { title: "Men's Compression Leggings", price: 54.99, description: "Full-length compression leggings.", images: getImages('men11'), category: "Men", inStock: true },
  { title: "Men's Windbreaker Jacket", price: 89.99, description: "Lightweight water-resistant jacket.", images: getImages('men12'), category: "Men", inStock: true },
  { title: "Men's Woven Shorts", price: 35.99, description: "Athletic shorts with built-in liner.", images: getImages('men13'), category: "Men", inStock: true },
  { title: "Men's Long Sleeve Tech Tee", price: 39.99, description: "Long sleeve shirt for cooler days.", images: getImages('men14'), category: "Men", inStock: true },
  { title: "Men's Zip-Up Hoodie", price: 74.99, description: "Full-zip hoodie with front pockets.", images: getImages('men15'), category: "Men", inStock: true },
  { title: "Men's Golf Polo Shirt", price: 49.99, description: "Moisture-wicking polo for sports.", images: getImages('men16'), category: "Men", inStock: true },
  { title: "Men's Gym Gloves", price: 19.99, description: "Leather lifting gloves.", images: getImages('men17'), category: "Men", inStock: true },
  { title: "Men's Base Layer Top", price: 32.99, description: "Thermal base layer for winter.", images: getImages('men18'), category: "Men", inStock: true },
  { title: "Men's Running Cap", price: 21.99, description: "Lightweight running cap.", images: getImages('men19'), category: "Men", inStock: true },
  { title: "Men's Workout Shorts", price: 27.99, description: "Stretchable shorts for HIIT.", images: getImages('men20'), category: "Men", inStock: true },
];

const seedMen = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // 🟢 Sirf 'Men' category ke products delete karo (baaki categories safe!)
    await Product.deleteMany({ category: 'Men' });
    console.log('🗑️ Old Men products removed');

    await Product.insertMany(menProducts);
    console.log(`✅ Added ${menProducts.length} Men products!`);
    
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding Men products:', error);
    process.exit(1);
  }
};

seedMen();
