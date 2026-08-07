const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const router = express.Router();

console.log('🔴 Checking Env Variables on Railway...');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Exists' : 'MISSING');

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary Config Loaded Successfully!');
} catch (error) {
  console.error('🔥 CRITICAL ERROR IN CLOUDINARY CONFIG:', error);
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
  console.error('🔥 CRITICAL ERROR IN CLOUDINARY STORAGE:', error);
}

const upload = multer({ storage: storage });

// 🟢 FIX: Multer ke errors ko catch karne ke liye callback wrap kiya
router.post('/', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('🔥 MULTER/CLOUDINARY CRASHED:', err);
      return res.status(500).json({ message: 'Upload middleware error: ' + err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }
      console.log('✅ Cloudinary upload success:', req.file.path);
      res.json({ secure_url: req.file.path });
    } catch (error) {
      console.error('❌ Upload error:', error);
      res.status(500).json({ message: 'Server error uploading image' });
    }
  });
});

module.exports = router;
