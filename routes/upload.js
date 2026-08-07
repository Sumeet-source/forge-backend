const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const router = express.Router();

console.log('🔴 Checking Env Variables on Railway...');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Exists' : 'MISSING');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Exists' : 'MISSING');

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary Config Loaded Successfully!');
} catch (error) {
  console.error('🔥 CRITICAL ERROR IN CLOUDINARY CONFIG:', error.message);
}

let storage;
try {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'forge_products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
  });
  console.log('✅ Cloudinary Storage Setup Successful!');
} catch (error) {
  console.error('🔥 CRITICAL ERROR IN CLOUDINARY STORAGE:', error.message);
}

const upload = multer({ storage: storage });

// 🟢 FIX: Multer errors ko catch karna aur sahi logging karna
router.post('/', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      // 🔥 Claude ke fix ke hisaab se exact message log kiya
      console.error('🔥 MULTER/CLOUDINARY CRASHED (Message):', err.message);
      console.error('🔥 MULTER/CLOUDINARY CRASHED (Stack):', err.stack);
      return res.status(500).json({ message: 'Upload middleware error: ' + err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }
      console.log('✅ Cloudinary upload success:', req.file.path);
      res.json({ secure_url: req.file.path });
    } catch (error) {
      // 🔥 Claude ke fix ke hisaab se exact message log kiya
      console.error('❌ Upload error (Message):', error.message);
      console.error('❌ Upload error (Stack):', error.stack);
      res.status(500).json({ message: 'Server error uploading image: ' + error.message });
    }
  });
});

module.exports = router;
