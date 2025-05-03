const express = require('express');
const Contact = require('../models/contact.model'); // Adjust the path as necessary
const router = express.Router();

// Create a new contact request
router.post('/submit', async (req, res) => {
    const { customerId, title, description } = req.body;

    // Generate customerId (example logic for auto-increment)
    const lastContact = await Contact.findOne().sort({ _id: -1 });
    const newId = lastContact ? parseInt(lastContact.issueId.slice(4)) + 1 : 1; // Adjusted slice to start after 'issu'
    const issueId = `issu${newId.toString().padStart(4, '0')}`;

    try {
        const newContact = new Contact({
            issueId,
            customerId,
            title,
            description,
        });

        await newContact.save(); // Save the contact request to the database
        res.status(201).json({ message: 'Contact request submitted successfully!', contact: newContact });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error submitting contact request', error: error.message });
    }
});

// Get all contact requests
router.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find(); // Fetch all contact requests from the database
        res.status(200).json(contacts); // Send the contacts as a JSON response
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Error fetching contact requests', error: error.message });
    }
});

// Delete a contact request by id
router.delete('/requests/:id', async (req, res) => {
    const { id } = req.params; // Get the id from the URL parameters

    try {
        const deletedContact = await Contact.findByIdAndDelete(id); // Use id directly here

        if (!deletedContact) {
            return res.status(404).json({ message: 'Contact request not found.' });
        }

        res.status(200).json({ message: 'Contact request deleted successfully!' });
    } catch (error) {
        console.error('Error deleting contact request:', error);
        res.status(500).json({ message: 'Error deleting contact request', error: error.message });
    }
});



// Export the router
module.exports = router;
