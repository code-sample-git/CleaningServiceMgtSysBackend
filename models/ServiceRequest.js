const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  clientName: {type: String },
  description: {type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);