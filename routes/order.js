const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET: User ke saare orders fetch karo
router.get('/my-orders', async (req, res) => {
  try {
    // Note: Authentication middleware lagna chahiye, abhi user ko query params se maan rahe hain
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'User ID required' });
    
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// POST: Naya order create karo
router.post('/', async (req, res) => {
  try {
    const { user, items, totalAmount, paymentMethod, upiId, shippingAddress } = req.body;
    
    const newOrder = new Order({
      user,
      items,
      totalAmount,
      paymentMethod,
      upiId,
      shippingAddress,
    });
    
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error placing order' });
  }
});

module.exports = router;
