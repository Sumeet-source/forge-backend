const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const mongoose = require('mongoose');

// GET: User ki wishlist fetch karo
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'User ID required' });
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: 'Invalid User ID' });

    let wishlist = await Wishlist.findOne({ user: userId }).populate('products');
    if (!wishlist) {
      wishlist = { products: [] }; // Wishlist nahi hai toh empty array bhejo
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching wishlist' });
  }
});

// POST: Wishlist mein product add karo
router.post('/', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) return res.status(400).json({ message: 'User ID and Product ID are required' });
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else {
      // Agar product pehle se wishlist mein hai toh duplicate add mat karo
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }
    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding to wishlist' });
  }
});

// DELETE: Wishlist se koi specific product hatao
router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'User ID required' });
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    // Product ko array se filter out kar do
    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error removing from wishlist' });
  }
});

module.exports = router;
