const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  items: { type: Array, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: 'UPI' },
  upiId: { type: String },
  status: { type: String, default: 'Paid' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);