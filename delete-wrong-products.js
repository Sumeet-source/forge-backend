require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

(async() => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  // Electronics wale products dhoondho aur delete karo
  const result = await Product.deleteMany({
    $or: [
      { title: { $regex: /Monitor/i } },
      { title: { $regex: /Hard Drive/i } },
      { title: { $regex: /SSD/i } },
      { title: { $regex: /SanDisk/i } },
      { title: { $regex: /WD/i } },
      { title: { $regex: /Electronics/i } }
    ]
  });

  console.log(`✅ Deleted ${result.deletedCount} wrong products.`);
  process.exit();
})();
