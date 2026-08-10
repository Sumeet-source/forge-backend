const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const { Resend } = require('resend');

// 🟢 Resend Client Initialize (Same as Auth)
const resend = new Resend(process.env.RESEND_API_KEY);

const key_id = process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.trim() : '';
const key_secret = process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.trim() : '';

let razorpay;
try {
  razorpay = new Razorpay({ key_id, key_secret });
} catch (error) {
  console.error('🔥 Razorpay Init Error:', error.message);
}

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
    if (!razorpay) return res.status(500).json({ message: 'Razorpay not initialized. Check API keys.' });
    const amountInPaise = Math.round(amount * 100);
    const options = { amount: amountInPaise, currency: 'INR', receipt: `receipt_${Date.now()}` };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('❌ Razorpay order error:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
});

// 🟢 Helper: Generate Order Confirmation Email HTML
const generateOrderEmailHTML = (order) => {
  const itemsHtml = order.items.map(item => 
    `<tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.title} x ${item.quantity}</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
      <div style="background-color: #000; padding: 20px; text-align: center; color: #fff; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; letter-spacing: 2px;">FORGE</h1>
        <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.8;">Premium Athletic Wear</p>
      </div>
      <div style="background-color: #fff; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h2 style="color: #333; margin-top: 0;">Order Confirmed! 🎉</h2>
        <p style="color: #555; font-size: 14px;">Thank you for your order, <strong>${order.shippingAddress?.fullName || 'Valued Customer'}</strong>!</p>
        <p style="color: #777; font-size: 13px;">Order #${order._id.toString().slice(-6)}</p>
        
        <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f4f4f4;">
              <th style="padding: 10px; text-align: left; font-size: 14px;">Item</th>
              <th style="padding: 10px; text-align: right; font-size: 14px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 16px;">Total</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 16px;">$${order.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
          <p style="font-size: 13px; color: #555;"><strong>Delivery Address:</strong><br>
          ${order.shippingAddress?.fullName || 'N/A'}<br>
          ${order.shippingAddress?.street || 'N/A'}, ${order.shippingAddress?.city || 'N/A'}<br>
          ${order.shippingAddress?.pincode || 'N/A'}</p>
          <p style="font-size: 13px; color: #555;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        </div>

        <p style="font-size: 13px; color: #888; margin-top: 20px;">We'll notify you once your order is shipped.</p>
      </div>
    </div>
  `;
};

// --- PLACE ORDER (SAVE TO DB) ---
router.post('/', async (req, res) => {
  try {
    const { user, items, totalAmount, paymentMethod, upiId, shippingAddress } = req.body;
    
    // 🟢 email validation: Checkout frontend se email aana chahiye ab
    const customerEmail = shippingAddress?.email || req.body.email || null;

    if (!user || !items || items.length === 0) return res.status(400).json({ message: 'Invalid order data' });

    const newOrder = new Order({ user, items, totalAmount, paymentMethod, upiId, shippingAddress, status: 'Pending' });
    const savedOrder = await newOrder.save();

    // 🟢 Send Email Notification
    if (customerEmail) {
      try {
        await resend.emails.send({
          from: 'FORGE <onboarding@resend.dev>', // Resend's default verified domain
          to: [customerEmail],
          subject: 'Order Confirmed! - FORGE',
          html: generateOrderEmailHTML(savedOrder),
        });
        console.log(`✅ Order confirmation email sent to ${customerEmail}`);
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError);
        // Don't block the order if email fails, just log it.
      }
    } else {
      console.warn('⚠️ No customer email provided. Email not sent.');
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: error.message || 'Server error placing order' });
  }
});

module.exports = router;
