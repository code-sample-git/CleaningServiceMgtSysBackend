const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  position: {
    type: String,
    required: true,
  },
  clocked_in: {
    type: Boolean,
    default: false,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location', // References Mongoose Location model
  },
});

module.exports = mongoose.model('Staff', staffSchema);