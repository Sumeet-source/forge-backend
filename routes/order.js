const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');

// 🟢 Environment variables se keys utha raha hai, aur .trim() use kar raha hai
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID.trim(),
  key_secret: process.env.RAZORPAY_KEY_SECRET.trim(),
});

router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
});

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

router.post('/create-razorpay-order', async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay order error details:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to create payment order',
    });
  }
});

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
