const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    issueId: {
        type: String,
        required: true,
        unique: true, // Corrected this line
    },
    customerId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a model for Contact
const Contact = mongoose.model('Contact', contactSchema);

// Export the model
module.exports = Contact;
