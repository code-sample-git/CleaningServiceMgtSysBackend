// controllers/locationController.js
const Location = require('../models/Location');

// CRUD functions
exports.createLocation = async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create location.' });
  }
};

// Repeat for other CRUD operations like getAllLocations, getLocationById, etc.
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch locations.' });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.json(location);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLocationsByClientId = async (req, res) => {
  try {
    const locations = await Location.find({ clientId: req.params.clientId });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};