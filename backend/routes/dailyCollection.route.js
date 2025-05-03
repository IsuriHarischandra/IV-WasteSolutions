const express = require('express');
const nodemailer = require('nodemailer'); // Import Nodemailer
const router = express.Router();
const DailyCollection = require('../models/dailyCollection.model'); // Import the model

// Create a new daily collection record
router.post('/', async (req, res) => {
    try {
        const newCollection = new DailyCollection(req.body);
        const savedCollection = await newCollection.save();
        res.status(201).json(savedCollection);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all daily collection records
router.get('/', async (req, res) => {
    try {
        const collections = await DailyCollection.find();
        res.status(200).json(collections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single daily collection record by ID
router.get('/:id', async (req, res) => {
    try {
        const collection = await DailyCollection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.status(200).json(collection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update status of a daily collection (accept/reject/pending)
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;

    // Validate status
    if (!['accept', 'reject', 'pending'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        // Find the collection by ID
        const collection = await DailyCollection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        // Update the status of the collection
        collection.status = status;
        const updatedCollection = await collection.save();

        // Set up Nodemailer transport
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
            to: collection.email, // Customer's email (assuming it's part of the collection)
            subject: `Your collection request has been ${status === 'accept' ? 'accepted' : 'rejected'}`,
            text: `Dear User,\n\nYour collection request for ${collection.category} has been ${status === 'accept' ? 'accepted' : 'rejected'}.\n\nThank you!`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Respond with the updated collection
        res.status(200).json(updatedCollection);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
});

// Delete a daily collection record by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedCollection = await DailyCollection.findByIdAndDelete(req.params.id);
        if (!deletedCollection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.status(200).json({ message: 'Collection deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
