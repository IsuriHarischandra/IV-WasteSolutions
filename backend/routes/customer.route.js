// routes/customer.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/customer.model'); // Import the Customer model

// Register Customer Route
router.post('/register', async (req, res) => {
    const { name, address, email, contactNumber, password } = req.body;

    console.log(req.body);

    // Validation logic
    // if (!/^[a-zA-Z\s]+$/.test(name)) {
    //     return res.status(400).json({ error: 'Name cannot contain special characters or numbers' });
    // }
    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    //     return res.status(400).json({ error: 'Invalid email format' });
    // }
    // if (!/^0[0-9]{9}$/.test(contactNumber)) {
    //     return res.status(400).json({ error: 'Contact number must start with 0 and contain 10 digits' });
    // }
    // if (password.length < 6) {
    //     return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    // }

    try {
        // Generate customerId (example logic for auto-increment)
        const lastCustomer = await Customer.findOne().sort({ _id: -1 });
        const newId = lastCustomer ? parseInt(lastCustomer.customerId.slice(3)) + 1 : 1;
        const customerId = `cus${newId.toString().padStart(4, '0')}`;

        // Create a new customer object
        const newCustomer = new Customer({
            customerId,
            name,
            address,
            email,
            contactNumber,
            password // Storing the password directly (insecure for production)
        });

        // Save the new customer
        await newCustomer.save();
        res.status(201).json({ message: 'Customer registered successfully', customerId });
    } catch (error) {
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login Customer Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find customer by email
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Check if password matches (insecure way for demo)
        if (customer.password !== password) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Store customer info in session
        req.session.customerId = customer.customerId; // Save customerId in session
        req.session.email = customer.email;

        // Login successful
        res.status(200).json({ message: 'Login successful', customer });
    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Logout Customer Route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});

// GET all customers
router.get('/all', async (req, res) => {
    try {
        const customers = await Customer.find(); // Fetch all customers
        res.status(200).json(customers); // Send back the customers
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET a customer by customerId
router.get('/profile/:customerId', async (req, res) => {
    const { customerId } = req.params; // Get customerId from route parameters

    try {
        const customer = await Customer.findOne({ customerId }); // Find customer by customerId
        if (!customer) {
            return res.status(404).send({ error: 'Customer not found' });
        }
        res.send(customer); // Send customer details back to the client
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).send({ error: 'Server error' });
    }
});

// GET a customer by customerId
router.get('/getbyid/:id', async (req, res) => {
    const { id } = req.params; // Get customerId from route parameters

    try {
        const customer = await Customer.findById(id); // Find customer by customerId
        if (!customer) {
            return res.status(404).send({ error: 'Customer not found' });
        }
        res.send(customer); // Send customer details back to the client
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).send({ error: 'Server error' });
    }
});

// UPDATE a customer by customerId
router.put('/adminupdate/:id', async (req, res) => {
    const { id } = req.params;
    const { name, address, email, contactNumber, password } = req.body;

    // Validation logic
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return res.status(400).json({ error: 'Name cannot contain special characters or numbers' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!/^0[0-9]{9}$/.test(contactNumber)) {
        return res.status(400).json({ error: 'Contact number must start with 0 and contain 10 digits' });
    }

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            { name, address, email, contactNumber, password }, // Update fields
            { new: true } // Return the updated document
        );

        if (!updatedCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ error: 'Server error during update' });
    }
});

/// DELETE a customer by customerId
router.delete('/profile/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id); // Corrected line
        if (!deletedCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ error: 'Server error during deletion' });
    }
});


module.exports = router;
