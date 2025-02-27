const express = require('express');
const Location = require('../models/location'); 
const geolib = require('geolib');

const router = express.Router();

// Create a new location
router.post('/', async (req, res) => {
    const { name, address, latitude, longitude, status } = req.body;
    try {
        const location = await Location.create({
            name,
            address,
            latitude,
            longitude,
            status: status || 'Pending',
        });
        res.status(201).json(location);
    } catch (error) {
        res.status(500).json({ message: 'Error creating location', error });
    }
});

// Get all locations
router.get('/', async (req, res) => {
    try {
        const locations = await Location.findAll();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching locations', error });
    }
});

// Get location by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const location = await Location.findByPk(id);
        if (location) {
            res.status(200).json(location);
        } else {
            res.status(404).json({ message: 'Location not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching location', error });
    }
});

// Update location
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, address, latitude, longitude, status } = req.body;
    try {
        const location = await Location.update(
            { name, address, latitude, longitude, status },
            { where: { id } }
        );
        if (location[0] === 0) {
            return res.status(404).json({ message: 'Location not found or no changes made' });
        }
        res.status(200).json({ message: 'Location updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating location', error });
    }
});

// Delete location
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const location = await Location.destroy({ where: { id } });
        if (location === 0) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.status(204).json({ message: 'Location deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting location', error });
    }
});

// Validate staff clock-in using GPS coordinates
router.post('/validate', async (req, res) => {
    const { latitude, longitude, locationId } = req.body;
    
    // Validate if necessary fields are present
    if (!latitude || !longitude || !locationId) {
        return res.status(400).json({ message: 'Missing required data (latitude, longitude, locationId)' });
    }

    try {
        const location = await Location.findByPk(locationId);
        if (!location) {
            return res.status(404).json({ message: `Location with id ${locationId} not found` });
        }

        // Calculate distance between staff's position and location's coordinates
        const distance = geolib.getDistance(
            { latitude, longitude },
            { latitude: location.latitude, longitude: location.longitude }
        );

        // If within 100 meters, allow clock-in
        if (distance <= 100) {
            res.status(200).json({ message: 'Clock-in successful' });
        } else {
            res.status(400).json({ message: 'You are too far from the location' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error validating location', error });
    }
});


module.exports = router;
