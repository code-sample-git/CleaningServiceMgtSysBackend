const mongoose = require('mongoose');

const qaReportSchema = new mongoose.Schema({
  location: { type: String, required: true },
  reportData: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('QAReport', qaReportSchema);