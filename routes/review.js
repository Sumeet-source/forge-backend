const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// GET: Kisi specific product ke saare reviews fetch karo
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

// POST: Naya review add karo
router.post('/', async (req, res) => {
  try {
    const { user, product, rating, comment } = req.body;
    const newReview = new Review({ user, product, rating, comment });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding review' });
  }
});

module.exports = router;
