const Staff = require('../models/Staff');

exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.find().populate('location');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addStaff = async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};