const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// POST: Coupon apply karo (Verify aur Calculate)
router.post('/apply', async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code.' });

    if (coupon.expiresAt < new Date()) return res.status(400).json({ message: 'Coupon has expired.' });
    if (cartTotal < coupon.minOrderValue) return res.status(400).json({ message: `Minimum order of $${coupon.minOrderValue} required.` });
    if (coupon.timesUsed >= coupon.usageLimit) return res.status(400).json({ message: 'Coupon usage limit has been reached.' });

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }
    if (discountAmount > cartTotal) discountAmount = cartTotal;

    const finalTotal = cartTotal - discountAmount;

    coupon.timesUsed += 1;
    await coupon.save();

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

// 🟢 FIXED CREATE ROUTE: Handles lowercase + duplicate error (11000)
router.post('/create', async (req, res) => {
  try {
    // Safely convert strings to numbers
    const couponData = {
      ...req.body,
      discountValue: Number(req.body.discountValue),
      minOrderValue: Number(req.body.minOrderValue || 0),
      usageLimit: Number(req.body.usageLimit || 1)
    };

    // 🔥 FIX: Ensure discountType is lowercase for Mongoose enum
    if (couponData.discountType) {
      couponData.discountType = couponData.discountType.toLowerCase();
    }

    const newCoupon = new Coupon(couponData);
    const saved = await newCoupon.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('🔥 Error creating coupon:', error);
    
    // Check for Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    
    // 🟢 NEW FIX: Catch MongoDB Duplicate Key Error (E11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Coupon code already exists. Please use a different code.' });
    }

    res.status(500).json({ message: 'Error creating coupon' });
  }
});

module.exports = router;
