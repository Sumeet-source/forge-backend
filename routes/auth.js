const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');
const User = require('../models/User');

const router = express.Router();

// 🟢 Resend Client (API Key se auth hoga)
const resend = new Resend(process.env.RESEND_API_KEY);

// --- SIGNUP ---
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(201).json({ message: 'User created!', token, user: { id: newUser._id, name, email, isAdmin: newUser.isAdmin } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token, user: { id: user._id, name: user.name, email, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- FORGOT PASSWORD ---
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No account found with that email address.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 🟢 Resend ke through email bhejna
    const { data, error } = await resend.emails.send({
      from: 'FORGE <onboarding@resend.dev>',
      to: [email],
      subject: 'FORGE - Password Reset Request',
      text: `You are receiving this because you requested the reset of the password for your account.\n\n
      Please click on the following link to reset it:\n\n
      ${resetURL}\n\n
      If you did not request this, please ignore this email.`,
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
    }

    res.json({ message: 'Reset email sent successfully!' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error sending reset email' });
  }
});

// --- RESET PASSWORD ---
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully!' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error resetting password' });
  }
});

module.exports = router;
