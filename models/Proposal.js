const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  locations: [
    {
      locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
      tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
    }
  ],
  frequency: { type: String, enum: ['weekly', 'bi-weekly', 'monthly'], default: 'weekly' },
  notes: { type: String },
  totalAmount: { type: Number, required: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdDate: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

ProposalSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Proposal', ProposalSchema);
