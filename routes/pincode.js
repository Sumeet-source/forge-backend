const express = require('express');
const router = express.Router();
const Pincode = require('../models/Pincode');

// GET: Check if pincode is serviceable
router.get('/check/:pincode', async (req, res) => {
  try {
    const { pincode } = req.params;
    if (!pincode || pincode.length !== 6) {
      return res.status(400).json({ success: false, message: 'Invalid pincode format' });
    }

    const exists = await Pincode.findOne({ pincode, isActive: true });
    if (exists) {
      return res.json({ success: true, message: 'Deliverable to this location' });
    } else {
      return res.json({ success: false, message: 'We do not deliver to this location' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST (ADMIN): Add a new pincode (Future use for Admin Dashboard)
router.post('/add', async (req, res) => {
  try {
    const { pincode, city, state } = req.body;
    const newPincode = new Pincode({ pincode, city, state, isActive: true });
    await newPincode.save();
    res.status(201).json({ success: true, message: 'Pincode added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding pincode' });
  }
});

module.exports = router;
