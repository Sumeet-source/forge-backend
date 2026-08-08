const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id || decoded.userId; 
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// GET: Saare addresses fetch karo
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching addresses' });
  }
});

// POST: Naya address add karo
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const newAddress = req.body;
    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json(user.addresses[user.addresses.length - 1]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding address' });
  }
});

// PUT: Address update karo
router.put('/:addressId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const addressId = req.params.addressId;
    const updateData = req.body;
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) return res.status(404).json({ message: 'Address not found' });
    user.addresses[addressIndex] = { ...user.addresses[addressIndex].toObject(), ...updateData };
    await user.save();
    res.json(user.addresses[addressIndex]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating address' });
  }
});

// DELETE: Address delete karo
router.delete('/:addressId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const addressId = req.params.addressId;
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting address' });
  }
});

module.exports = router;
