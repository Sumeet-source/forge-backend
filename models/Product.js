const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: { type: [String], default: [] },
  category: { type: String, required: true },
  subCategory: { type: String },
  inStock: { type: Boolean, default: true },
  
  // 🟢 SPORT FIELD
  sport: {
    type: String,
    enum: ['Running', 'Training', 'Sportswear', 'Basketball', 'Football', 'Yoga'],
    default: 'Sportswear'
  },

  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  // 🟢 NEW GENDER FIELD ADDED
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex'],
    default: 'Unisex'
  },

}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);