const mongoose = require('mongoose');

// Payment Schema
const paymentSchema = new mongoose.Schema({
    customerId: { 
        type: String,        
        required: true 
    },
    creditCardNumber: { 
        type: String, 
        required: true 
    }, // Credit card number
    cvv: { 
        type: String, 
        required: true 
    }, // CVV
    expDate: { 
        type: String, 
        required: true 
    }, // Expiration date (format: MM/YYYY)
    name: { 
        type: String, 
        required: true 
    }, // Name on the card
    itemPrice: { 
        type: Number, 
        required: true 
    }, // Total amount to be paid
    date: { 
        type: Date, 
        default: Date.now 
    }, // Date of the payment
    itemId: { 
        type: String, // ID of the item 
        required: true 
    },
    itemName: { 
        type: String, // Name of the item
        required: true 
    },
    status: { 
        type: String, 
        enum: ['accept', 'pending', 'reject'], // Allowed values for status
        default: 'pending' // Default status
    }
});

// Create Payment model
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
