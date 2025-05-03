const express = require('express');
const router = express.Router();
const Salary = require('../models/salary.model'); // Adjust the path as needed

// Create a new salary record
router.post('/', async (req, res) => {
    const { employeeId, basicSalary } = req.body;

    try {
        const newSalary = new Salary({ employeeId, basicSalary });
        newSalary.calculateEPF(); // Calculate EPF
        newSalary.calculateETF(); // Calculate ETF
        await newSalary.save();
        res.status(201).json(newSalary);
    } catch (error) {
        res.status(400).json({ message: 'Error creating salary record', error });
    }
});

// Get all salary records
router.get('/', async (req, res) => {
    try {
        const salaries = await Salary.find().populate('employeeId', 'name email'); // Populate employee details if needed
        res.status(200).json(salaries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching salary records', error });
    }
});

// Get a salary record by ID
router.get('/:id', async (req, res) => {
    try {
        const salary = await Salary.findById(req.params.id).populate('employeeId', 'name email');
        if (!salary) {
            return res.status(404).json({ message: 'Salary record not found' });
        }
        res.status(200).json(salary);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching salary record', error });
    }
});

// Update a salary record
router.put('/:id', async (req, res) => {
    const { basicSalary } = req.body;

    try {
        const salary = await Salary.findById(req.params.id);
        if (!salary) {
            return res.status(404).json({ message: 'Salary record not found' });
        }
        salary.basicSalary = basicSalary;
        salary.calculateEPF(); // Recalculate EPF
        salary.calculateETF(); // Recalculate ETF
        await salary.save();
        res.status(200).json(salary);
    } catch (error) {
        res.status(400).json({ message: 'Error updating salary record', error });
    }
});

// Delete a salary record
router.delete('/:id', async (req, res) => {
    try {
        const salary = await Salary.findByIdAndDelete(req.params.id);
        if (!salary) {
            return res.status(404).json({ message: 'Salary record not found' });
        }
        res.status(200).json({ message: 'Salary record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting salary record', error });
    }
});

module.exports = router;
