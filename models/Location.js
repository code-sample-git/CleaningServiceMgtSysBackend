const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  assignedStaff: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff', 
    }
  ]
}, {
  timestamps: true,
});

module.exports = mongoose.model('Location', locationSchema);
