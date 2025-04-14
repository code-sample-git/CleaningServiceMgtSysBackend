const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proposalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', required: false },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

FeedbackSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
