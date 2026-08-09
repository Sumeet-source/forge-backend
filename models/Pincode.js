const mongoose = require('mongoose');

const PincodeSchema = new mongoose.Schema({
  pincode: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true }, // true = deliverable, false = blocked
  city: { type: String },
  state: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Pincode', PincodeSchema);
