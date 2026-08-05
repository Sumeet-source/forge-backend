const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

// Helper function to generate 4 picsum images per product
const getImages = (seed) => {
  return [
    `https://picsum.photos/seed/${seed}/600/600`,
    `https://picsum.photos/seed/${seed}_2/600/600`,
    `https://picsum.photos/seed/${seed}_3/600/600`,
    `https://picsum.photos/seed/${seed}_4/600/600`
  ];
};

const products = [
  // --- MEN (20) ---
  { title: "Men's Pro Compression Shorts", price: 49.99, description: "High-performance compression shorts.", images: getImages('men1'), category: "Men", inStock: true },
  { title: "Men's Performance Tee", price: 34.99, description: "Breathable fabric.", images: getImages('men2'), category: "Men", inStock: true },
  { title: "Men's Tech Joggers", price: 59.99, description: "Lightweight joggers.", images: getImages('men3'), category: "Men", inStock: true },
  { title: "Men's Running Vest", price: 39.99, description: "Wind-resistant vest.", images: getImages('men4'), category: "Men", inStock: true },
  { title: "Men's Duffel Gym Bag", price: 79.99, description: "Spacious bag.", images: getImages('men5'), category: "Men", inStock: true },
  { title: "Men's Bodybuilding Tank", price: 24.99, description: "Sleeveless top.", images: getImages('men6'), category: "Men", inStock: true },
  { title: "Men's Track Pants", price: 44.99, description: "Track pants.", images: getImages('men7'), category: "Men", inStock: true },
  { title: "Men's Fleece Hoodie", price: 69.99, description: "Warm pullover.", images: getImages('men8'), category: "Men", inStock: true },
  { title: "Men's Training Shorts", price: 29.99, description: "Lightweight shorts.", images: getImages('men9'), category: "Men", inStock: true },
  { title: "Men's Athletic Socks", price: 14.99, description: "Cushioned socks.", images: getImages('men10'), category: "Men", inStock: true },
  { title: "Men's Compression Leggings", price: 54.99, description: "Full-length compression.", images: getImages('men11'), category: "Men", inStock: true },
  { title: "Men's Windbreaker Jacket", price: 89.99, description: "Water-resistant jacket.", images: getImages('men12'), category: "Men", inStock: true },
  { title: "Men's Woven Shorts", price: 35.99, description: "Athletic shorts.", images: getImages('men13'), category: "Men", inStock: true },
  { title: "Men's Long Sleeve Tech Tee", price: 39.99, description: "Long sleeve shirt.", images: getImages('men14'), category: "Men", inStock: true },
  { title: "Men's Zip-Up Hoodie", price: 74.99, description: "Full-zip hoodie.", images: getImages('men15'), category: "Men", inStock: true },
  { title: "Men's Golf Polo Shirt", price: 49.99, description: "Moisture-wicking polo.", images: getImages('men16'), category: "Men", inStock: true },
  { title: "Men's Gym Gloves", price: 19.99, description: "Leather gloves.", images: getImages('men17'), category: "Men", inStock: true },
  { title: "Men's Base Layer Top", price: 32.99, description: "Thermal base layer.", images: getImages('men18'), category: "Men", inStock: true },
  { title: "Men's Running Cap", price: 21.99, description: "Lightweight cap.", images: getImages('men19'), category: "Men", inStock: true },
  { title: "Men's Workout Shorts", price: 27.99, description: "Stretchable shorts.", images: getImages('men20'), category: "Men", inStock: true },

  // --- WOMEN (20) ---
  { title: "Women's High-Waisted Yoga Pants", price: 54.99, description: "Squat-proof leggings.", images: getImages('women1'), category: "Women", inStock: true },
  { title: "Women's High-Impact Sports Bra", price: 39.99, description: "High-impact sports bra.", images: getImages('women2'), category: "Women", inStock: true },
  { title: "Women's Running Tee", price: 44.99, description: "Ultra-light top.", images: getImages('women3'), category: "Women", inStock: true },
  { title: "Women's Gym Shorts", price: 34.99, description: "High-waist shorts.", images: getImages('women4'), category: "Women", inStock: true },
  { title: "Women's Training Jacket", price: 79.99, description: "Windbreaker jacket.", images: getImages('women5'), category: "Women", inStock: true },
  { title: "Women's Tank Top", price: 29.99, description: "Racerback tank.", images: getImages('women6'), category: "Women", inStock: true },
  { title: "Women's Stylish Joggers", price: 59.99, description: "Relaxed fit joggers.", images: getImages('women7'), category: "Women", inStock: true },
  { title: "Women's Zip Hoodie", price: 64.99, description: "Full-zip hoodie.", images: getImages('women8'), category: "Women", inStock: true },
  { title: "Women's Seamless Leggings", price: 49.99, description: "Seamless knit leggings.", images: getImages('women9'), category: "Women", inStock: true },
  { title: "Women's Sports Camisole", price: 24.99, description: "Built-in bra camisole.", images: getImages('women10'), category: "Women", inStock: true },
  { title: "Women's Running Shorts", price: 39.99, description: "Lightweight running shorts.", images: getImages('women11'), category: "Women", inStock: true },
  { title: "Women's Open-Back Tee", price: 34.99, description: "Breathable tee.", images: getImages('women12'), category: "Women", inStock: true },
  { title: "Women's Fleece Pants", price: 59.99, description: "Cozy fleece pants.", images: getImages('women13'), category: "Women", inStock: true },
  { title: "Women's Padded Sports Bra", price: 44.99, description: "Removable pads.", images: getImages('women14'), category: "Women", inStock: true },
  { title: "Women's Yoga Top", price: 32.99, description: "Longline workout top.", images: getImages('women15'), category: "Women", inStock: true },
  { title: "Women's Compression Socks", price: 16.99, description: "Graduated compression socks.", images: getImages('women16'), category: "Women", inStock: true },
  { title: "Women's Performance Skirt", price: 42.99, description: "Skort with built-in shorts.", images: getImages('women17'), category: "Women", inStock: true },
  { title: "Women's Lightweight Scarf", price: 18.99, description: "Athletic scarf.", images: getImages('women18'), category: "Women", inStock: true },
  { title: "Women's Mesh Panel Leggings", price: 55.99, description: "Stylish leggings.", images: getImages('women19'), category: "Women", inStock: true },
  { title: "Women's Workout Cap", price: 21.99, description: "Quick-dry cap.", images: getImages('women20'), category: "Women", inStock: true },

  // --- SHOES (20) ---
  { title: "Pro Running Shoes", price: 119.99, description: "Ultra-cushioned midsole.", images: getImages('shoes1'), category: "Shoes", inStock: true },
  { title: "Casual Sneakers", price: 79.99, description: "Classic white sneakers.", images: getImages('shoes2'), category: "Shoes", inStock: true },
  { title: "Weightlifting Shoes", price: 99.99, description: "Flat sole.", images: getImages('shoes3'), category: "Shoes", inStock: true },
  { title: "Waterproof Hiking Boots", price: 139.99, description: "Waterproof boots.", images: getImages('shoes4'), category: "Shoes", inStock: true },
  { title: "Slip-on Loafers", price: 59.99, description: "Slip-on loafers.", images: getImages('shoes5'), category: "Shoes", inStock: true },
  { title: "High-Top Basketball Shoes", price: 109.99, description: "Ankle support.", images: getImages('shoes6'), category: "Shoes", inStock: true },
  { title: "Summer Sandals", price: 39.99, description: "Breathable sandals.", images: getImages('shoes7'), category: "Shoes", inStock: true },
  { title: "Track Spikes", price: 89.99, description: "Lightweight spikes.", images: getImages('shoes8'), category: "Shoes", inStock: true },
  { title: "Cross-Training Shoes", price: 94.99, description: "Versatile training shoes.", images: getImages('shoes9'), category: "Shoes", inStock: true },
  { title: "Trail Running Shoes", price: 129.99, description: "Aggressive grip.", images: getImages('shoes10'), category: "Shoes", inStock: true },
  { title: "Leather Sneakers", price: 89.99, description: "Premium leather.", images: getImages('shoes11'), category: "Shoes", inStock: true },
  { title: "Golf Shoes", price: 119.99, description: "Spikeless golf shoes.", images: getImages('shoes12'), category: "Shoes", inStock: true },
  { title: "Skate Shoes", price: 69.99, description: "Durable suede shoes.", images: getImages('shoes13'), category: "Shoes", inStock: true },
  { title: "Walking Shoes", price: 74.99, description: "Ultra-light shoes.", images: getImages('shoes14'), category: "Shoes", inStock: true },
  { title: "Tennis Shoes", price: 109.99, description: "Court shoes.", images: getImages('shoes15'), category: "Shoes", inStock: true },
  { title: "Cycling Shoes", price: 149.99, description: "Stiff sole shoes.", images: getImages('shoes16'), category: "Shoes", inStock: true },
  { title: "Soccer Cleats", price: 129.99, description: "Firm ground cleats.", images: getImages('shoes17'), category: "Shoes", inStock: true },
  { title: "Sock Sneakers", price: 84.99, description: "Knit sock shoes.", images: getImages('shoes18'), category: "Shoes", inStock: true },
  { title: "Winter Boots", price: 159.99, description: "Warm winter boots.", images: getImages('shoes19'), category: "Shoes", inStock: true },
  { title: "Sport Sandals", price: 49.99, description: "Adjustable sandals.", images: getImages('shoes20'), category: "Shoes", inStock: true },

  // --- OUTLET (20) ---
  { title: "Outlet Men's Cargo Pants", price: 34.99, description: "Clearance cargo pants.", images: getImages('out1'), category: "Outlet", inStock: true },
  { title: "Outlet Women's Track Pants", price: 29.99, description: "Discount track pants.", images: getImages('out2'), category: "Outlet", inStock: true },
  { title: "Outlet Performance Tee", price: 19.99, description: "Clearance tee.", images: getImages('out3'), category: "Outlet", inStock: true },
  { title: "Outlet Gym Duffel Bag", price: 29.99, description: "Clearance gym bag.", images: getImages('out4'), category: "Outlet", inStock: true },
  { title: "Outlet Compression Shorts", price: 19.99, description: "Clearance compression shorts.", images: getImages('out5'), category: "Outlet", inStock: true },
  { title: "Outlet Fleece Hoodie", price: 39.99, description: "Clearance warm hoodie.", images: getImages('out6'), category: "Outlet", inStock: true },
  { title: "Outlet Tech Joggers", price: 29.99, description: "Clearance joggers.", images: getImages('out7'), category: "Outlet", inStock: true },
  { title: "Outlet Running Vest", price: 24.99, description: "Clearance vest.", images: getImages('out8'), category: "Outlet", inStock: true },
  { title: "Outlet Hiking Boots", price: 79.99, description: "Clearance boots.", images: getImages('out9'), category: "Outlet", inStock: true },
  { title: "Outlet Running Shoes", price: 59.99, description: "Clearance running shoes.", images: getImages('out10'), category: "Outlet", inStock: true },
  { title: "Outlet Sports Bra", price: 19.99, description: "Clearance sports bra.", images: getImages('out11'), category: "Outlet", inStock: true },
  { title: "Outlet Yoga Pants", price: 29.99, description: "Clearance yoga leggings.", images: getImages('out12'), category: "Outlet", inStock: true },
  { title: "Outlet Tank Top", price: 14.99, description: "Clearance tank top.", images: getImages('out13'), category: "Outlet", inStock: true },
  { title: "Outlet Slip-on Sneakers", price: 39.99, description: "Clearance sneakers.", images: getImages('out14'), category: "Outlet", inStock: true },
  { title: "Outlet Gym Shorts", price: 19.99, description: "Clearance gym shorts.", images: getImages('out15'), category: "Outlet", inStock: true },
  { title: "Outlet Training Jacket", price: 39.99, description: "Clearance jacket.", images: getImages('out16'), category: "Outlet", inStock: true },
  { title: "Outlet Zip Hoodie", price: 34.99, description: "Clearance zip hoodie.", images: getImages('out17'), category: "Outlet", inStock: true },
  { title: "Outlet Jogger Pants", price: 24.99, description: "Clearance jogger pants.", images: getImages('out18'), category: "Outlet", inStock: true },
  { title: "Outlet Track Spikes", price: 49.99, description: "Clearance track spikes.", images: getImages('out19'), category: "Outlet", inStock: true },
  { title: "Outlet Fleece Pants", price: 29.99, description: "Clearance fleece pants.", images: getImages('out20'), category: "Outlet", inStock: true },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    await Product.deleteMany();
    console.log('🗑️ Old products removed');
    await Product.insertMany(products);
    console.log(`✅ Added ${products.length} products with 4 images each!`);
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
