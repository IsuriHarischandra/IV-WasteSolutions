const express = require('express');
const Vehicle = require('../models/vehicle.model');
const upload = require('../middleware/multerConfig');  // Your multer config file
const router = express.Router();

// Create a new vehicle with image upload
router.post('/vehicles', upload.single('image'), async (req, res) => {
    try {
        const vehicleData = {
            vehicleNo: req.body.vehicleNo,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null,  // Save image path in DB
            registeredYear: req.body.registeredYear,
            model: req.body.model,
            chassisNo: req.body.chassisNo,
            capacity: req.body.capacity,
            status: req.body.status || 'available'  // Default to 'available' if not provided
        };

        const vehicle = new Vehicle(vehicleData);
        await vehicle.save();
        res.status(201).send(vehicle);
    } catch (error) {
        res.status(400).send({ error: 'Error saving vehicle details' });
    }
});

// GET a vehicle by ID
router.get('/vehicles/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).send({ error: 'Vehicle not found' });
        }
        res.send(vehicle);
    } catch (error) {
        console.error('Error fetching vehicle:', error);
        res.status(500).send({ error: 'Server error' });
    }
});

// Get all vehicles
router.get('/allvehicles', async (req, res) => {
    try {
        const vehicles = await Vehicle.find();  // Fetch all vehicles from the DB
        res.status(200).send(vehicles);  // Send all vehicles back as a response
    } catch (error) {
        res.status(500).send({ error: 'Error fetching vehicles' });
    }
});

// Update vehicle status
router.put('/:id/status', async (req, res) => {
    const { status } = req.body;  // Extract new status from the request body
    const vehicleId = req.params.id;  // Get vehicle ID from URL parameters

    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            vehicleId,
            { status },
            { new: true }  // Return the updated document
        );

        if (!updatedVehicle) {
            return res.status(404).send({ error: 'Vehicle not found' });
        }

        res.status(200).send(updatedVehicle);
    } catch (error) {
        console.error('Error updating vehicle status:', error);
        res.status(400).send({ error: 'Error updating vehicle status' });
    }
});

// Request a vehicle
router.put('/:id/request', async (req, res) => {
    const vehicleId = req.params.id;  // Get vehicle ID from URL parameters

    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            vehicleId,
            { status: 'requested' },
            { new: true }
        );

        if (!updatedVehicle) {
            return res.status(404).send({ error: 'Vehicle not found' });
        }

        res.status(200).send(updatedVehicle);
    } catch (error) {
        console.error('Error requesting vehicle:', error);
        res.status(400).send({ error: 'Error requesting vehicle' });
    }
});

// Get all vehicles with status 'requested'
router.get('/requested', async (req, res) => {
    try {
        const requestedVehicles = await Vehicle.find({ status: 'requested' });  // Fetch vehicles with status 'requested'
        res.status(200).send(requestedVehicles);  // Send the requested vehicles back as a response
    } catch (error) {
        console.error('Error fetching requested vehicles:', error);
        res.status(500).send({ error: 'Error fetching requested vehicles' });
    }
});


// Accept a vehicle request
router.put('/:id/accept', async (req, res) => {
    const vehicleId = req.params.id;

    try {
        const vehicle = await Vehicle.findById(vehicleId);
        if (vehicle.status !== 'requested') {
            return res.status(400).send({ error: 'Vehicle request not in requested state' });
        }

        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            vehicleId,
            { status: 'not available' },
            { new: true }
        );

        res.status(200).send(updatedVehicle);
    } catch (error) {
        console.error('Error accepting vehicle request:', error);
        res.status(400).send({ error: 'Error accepting vehicle request' });
    }
});

// Reject a vehicle request
router.put('/:id/reject', async (req, res) => {
    const vehicleId = req.params.id;

    try {
        const vehicle = await Vehicle.findById(vehicleId);
        if (vehicle.status !== 'requested') {
            return res.status(400).send({ error: 'Vehicle request not in requested state' });
        }

        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            vehicleId,
            { status: 'available' },
            { new: true }
        );

        res.status(200).send(updatedVehicle);
    } catch (error) {
        console.error('Error rejecting vehicle request:', error);
        res.status(400).send({ error: 'Error rejecting vehicle request' });
    }
});


// Update vehicle details
router.put('/update/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { vehicleNo, registeredYear, model, chassisNo, capacity, status } = req.body;

    const updateData = {
        vehicleNo,
        registeredYear,
        model,
        chassisNo,
        capacity,
        status,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined, // Update image URL if a new file is uploaded
    };

    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedVehicle) {
            return res.status(404).send({ error: 'Vehicle not found' });
        }
        res.send(updatedVehicle);
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(400).send({ error: 'Error updating vehicle' });
    }
});

// Delete a vehicle by ID
router.delete('/vehicles/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(id);
        if (!deletedVehicle) {
            return res.status(404).send({ error: 'Vehicle not found' });
        }
        res.status(200).send({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).send({ error: 'Server error while deleting vehicle' });
    }
});

module.exports = router;
