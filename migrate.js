require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// .env se MONGO_URI lelo
const MONGODB_URI = process.env.MONGO_URI;

const migrate = async () => {
  try {
    console.log('🟢 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Update shoes without gender
    const result1 = await Product.updateMany(
      { category: 'Shoes', gender: { $exists: false } },
      { $set: { gender: 'Unisex' } }
    );
    console.log(`✅ Updated ${result1.modifiedCount} shoes to Unisex`);

    // Update any other products without gender
    const result2 = await Product.updateMany(
      { gender: { $exists: false } },
      { $set: { gender: 'Unisex' } }
    );
    console.log(`✅ Updated ${result2.modifiedCount} other products to Unisex`);

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();
