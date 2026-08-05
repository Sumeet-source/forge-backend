const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const mongoose = require('mongoose');

// GET: Admin ke liye saare orders fetch karo (Sabse naye pehle)
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
});

// GET: User ke saare orders fetch karo (User dashboard ke liye)
router.get('/my-orders', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'User ID required' });
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.json([]);

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
    if (!user || !items || items.length === 0) {
      return res.status(400).json({ message: 'Invalid order data' });
    }
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
    console.error('Order creation error:', error);
    res.status(500).json({ message: error.message || 'Server error placing order' });
  }
});

module.exports = router;
