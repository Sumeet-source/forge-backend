const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const products = [
  // --- MEN (20) ---
  { title: "Men's Pro Compression Shorts", price: 49.99, description: "High-performance compression shorts.", imageUrl: "https://picsum.photos/seed/men1/600/600", category: "Men", inStock: true },
  { title: "Men's Performance Tee", price: 34.99, description: "Breathable fabric for sweat-wicking.", imageUrl: "https://picsum.photos/seed/men2/600/600", category: "Men", inStock: true },
  { title: "Men's Tech Joggers", price: 59.99, description: "Lightweight joggers with zippered pockets.", imageUrl: "https://picsum.photos/seed/men3/600/600", category: "Men", inStock: true },
  { title: "Men's Running Vest", price: 39.99, description: "Wind-resistant vest for runs.", imageUrl: "https://picsum.photos/seed/men4/600/600", category: "Men", inStock: true },
  { title: "Men's Duffel Gym Bag", price: 79.99, description: "Spacious bag with shoe compartment.", imageUrl: "https://picsum.photos/seed/men5/600/600", category: "Men", inStock: true },
  { title: "Men's Bodybuilding Tank", price: 24.99, description: "Classic sleeveless top.", imageUrl: "https://picsum.photos/seed/men6/600/600", category: "Men", inStock: true },
  { title: "Men's Track Pants", price: 44.99, description: "Classic track pants with side stripes.", imageUrl: "https://picsum.photos/seed/men7/600/600", category: "Men", inStock: true },
  { title: "Men's Fleece Hoodie", price: 69.99, description: "Warm pullover for cooldown.", imageUrl: "https://picsum.photos/seed/men8/600/600", category: "Men", inStock: true },
  { title: "Men's Training Shorts", price: 29.99, description: "Lightweight shorts for cross-training.", imageUrl: "https://picsum.photos/seed/men9/600/600", category: "Men", inStock: true },
  { title: "Men's Athletic Socks (3 Pack)", price: 14.99, description: "Cushioned crew socks.", imageUrl: "https://picsum.photos/seed/men10/600/600", category: "Men", inStock: true },
  { title: "Men's Compression Leggings", price: 54.99, description: "Full-length compression.", imageUrl: "https://picsum.photos/seed/men11/600/600", category: "Men", inStock: true },
  { title: "Men's Windbreaker Jacket", price: 89.99, description: "Lightweight water-resistant jacket.", imageUrl: "https://picsum.photos/seed/men12/600/600", category: "Men", inStock: true },
  { title: "Men's Woven Shorts", price: 35.99, description: "Athletic shorts with built-in liner.", imageUrl: "https://picsum.photos/seed/men13/600/600", category: "Men", inStock: true },
  { title: "Men's Long Sleeve Tech Tee", price: 39.99, description: "Long sleeve shirt for cooler days.", imageUrl: "https://picsum.photos/seed/men14/600/600", category: "Men", inStock: true },
  { title: "Men's Zip-Up Hoodie", price: 74.99, description: "Full-zip hoodie with front pockets.", imageUrl: "https://picsum.photos/seed/men15/600/600", category: "Men", inStock: true },
  { title: "Men's Golf Polo Shirt", price: 49.99, description: "Moisture-wicking polo for sports.", imageUrl: "https://picsum.photos/seed/men16/600/600", category: "Men", inStock: true },
  { title: "Men's Gym Gloves", price: 19.99, description: "Leather lifting gloves.", imageUrl: "https://picsum.photos/seed/men17/600/600", category: "Men", inStock: true },
  { title: "Men's Base Layer Top", price: 32.99, description: "Thermal base layer for winter.", imageUrl: "https://picsum.photos/seed/men18/600/600", category: "Men", inStock: true },
  { title: "Men's Running Cap", price: 21.99, description: "Lightweight running cap.", imageUrl: "https://picsum.photos/seed/men19/600/600", category: "Men", inStock: true },
  { title: "Men's Workout Shorts", price: 27.99, description: "Stretchable shorts for HIIT.", imageUrl: "https://picsum.photos/seed/men20/600/600", category: "Men", inStock: true },

  // --- WOMEN (20) ---
  { title: "Women's High-Waisted Yoga Pants", price: 54.99, description: "Squat-proof leggings.", imageUrl: "https://picsum.photos/seed/women1/600/600", category: "Women", inStock: true },
  { title: "Women's High-Impact Sports Bra", price: 39.99, description: "Supports high-intensity workouts.", imageUrl: "https://picsum.photos/seed/women2/600/600", category: "Women", inStock: true },
  { title: "Women's Running Tee", price: 44.99, description: "Ultra-light sweat-wicking top.", imageUrl: "https://picsum.photos/seed/women3/600/600", category: "Women", inStock: true },
  { title: "Women's Gym Shorts", price: 34.99, description: "High-waist stretch shorts.", imageUrl: "https://picsum.photos/seed/women4/600/600", category: "Women", inStock: true },
  { title: "Women's Training Jacket", price: 79.99, description: "Windbreaker jacket for outdoor.", imageUrl: "https://picsum.photos/seed/women5/600/600", category: "Women", inStock: true },
  { title: "Women's Tank Top", price: 29.99, description: "Racerback tank for yoga.", imageUrl: "https://picsum.photos/seed/women6/600/600", category: "Women", inStock: true },
  { title: "Women's Stylish Joggers", price: 59.99, description: "Relaxed fit joggers.", imageUrl: "https://picsum.photos/seed/women7/600/600", category: "Women", inStock: true },
  { title: "Women's Zip Hoodie", price: 64.99, description: "Full-zip hoodie with fleece.", imageUrl: "https://picsum.photos/seed/women8/600/600", category: "Women", inStock: true },
  { title: "Women's Seamless Leggings", price: 49.99, description: "Seamless knit leggings.", imageUrl: "https://picsum.photos/seed/women9/600/600", category: "Women", inStock: true },
  { title: "Women's Sports Camisole", price: 24.99, description: "Built-in bra camisole.", imageUrl: "https://picsum.photos/seed/women10/600/600", category: "Women", inStock: true },
  { title: "Women's Running Shorts", price: 39.99, description: "Lightweight running shorts.", imageUrl: "https://picsum.photos/seed/women11/600/600", category: "Women", inStock: true },
  { title: "Women's Open-Back Tee", price: 34.99, description: "Breathable tee with stylish back.", imageUrl: "https://picsum.photos/seed/women12/600/600", category: "Women", inStock: true },
  { title: "Women's Fleece Pants", price: 59.99, description: "Cozy fleece pants.", imageUrl: "https://picsum.photos/seed/women13/600/600", category: "Women", inStock: true },
  { title: "Women's Padded Sports Bra", price: 44.99, description: "Removable pads for support.", imageUrl: "https://picsum.photos/seed/women14/600/600", category: "Women", inStock: true },
  { title: "Women's Yoga Top", price: 32.99, description: "Longline workout top.", imageUrl: "https://picsum.photos/seed/women15/600/600", category: "Women", inStock: true },
  { title: "Women's Compression Socks", price: 16.99, description: "Graduated compression socks.", imageUrl: "https://picsum.photos/seed/women16/600/600", category: "Women", inStock: true },
  { title: "Women's Performance Skirt", price: 42.99, description: "Skort with built-in shorts.", imageUrl: "https://picsum.photos/seed/women17/600/600", category: "Women", inStock: true },
  { title: "Women's Lightweight Scarf", price: 18.99, description: "Athletic scarf for outdoor runs.", imageUrl: "https://picsum.photos/seed/women18/600/600", category: "Women", inStock: true },
  { title: "Women's Mesh Panel Leggings", price: 55.99, description: "Stylish leggings with mesh ventilation.", imageUrl: "https://picsum.photos/seed/women19/600/600", category: "Women", inStock: true },
  { title: "Women's Workout Cap", price: 21.99, description: "Quick-dry cap with UV protection.", imageUrl: "https://picsum.photos/seed/women20/600/600", category: "Women", inStock: true },

  // --- SHOES (20) ---
  { title: "Pro Running Shoes", price: 119.99, description: "Ultra-cushioned midsole for long distances.", imageUrl: "https://picsum.photos/seed/shoes1/600/600", category: "Shoes", inStock: true },
  { title: "Casual Sneakers", price: 79.99, description: "Classic white sneakers for everyday wear.", imageUrl: "https://picsum.photos/seed/shoes2/600/600", category: "Shoes", inStock: true },
  { title: "Weightlifting Shoes", price: 99.99, description: "Hard flat sole for stable weightlifting.", imageUrl: "https://picsum.photos/seed/shoes3/600/600", category: "Shoes", inStock: true },
  { title: "Waterproof Hiking Boots", price: 139.99, description: "Waterproof boots for mountain trails.", imageUrl: "https://picsum.photos/seed/shoes4/600/600", category: "Shoes", inStock: true },
  { title: "Slip-on Loafers", price: 59.99, description: "Easy slip-on loafers for casual outings.", imageUrl: "https://picsum.photos/seed/shoes5/600/600", category: "Shoes", inStock: true },
  { title: "High-Top Basketball Shoes", price: 109.99, description: "Ankle support for basketball games.", imageUrl: "https://picsum.photos/seed/shoes6/600/600", category: "Shoes", inStock: true },
  { title: "Summer Sandals", price: 39.99, description: "Breathable sandals for summer.", imageUrl: "https://picsum.photos/seed/shoes7/600/600", category: "Shoes", inStock: true },
  { title: "Track Spikes", price: 89.99, description: "Lightweight spikes for track competitions.", imageUrl: "https://picsum.photos/seed/shoes8/600/600", category: "Shoes", inStock: true },
  { title: "Cross-Training Shoes", price: 94.99, description: "Versatile shoes for weightlifting and cardio.", imageUrl: "https://picsum.photos/seed/shoes9/600/600", category: "Shoes", inStock: true },
  { title: "Trail Running Shoes", price: 129.99, description: "Aggressive grip for off-road runs.", imageUrl: "https://picsum.photos/seed/shoes10/600/600", category: "Shoes", inStock: true },
  { title: "Leather Sneakers", price: 89.99, description: "Premium leather sneakers with retro style.", imageUrl: "https://picsum.photos/seed/shoes11/600/600", category: "Shoes", inStock: true },
  { title: "Golf Shoes", price: 119.99, description: "Spikeless golf shoes for maximum comfort.", imageUrl: "https://picsum.photos/seed/shoes12/600/600", category: "Shoes", inStock: true },
  { title: "Skate Shoes", price: 69.99, description: "Durable suede shoes for skateboarding.", imageUrl: "https://picsum.photos/seed/shoes13/600/600", category: "Shoes", inStock: true },
  { title: "Walking Shoes", price: 74.99, description: "Ultra-lightweight shoes for daily walking.", imageUrl: "https://picsum.photos/seed/shoes14/600/600", category: "Shoes", inStock: true },
  { title: "Tennis Shoes", price: 109.99, description: "Court shoes with excellent lateral support.", imageUrl: "https://picsum.photos/seed/shoes15/600/600", category: "Shoes", inStock: true },
  { title: "Cycling Shoes", price: 149.99, description: "Stiff sole shoes for road cycling.", imageUrl: "https://picsum.photos/seed/shoes16/600/600", category: "Shoes", inStock: true },
  { title: "Soccer Cleats", price: 129.99, description: "Firm ground cleats for soccer.", imageUrl: "https://picsum.photos/seed/shoes17/600/600", category: "Shoes", inStock: true },
  { title: "Sock Sneakers", price: 84.99, description: "Trendy knit sock shoes.", imageUrl: "https://picsum.photos/seed/shoes18/600/600", category: "Shoes", inStock: true },
  { title: "Winter Boots", price: 159.99, description: "Warm and waterproof winter boots.", imageUrl: "https://picsum.photos/seed/shoes19/600/600", category: "Shoes", inStock: true },
  { title: "Sport Sandals", price: 49.99, description: "Adjustable strap sandals for hikes.", imageUrl: "https://picsum.photos/seed/shoes20/600/600", category: "Shoes", inStock: true },

  // --- OUTLET (20) ---
  { title: "Outlet - Men's Cargo Pants", price: 34.99, description: "Clearance cargo pants with pockets.", imageUrl: "https://picsum.photos/seed/out1/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Women's Track Pants", price: 29.99, description: "Discount track pants.", imageUrl: "https://picsum.photos/seed/out2/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Performance Tee", price: 19.99, description: "Clearance performance tee.", imageUrl: "https://picsum.photos/seed/out3/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Gym Duffel Bag", price: 29.99, description: "Clearance gym duffel bag.", imageUrl: "https://picsum.photos/seed/out4/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Compression Shorts", price: 19.99, description: "Clearance compression shorts.", imageUrl: "https://picsum.photos/seed/out5/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Fleece Hoodie", price: 39.99, description: "Clearance warm fleece hoodie.", imageUrl: "https://picsum.photos/seed/out6/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Tech Joggers", price: 29.99, description: "Clearance lightweight joggers.", imageUrl: "https://picsum.photos/seed/out7/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Running Vest", price: 24.99, description: "Clearance wind-resistant vest.", imageUrl: "https://picsum.photos/seed/out8/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Hiking Boots", price: 79.99, description: "Clearance waterproof boots.", imageUrl: "https://picsum.photos/seed/out9/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Running Shoes", price: 59.99, description: "Clearance running shoes.", imageUrl: "https://picsum.photos/seed/out10/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Sports Bra", price: 19.99, description: "Clearance high-impact sports bra.", imageUrl: "https://picsum.photos/seed/out11/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Yoga Pants", price: 29.99, description: "Clearance yoga leggings.", imageUrl: "https://picsum.photos/seed/out12/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Tank Top", price: 14.99, description: "Clearance racerback tank top.", imageUrl: "https://picsum.photos/seed/out13/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Slip-on Sneakers", price: 39.99, description: "Clearance casual sneakers.", imageUrl: "https://picsum.photos/seed/out14/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Gym Shorts", price: 19.99, description: "Clearance high-waisted shorts.", imageUrl: "https://picsum.photos/seed/out15/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Training Jacket", price: 39.99, description: "Clearance windbreaker jacket.", imageUrl: "https://picsum.photos/seed/out16/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Zip Hoodie", price: 34.99, description: "Clearance full-zip hoodie.", imageUrl: "https://picsum.photos/seed/out17/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Jogger Pants", price: 24.99, description: "Clearance women's jogger pants.", imageUrl: "https://picsum.photos/seed/out18/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Track Spikes", price: 49.99, description: "Clearance lightweight track spikes.", imageUrl: "https://picsum.photos/seed/out19/600/600", category: "Outlet", inStock: true },
  { title: "Outlet - Fleece Pants", price: 29.99, description: "Clearance cozy fleece pants.", imageUrl: "https://picsum.photos/seed/out20/600/600", category: "Outlet", inStock: true },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    await Product.deleteMany();
    console.log('🗑️ Old products removed');
    await Product.insertMany(products);
    console.log(`✅ Added ${products.length} products!`);
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
