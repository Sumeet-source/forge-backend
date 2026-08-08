const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');

const key_id = process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.trim() : '';
const key_secret = process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.trim() : '';

const razorpay = new Razorpay({ key_id, key_secret });

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

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid order ID' });
    const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status value' });
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
});

router.post('/create-razorpay-order', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
    const options = { amount: amount * 100, currency: 'INR', receipt: `receipt_${Date.now()}` };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('❌ Razorpay order error:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user, items, totalAmount, paymentMethod, upiId, shippingAddress } = req.body;
    if (!user || !items || items.length === 0) return res.status(400).json({ message: 'Invalid order data' });
    const newOrder = new Order({ user, items, totalAmount, paymentMethod, upiId, shippingAddress, status: 'Pending' });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: error.message || 'Server error placing order' });
  }
});

module.exports = router;
