// controllers/locationController.js
const Location = require('../models/Location');

// CRUD functions
exports.createLocation = async (req, res) => {
  try {
    const { name, address, latitude, longitude, assignedStaff } = req.body;
    const newLocation = new Location({ name, address, latitude, longitude, assignedStaff });
    await newLocation.save();
    res.status(201).json({ message: 'Location created successfully', location: newLocation });
  } catch (error) {
    res.status(500).json({ message: 'Error creating location', error });
  }
};

// Repeat for other CRUD operations like getAllLocations, getLocationById, etc.
exports.getLocationsByClientId = async (req, res) => {
  try {
    const locations = await Location.find({ clientId: req.params.clientId });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
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