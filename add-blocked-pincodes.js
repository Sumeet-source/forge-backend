require('dotenv').config();
const mongoose = require('mongoose');
const Pincode = require('./models/Pincode');

// 🟢 YAHAN WO PINCODES DAALO JAHAN DELIVER NAHI KARNA
const blockedPincodes = [
  '123456', 
  '999999', 
  '000000',
  // '452020' // Jaise aapka koi aur area
];

async function addBlockedPincodes() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  for (const pincode of blockedPincodes) {
    await Pincode.updateOne(
      { pincode },
      { pincode: pincode, isActive: false, city: 'Blocked Area', state: 'Unknown' },
      { upsert: true }
    );
    console.log(`🚫 Blocked pincode added: ${pincode}`);
  }
  console.log('🎉 Blocked pincodes updated!');
  process.exit();
}

addBlockedPincodes().catch(console.error);
