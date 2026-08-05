const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      title: String,
      price: Number,
      quantity: Number,
      size: String,
      image: String,
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'UPI' },
  upiId: String,
  status: { type: String, default: 'Pending' },
  shippingAddress: {
    name: String,
    address: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
