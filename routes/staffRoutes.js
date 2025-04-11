const express = require('express');
const Staff = require('../models/staff');
const Location = require('../models/Location');

const router = express.Router();

// Create a new staff member
router.post('/', async (req, res) => {
    const { first_name, last_name, email, position, location } = req.body;
    try {
        const newStaff = new Staff({ first_name, last_name, email, position, location });
        await newStaff.save();
        res.status(201).json(newStaff);
    } catch (error) {
        res.status(500).json({ message: 'Error creating staff', error });
    }
});

// Get all staff
router.get('/', async (req, res) => {
    try {
        const staff = await Staff.find().populate('location');
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching staff', error });
    }
});

// Get a single staff member by ID
router.get('/:id', async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id).populate('location');
        if (!staff) return res.status(404).json({ message: 'Staff not found' });
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving staff', error });
    }
});

// Update a staff member
router.put('/:id', async (req, res) => {
    const { first_name, last_name, email, position, location } = req.body;
    try {
        const updatedStaff = await Staff.findByIdAndUpdate(
            req.params.id,
            { first_name, last_name, email, position, location },
            { new: true }
        );
        if (!updatedStaff) return res.status(404).json({ message: 'Staff not found' });
        res.status(200).json(updatedStaff);
    } catch (error) {
        res.status(500).json({ message: 'Error updating staff', error });
    }
});

// Delete a staff member
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Staff.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Staff not found' });
        res.status(200).json({ message: 'Staff deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting staff', error });
    }
});

// Assign staff to a location
router.put('/:id/assign-location/:locationId', async (req, res) => {
    const { id, locationId } = req.params;
    try {
        const location = await Location.findById(locationId);
        if (!location) return res.status(404).json({ message: 'Location not found' });

        const staff = await Staff.findById(id);
        if (!staff) return res.status(404).json({ message: 'Staff not found' });

        staff.location = locationId;
        await staff.save();

        res.status(200).json({ message: 'Staff assigned to location', staff });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning location', error });
    }
});

module.exports = router;
