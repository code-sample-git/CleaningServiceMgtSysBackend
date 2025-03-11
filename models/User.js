const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: true,
  },
  firstName: { // Replace fullName with firstName
    type: String,
    required: true,
  },
  lastName: { // Add lastName
    type: String,
    required: true,
  },
  phoneNumber: { // Add phoneNumber
    type: String,
    required: false, // Optional; change to true if mandatory
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff', 'client'],
    default: 'staff',
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);