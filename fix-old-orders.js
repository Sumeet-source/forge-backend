require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');

(async() => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB Connected');

  // Jine orders mein shippingAddress.phone missing hai, unme 'N/A' set kar do
  const result = await Order.updateMany(
    { 
      'shippingAddress.phone': { $exists: false },
      'shippingAddress': { $ne: null }
    },
    { $set: { 'shippingAddress.phone': 'N/A' } }
  );

  console.log(`✅ Updated ${result.modifiedCount} old orders with phone: 'N/A'`);
  process.exit();
})();
