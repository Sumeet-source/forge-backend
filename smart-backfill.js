require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// 🟢 Keyword to Sub-Category Mapping
const keywordMap = {
  'T-Shirts': ['t-shirt', 'tshirt', 'tee'],
  'Polos': ['polo'],
  'Shirts': ['shirt'],
  'Jeans': ['jean', 'denim'],
  'Trousers': ['trouser', 'pant'],
  'Jackets': ['jacket', 'blazer'],
  'Sweatshirts': ['sweatshirt', 'sweater'],
  'Hoodies': ['hoodie'],
  'Shorts': ['short'],
  'Track Pants': ['track', 'jogger'],

  'Sneakers': ['sneaker', 'trainer'],
  'Running Shoes': ['running', 'jogging'],
  'Casual Shoes': ['casual'],
  'Formal Shoes': ['formal', 'dress'],
  'Loafers': ['loafer', 'slip-on'],
  'Boots': ['boot'],
  'Sandals': ['sandal', 'slide'],

  'Watches': ['watch'],
  'Sunglasses': ['sunglass'],
  'Belts': ['belt'],
  'Wallets': ['wallet', 'cardholder'],
  'Caps & Hats': ['cap', 'hat', 'beanie'],
  'Backpacks': ['backpack', 'bag'],
  'Socks': ['sock'],
  'Ties': ['tie', 'necktie'],
  'Cufflinks': ['cufflink']
};

async function smartBackfill() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  // Un products ko dhoondho jinka subCategory missing hai ya empty hai
  const products = await Product.find({
    $or: [{ subCategory: { $exists: false } }, { subCategory: '' }]
  });

  console.log(`📦 Found ${products.length} products with missing subCategory.`);

  let updatedCount = 0;

  for (const product of products) {
    const title = product.title.toLowerCase();
    let assignedSub = null;

    // 🔍 Title mein keyword dhoondho
    for (const [subCat, keywords] of Object.entries(keywordMap)) {
      if (keywords.some(keyword => title.includes(keyword))) {
        assignedSub = subCat;
        break;
      }
    }

    if (assignedSub) {
      product.subCategory = assignedSub;
      await product.save();
      updatedCount++;
      console.log(`✅ "${product.title}" (${product.category}) -> ${assignedSub}`);
    } else {
      // 🔄 Agar koi keyword nahi mila, toh category ke hisaab se default set karo
      if (product.category === 'Men' || product.category === 'Clothing') product.subCategory = 'T-Shirts';
      else if (product.category === 'Women') product.subCategory = 'T-Shirts';
      else if (product.category === 'Shoes') product.subCategory = 'Sneakers';
      else if (product.category === 'Accessories') product.subCategory = 'Caps & Hats';
      else product.subCategory = 'T-Shirts'; // Final fallback
      
      await product.save();
      updatedCount++;
      console.log(`🟡 Fallback for "${product.title}" -> ${product.subCategory}`);
    }
  }

  console.log(`\n🎉 Smart backfill complete! Updated ${updatedCount} products.`);
  process.exit(0);
}

smartBackfill().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
