const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');
const User = require('../models/User');

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const accessToken = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'User created!', token: accessToken, refreshToken, user: { id: newUser._id, name, email, isAdmin: newUser.isAdmin } });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    res.json({ token: accessToken, refreshToken, user: { id: user._id, name: user.name, email, isAdmin: user.isAdmin } });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found' });
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await resend.emails.send({ from: 'FORGE <onboarding@resend.dev>', to: [email], subject: 'FORGE - Password Reset Request', text: `Click to reset: ${resetURL}` });
    res.json({ message: 'Reset email sent!' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successfully!' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign({ id: decoded.id, isAdmin: decoded.isAdmin }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token: newAccessToken });
  } catch (error) { return res.status(403).json({ message: 'Invalid or expired refresh token' }); }
});

router.post('/logout', (req, res) => { res.json({ message: 'Logged out successfully' }); });

module.exports = router;
