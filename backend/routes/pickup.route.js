const express = require('express');
const PickUp = require('../models/pickup.model'); // Assuming you have the pick-up model
const router = express.Router();
const Customer = require('../models/customer.model');
const nodemailer = require('nodemailer');

// Create a new pick-up request
router.post('/pickups', async (req, res) => {
    try {
        // Include customerId from the request body
        const pickUpData = {
            category: req.body.category,
            quantity: req.body.quantity,
            date: req.body.date,
            time: req.body.time,
            description: req.body.description || '',
            location: req.body.location,
            address: req.body.address,
            customerId: req.body.customerId // Add customerId from the request
        };

        // Create a new pick-up document with the provided data
        const pickUp = new PickUp(pickUpData);
        await pickUp.save();
        
        // Send the newly created pick-up data as a response
        res.status(201).send(pickUp);
    } catch (error) {
        console.error('Error saving pick-up details:', error.message);
        res.status(400).send({ error: error.message });
    }
});



// Get a specific pick-up request by ID
router.get('/pickups/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pickUp = await PickUp.findById(id);
        
        if (!pickUp) {
            return res.status(404).send({ error: 'Pick-up not found' });
        }

        res.status(200).send(pickUp);
    } catch (error) {
        console.error('Error fetching pick-up by ID:', error.message);
        res.status(500).send({ error: 'Failed to fetch pick-up details' });
    }
});


// View all pick-up requests
router.get('/getpickups/:customerId', async (req, res) => {
    const { customerId } = req.params;
    try {
        // Use find to get all pickup requests for the customerId
        const pickups = await PickUp.find({ customerId });
        res.status(200).send(pickups);
    } catch (error) {
        console.error('Error fetching pick-ups:', error.message);
        res.status(500).send({ error: 'Failed to fetch pick-ups' });
    }
});

// View all pick-up requests
router.get('/getpickups', async (req, res) => {
    
    try {
        // Use find to get all pickup requests for the customerId
        const pickups = await PickUp.find();
        res.status(200).send(pickups);
    } catch (error) {
        console.error('Error fetching pick-ups:', error.message);
        res.status(500).send({ error: 'Failed to fetch pick-ups' });
    }
});


// Update a pick-up request by ID
router.put('/pickups/:id', async (req, res) => {
    const { id } = req.params;
    const { category, quantity, date, time, description, location, address } = req.body;

    try {
        const pickUp = await PickUp.findByIdAndUpdate(id, {
            category,
            quantity,
            date,
            time,
            description,
            location,
            address
        }, { new: true, runValidators: true });

        if (!pickUp) {
            return res.status(404).send({ error: 'Pick-up not found' });
        }

        res.status(200).send(pickUp);
    } catch (error) {
        console.error('Error updating pick-up:', error.message);
        res.status(400).send({ error: error.message });
    }
});

// Delete a pick-up request by ID
router.delete('/pickups/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPickUp = await PickUp.findByIdAndDelete(id);

        if (!deletedPickUp) {
            return res.status(404).send({ error: 'Pick-up not found' });
        }

        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error('Error deleting pick-up:', error.message);
        res.status(500).send({ error: 'Failed to delete pick-up' });
    }
});


router.put('/pickups/:id/accept', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the pick-up request by ID
        const pickUp = await PickUp.findById(id);

        if (!pickUp) {
            return res.status(404).send({ error: 'Pick-up not found' });
        }

        // Get customer email using customerId from the pick-up request
        const customer = await Customer.findOne({ customerId: pickUp.customerId });

        if (!customer) {
            return res.status(404).send({ error: 'Customer not found' });
        }

        // Update the pick-up status to 'Accepted'
        pickUp.status = 'Accepted';
        await pickUp.save();

        // Set up nodemailer transport
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service provider
            auth: {
                user: 'wup0327@gmail.com', // Your email address
                pass: 'gopwqpqididmzhwq', // Your email password or app password
            },
        });

        // Email options
        const mailOptions = {
            from: 'wup0327@gmail.com', // Sender address
            to: customer.email, // Customer's email
            subject: 'Pick-Up Request Accepted',
            text: `Your pick-up request for ${pickUp.category} has been accepted! We will notify you when it is scheduled.`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).send(pickUp);
    } catch (error) {
        console.error('Error accepting pick-up request:', error.message);
        res.status(500).send({ error: 'Failed to accept pick-up request' });
    }
});

// Reject a pick-up request by ID
router.put('/pickups/:id/reject', async (req, res) => {
    const { id } = req.params;

    try {
        const pickUp = await PickUp.findByIdAndUpdate(id, { status: 'Rejected' }, { new: true });

        if (!pickUp) {
            return res.status(404).send({ error: 'Pick-up not found' });
        }

        res.status(200).send(pickUp);
    } catch (error) {
        console.error('Error rejecting pick-up request:', error.message);
        res.status(500).send({ error: 'Failed to reject pick-up request' });
    }
});


module.exports = router;
