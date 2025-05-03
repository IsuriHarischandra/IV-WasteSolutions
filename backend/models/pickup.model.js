const mongoose = require('mongoose');

const pickUpSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['organic', 'e-waste', 'plastic', 'mix', 'metallic/copper/glass']
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
       
    },

    status: { type: String, default: 'Pending' },

}, { timestamps: true });

const PickUp = mongoose.model('PickUp', pickUpSchema);
module.exports = PickUp;
