const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicleNo: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    registeredYear: {
        type: Number,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    chassisNo: {
        type: String,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'not available', 'requested'], // Added 'requested' status
        default: 'available'
    },
    requested: {
        type: Boolean,
        default: false // Flag to track if the vehicle is requested
    }
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
