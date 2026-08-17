const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: { type: [String], default: [] },
  category: { type: String, required: true },
  subCategory: { type: String },
  inStock: { type: Boolean, default: true },
  
  // 🟢 NEW SPORT FIELD ADDED
  sport: {
    type: String,
    enum: ['Running', 'Training', 'Sportswear', 'Basketball', 'Football', 'Yoga'],
    default: 'Sportswear'
  },

    discountPercent: {
    type: Number,
    default: 0, // Default 0 means no discount
    min: 0,
    max: 100
  },

}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);