const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    // Generate token for new user so they are instantly logged in
const token = jwt.sign(
  { id: newUser._id, isAdmin: newUser.isAdmin },
  'super_secret_key_for_forge',
  { expiresIn: '1d' }
);

// Return the token along with the user
res.status(201).json({ 
  message: 'User created!', 
  token, 
  user: { id: newUser._id, name, email } 
});

    res.status(201).json({ message: 'User created!', user: { id: newUser._id, name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      'super_secret_key_for_forge',
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;