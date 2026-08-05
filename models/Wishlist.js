const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true
  }]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
