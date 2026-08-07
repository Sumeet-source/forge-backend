const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const mongoose = require('mongoose');

// POST: Coupon apply karo (Verify aur Calculate)
router.post('/apply', async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    // Uppercase mein convert karo
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code.' });
    }

    // Expiry check
    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired.' });
    }

    // Minimum order check
    if (cartTotal < coupon.minOrderValue) {
      return res.status(400).json({ message: `Minimum order of $${coupon.minOrderValue} required.` });
    }

    // Usage limit check
    if (coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit has been reached.' });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    // Discount cartTotal se zyada nahi ho sakta
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal;
    }

    const finalTotal = cartTotal - discountAmount;

    res.json({
      success: true,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      finalTotal: parseFloat(finalTotal.toFixed(2)),
      couponCode: coupon.code,
      discountType: coupon.discountType
    });
  } catch (error) {
    console.error('Coupon apply error:', error);
    res.status(500).json({ message: 'Server error applying coupon' });
  }
});

// ADMIN ROUTES (Seed data ya test ke liye)
router.post('/create', async (req, res) => {
  try {
    const newCoupon = new Coupon(req.body);
    const saved = await newCoupon.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Error creating coupon' });
  }
});

module.exports = router;
