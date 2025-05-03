const mongoose = require('mongoose');

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  pickupId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Pickup model
    ref: 'PickUp', // The model name to reference
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  starRating: {
    type: Number,
    required: true,
    min: 1, // Minimum rating
    max: 5  // Maximum rating
  },
  createdAt: {
    type: Date,
    default: Date.now // Automatically set the creation date
  }
});

// Create the Feedback model
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
