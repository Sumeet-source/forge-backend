const mongoose = require('mongoose');

// --- STANDARD CONNECTION STRING WITH IPv4 FORCE ---
const MONGO_URI = 'mongodb://dhakad458669_db_user:f1xRo9VUjGwPtsu@cluster0-shard-00-00.alwcqf.mongodb.net:27017,cluster0-shard-00-01.alwcqf.mongodb.net:27017,cluster0-shard-00-02.alwcqf.mongodb.net:27017/forge_db?ssl=true&authSource=admin&retryWrites=true&w=majority&connectTimeoutMS=30000';

const productSchema = new mongoose.Schema({
  title: String, price: Number, originalPrice: Number, image: String,
  category: String, brand: String, inStock: Boolean, rating: Number,
  colors: Array, reviews: Array
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const products = [
  { title: "Tech Fleece Hoodie", price: 75.00, originalPrice: 100.00, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80", category: "men", brand: "FORGE", inStock: true, rating: 4.8, colors: ['#333333', '#666666', '#ffffff'], reviews: [] },
  { title: "Performance Joggers", price: 65.00, originalPrice: 90.00, image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=600&q=80", category: "men", brand: "FORGE", inStock: true, rating: 4.5, colors: ['#222222', '#444444'], reviews: [] },
  { title: "Compression Base Layer", price: 50.00, originalPrice: 70.00, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80", category: "men", brand: "Under Armour", inStock: true, rating: 4.8, colors: ['#000000', '#ffffff'], reviews: [] },
  { title: "Performance Training Shorts", price: 35.00, originalPrice: 45.00, image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80", category: "men", brand: "Nike", inStock: true, rating: 4.6, colors: ['#222222', '#444444', '#888888'], reviews: [] },
  { title: "High-Waist Yoga Leggings", price: 55.00, originalPrice: 80.00, image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=600&q=80", category: "women", brand: "Lululemon", inStock: true, rating: 4.9, colors: ['#111111', '#888888', '#ffffff'], reviews: [] },
  { title: "Seamless Sports Bra", price: 45.00, originalPrice: 60.00, image: "https://images.unsplash.com/photo-1579722820308-d74e5719000b?auto=format&fit=crop&w=600&q=80", category: "women", brand: "FORGE", inStock: true, rating: 4.7, colors: ['#ff69b4', '#ffffff', '#000000'], reviews: [] },
  { title: "Lightweight Tank Top", price: 35.00, originalPrice: 45.00, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=600&q=80", category: "women", brand: "FORGE", inStock: true, rating: 4.9, colors: ['#ff69b4', '#ffffff', '#000000'], reviews: [] },
  { title: "Women's Running Shorts", price: 40.00, originalPrice: 55.00, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80", category: "women", brand: "Nike", inStock: true, rating: 4.6, colors: ['#000000', '#ff69b4'], reviews: [] },
  { title: "Insulated Puffer Jacket", price: 150.00, originalPrice: 200.00, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80", category: "outerwear", brand: "FORGE", inStock: true, rating: 4.9, colors: ['#1d1d1d', '#ffffff', '#cc0000'], reviews: [] },
  { title: "Lightweight Windbreaker", price: 85.00, originalPrice: 110.00, image: "https://images.unsplash.com/photo-1551028919-ac24b477a654?auto=format&fit=crop&w=600&q=80", category: "outerwear", brand: "Adidas", inStock: true, rating: 4.7, colors: ['#000000', '#444444', '#1e90ff'], reviews: [] },
  { title: "Essential Running Shoe", price: 120.00, originalPrice: 160.00, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", category: "footwear", brand: "Nike", inStock: true, rating: 4.6, colors: ['#cc0000', '#000000', '#ffffff'], reviews: [] },
  { title: "Basketball Pro Sneakers", price: 140.00, originalPrice: 180.00, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", category: "footwear", brand: "Under Armour", inStock: true, rating: 4.8, colors: ['#ffd700', '#000000'], reviews: [] },
  { title: "Comfort Slides", price: 35.00, originalPrice: 45.00, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80", category: "footwear", brand: "FORGE", inStock: true, rating: 4.4, colors: ['#000000', '#ffffff'], reviews: [] },
  { title: "Elite Gym Backpack", price: 60.00, originalPrice: 80.00, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80", category: "men", brand: "FORGE", inStock: true, rating: 4.8, colors: ['#1d1d1d', '#ffffff'], reviews: [] },
  { title: "Performance Sports Socks (3 Pack)", price: 25.00, originalPrice: 35.00, image: "https://images.unsplash.com/photo-1586350977771-4c1c413952a0?auto=format&fit=crop&w=600&q=80", category: "men", brand: "FORGE", inStock: true, rating: 4.9, colors: ['#ffffff', '#000000'], reviews: [] },
];

const connectDB = async () => {
    try {
        const options = {
            family: 4, 
            serverSelectionTimeoutMS: 30000 // 30 seconds to connect
        };
        await mongoose.connect(MONGO_URI, options);
        console.log('🌍 Connected to MongoDB Atlas!');

        await Product.deleteMany({});
        console.log('🧹 Cleared old products...');

        await Product.insertMany(products);
        console.log('✅ Successfully seeded 16 products into the database!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

connectDB();