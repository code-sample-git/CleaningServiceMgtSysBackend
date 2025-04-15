const express = require('express');
const Location = require('../models/Location');
const Staff = require('../models/staff');
const geolib = require('geolib');
const router = express.Router();
const locationController = require('../controllers/locationController')
const { authenticate } = require('../middleware/auth');

// Create a new location
router.post('/', authenticate, locationController.createLocation);

// Get all locations
router.get('/', authenticate, locationController.getAllLocations);

// Get location by ID
router.get('/:id', authenticate, locationController.getLocationById);

// Get location by Client ID
router.get('/client/:clientId', authenticate, locationController.getLocationsByClientId);

// Delete location
router.delete('/:id', authenticate, locationController.getLocationById);

// Update location
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, address, latitude, longitude, status } = req.body;
    try {
        const location = await Location.findByIdAndUpdate(
            id,
            { name, address, latitude, longitude, status },
            { new: true }
        );
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.status(200).json({ message: 'Location updated successfully', location });
    } catch (error) {
        res.status(500).json({ message: 'Error updating location', error });
    }
});

// Validate staff clock-in using GPS coordinates
router.post('/validate', async (req, res) => {
    const { latitude, longitude, locationId } = req.body;

    if (!latitude || !longitude || !locationId) {
        return res.status(400).json({ message: 'Missing required data (latitude, longitude, locationId)' });
    }

    try {
        const location = await Location.findById(locationId);
        if (!location) {
            return res.status(404).json({ message: `Location with id ${locationId} not found` });
        }

        const distance = geolib.getDistance(
            { latitude, longitude },
            { latitude: location.latitude, longitude: location.longitude }
        );

        if (distance <= 100) {
            res.status(200).json({ message: 'Clock-in successful' });
        } else {
            res.status(400).json({ message: 'You are too far from the location' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error validating location', error });
    }
});

// Assign staff to a location
router.put('/:locationId/assign-staff/:staffId', async (req, res) => {
    const { locationId, staffId } = req.params;

    try {
        const location = await Location.findById(locationId);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        const staff = await Staff.findById(staffId);
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        staff.location = locationId;
        await staff.save();

        res.status(200).json({ message: 'Staff assigned to location', staff });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning staff', error });
    }
});

// Get all staff assigned to a location
router.get('/:locationId/staff', async (req, res) => {
    const { locationId } = req.params;

    try {
        const staffList = await Staff.find({ location: locationId });
        res.status(200).json(staffList);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving staff', error });
    }
});

module.exports = router;
