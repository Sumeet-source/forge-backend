const express = require('express');
const router = express.Router();
const Pincode = require('../models/Pincode');

// GET: Check if pincode is serviceable (For Checkout page)
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

// 🟢 NEW: GET All pincodes (For Admin Panel)
router.get('/all', async (req, res) => {
  try {
    const pincodes = await Pincode.find().sort({ pincode: 1 });
    res.json(pincodes);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching pincodes' });
  }
});

// POST: Add a new pincode (Admin)
router.post('/add', async (req, res) => {
  try {
    const { pincode, city, state, isActive } = req.body;
    const newPincode = new Pincode({ pincode, city, state, isActive });
    await newPincode.save();
    res.status(201).json({ success: true, message: 'Pincode added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding pincode' });
  }
});

// 🟢 NEW: Update a pincode (Admin)
router.put('/:pincode', async (req, res) => {
  try {
    const { city, state, isActive } = req.body;
    const updated = await Pincode.findOneAndUpdate(
      { pincode: req.params.pincode },
      { city, state, isActive },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Pincode not found' });
    res.json({ success: true, message: 'Pincode updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating pincode' });
  }
});

// 🟢 NEW: Delete a pincode (Admin)
router.delete('/:pincode', async (req, res) => {
  try {
    const deleted = await Pincode.findOneAndDelete({ pincode: req.params.pincode });
    if (!deleted) return res.status(404).json({ success: false, message: 'Pincode not found' });
    res.json({ success: true, message: 'Pincode deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting pincode' });
  }
});

module.exports = router;
