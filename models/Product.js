const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  images: { type: [String], required: true },
  category: { type: String, required: true },  // Main category: 'Men', 'Women', etc.
  subCategory: { type: String, default: '' },  // 🔥 NEW: Sub-category: 'Jeans', 'T-Shirts', 'Sneakers'
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
