const express = require('express');
const Payment = require('../models/payment.model'); // Adjust the path as needed
const router = express.Router();
const { body, validationResult } = require('express-validator'); // Validation library

// Middleware to validate payment data
const validatePaymentData = [
    body('customerId').notEmpty().withMessage('Customer ID is required'),
    body('creditCardNumber').isLength({ min: 16, max: 16 }).withMessage('Credit Card Number must be 16 digits'),
    body('cvv').isLength({ min: 3, max: 4 }).withMessage('CVV must be 3 or 4 digits'),
];

// Create a new payment
router.post('/', validatePaymentData, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newPayment = new Payment(req.body);
        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(400).json({ message: 'Error creating payment', error });
    }
});

// Get all payments
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments', error });
    }
});

// Get a payment by ID
router.get('/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment', error });
    }
});

// Update a payment
router.put('/:id', validatePaymentData, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(400).json({ message: 'Error updating payment', error });
    }
});

// Update payment status by ID
router.put('/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(400).json({ message: 'Error updating payment status', error });
    }
});

// Delete a payment
router.delete('/:id', async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payment', error });
    }
});

module.exports = router;
