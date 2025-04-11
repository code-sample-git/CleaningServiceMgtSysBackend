// controllers/locationController.js
const Location = require('../models/Location');

// CRUD functions
const createLocation = async (req, res) => {
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
