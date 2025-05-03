const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const MnHWaste = require('../models/MnH_model');
const router = express.Router();
const upload = require('../middleware/multerConfig');  // Your multer config file


// Configure multer for file uploads without validation

// Create a new waste entry with image upload
router.post('/waste', upload.single('image'), async (req, res) => {
    try {
        const wasteData = {
            type: req.body.type,
            location: req.body.location,
            quantity: req.body.quantity,
            email: req.body.email,
            image: req.file ? `/uploads/${req.file.filename}` : null,  // Save image path in DB
            status: 'pending'
        };

        const wasteEntry = new MnHWaste(wasteData);
        await wasteEntry.save();
        res.status(201).send(wasteEntry);
    } catch (error) {
        res.status(400).send({ error: 'Error saving waste entry' });
    }
});

// GET a waste entry by ID
router.get('/waste/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const wasteEntry = await MnHWaste.findById(id);
        if (!wasteEntry) {
            return res.status(404).send({ error: 'Waste entry not found' });
        }
        res.send(wasteEntry);
    } catch (error) {
        console.error('Error fetching waste entry:', error);
        res.status(500).send({ error: 'Server error' });
    }
});

// Get all waste entries
router.get('/allwaste', async (req, res) => {
    try {
        const wasteEntries = await MnHWaste.find();
        res.status(200).send(wasteEntries);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching waste entries' });
    }
});

// Update waste entry status
router.put('/waste/:id/status', async (req, res) => {
    const { status } = req.body;
    const wasteId = req.params.id;

    try {
        const updatedWasteEntry = await MnHWaste.findByIdAndUpdate(
            wasteId,
            { status },
            { new: true }
        );

        if (!updatedWasteEntry) {
            return res.status(404).send({ error: 'Waste entry not found' });
        }

        res.status(200).send(updatedWasteEntry);
    } catch (error) {
        console.error('Error updating waste entry status:', error);
        res.status(400).send({ error: 'Error updating waste entry status' });
    }
});

// Delete a waste entry by ID
router.delete('/waste/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedWasteEntry = await MnHWaste.findByIdAndDelete(id);
        if (!deletedWasteEntry) {
            return res.status(404).send({ error: 'Waste entry not found' });
        }
        res.status(200).send({ message: 'Waste entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting waste entry:', error);
        res.status(500).send({ error: 'Server error while deleting waste entry' });
    }
});

// Send email notification
router.post('/sendEmail', async (req, res) => {
    const { email, status } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vidurahewaduwa@gmail.com', // your email
            pass: 'xvri sham unio uznf' // your email password
        }
    });

    const mailOptions = {
        from: 'vidurahewaduwa@gmail.com',
        to: email,
        subject: `Order ${status}`,
        text: `Your waste entry has been ${status}. We will send a team for the inspection within a few days. - Message by Mass and Hazardous Waste Manager - *IV Waste Management*`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        res.status(500).send(error.toString());
    }
});



module.exports = router;
