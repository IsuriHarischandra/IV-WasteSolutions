const mongoose = require('mongoose');

const dailyCollectionSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['organic', 'e-waste', 'plastic', 'mix', 'metallic/copper/glass'],
    required: true,
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (name) {
        return /^[A-Z][a-zA-Z\s]*$/.test(name); // Capital letter validation
      },
      message: 'Name must start with a capital letter and contain only letters and spaces.',
    },
  },
  nic: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    validate: {
      validator: function (address) {
        return /^[a-zA-Z0-9\s,\/]*$/.test(address); // Allows letters, numbers, spaces, comma, and slash
      },
      message: 'Address can only contain letters, numbers, spaces, commas, and slashes.',
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Basic email validation
      },
      message: 'Invalid email format.',
    },
  },
  contactNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (contactNumber) {
        return /^0\d{9}$/.test(contactNumber); // Contact number must start with 0 and have 10 digits
      },
      message: 'Contact number must start with 0 and be exactly 10 digits long.',
    },
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['accept', 'reject', 'pending'], // Status field with three possible values
    default: 'pending', // Default status is 'pending'
  },
});

module.exports = mongoose.model('DailyCollection', dailyCollectionSchema);
