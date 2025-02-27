const mongoose = require('mongoose');

const supplyRequestSchema = new mongoose.Schema({
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['requested', 'approved', 'rejected'], default: 'requested' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SupplyRequest', supplyRequestSchema);