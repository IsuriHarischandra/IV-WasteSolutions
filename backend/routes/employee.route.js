const express = require('express');
const router = express.Router();
const Employee = require('../models/employee.model'); // Adjust the path as necessary

// Create an Employee Route
router.post('/add', async (req, res) => {
    const {
        name,
        nic,
        email,
        address,
        contactNumber,
        age,
        gender,
        designation,
        emergencyContactNumber,
        emergencyContactName,
        emergencyEmail,
        password, // Capture password from the request body
    } = req.body;

    // Validation logic
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return res.status(400).json({ error: 'Name cannot contain special characters or numbers' });
    }
    if (!/^(?!.*[o])([0-9]{12}|[0-9]{9}[V])$/.test(nic)) {
        return res.status(400).json({ error: 'Invalid NIC format' });
    }
    if (!/^0[0-9]{9}$/.test(contactNumber)) {
        return res.status(400).json({ error: 'Contact number must start with 0 and contain 10 digits' });
    }
    if (age < 18 || age > 65) {
        return res.status(400).json({ error: 'Age must be between 18 and 65' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emergencyEmail)) {
        return res.status(400).json({ error: 'Invalid emergency email format' });
    }
    if (!password || password.length < 6) { // Simple validation for password length
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        // Generate employeeId (example logic for auto-increment)
        const lastEmployee = await Employee.findOne().sort({ _id: -1 });
        const newId = lastEmployee ? parseInt(lastEmployee.employeeId.slice(3)) + 1 : 1; // Extract numeric part and increment
        const employeeId = `Emp${newId.toString().padStart(3, '0')}`; // Create employeeId

        // Create a new employee object
        const newEmployee = new Employee({
            employeeId, // Include the generated employeeId
            name,
            nic,
            email,
            address,
            contactNumber,
            age,
            gender,
            designation,
            emergencyContactNumber,
            emergencyContactName,
            emergencyEmail,
            password, // Store the password directly (not recommended)
        });

        // Save the new employee
        await newEmployee.save();
        res.status(201).json({ message: 'Employee added successfully', employeeId });
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ error: 'Server error during employee creation' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the employee by email
        const employee = await Employee.findOne({ email });
        
        // Check if the employee exists and the password matches
        if (employee && employee.password === password) {
            // Here you can create a session or return a token (if applicable)
            return res.status(200).json({ message: 'Login successful', employee });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});


// Get all Employees Route
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Server error while fetching employees' });
    }
});

// Get Employee by ID Route
router.get('/get/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await Employee.findById(id); // Fetch employee by MongoDB ID (_id field)
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee); // Return employee details as JSON
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ error: 'Server error while fetching employee' });
    }
});


// Update Employee Route
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {
        name,
        nic,
        email,
        address,
        contactNumber,
        age,
        gender,
        designation,
        emergencyContactNumber,
        emergencyContactName,
        emergencyEmail,
    } = req.body;

    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            {
                name,
                nic,
                email,
                address,
                contactNumber,
                age,
                gender,
                designation,
                emergencyContactNumber,
                emergencyContactName,
                emergencyEmail,
            },
            { new: true } // Return the updated document
        );

        if (!updatedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json({ message: 'Employee updated successfully', updatedEmployee });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ error: 'Server error while updating employee' });
    }
});

// Delete Employee Route
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEmployee = await Employee.findByIdAndDelete(id);
        if (!deletedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Server error while deleting employee' });
    }
});

module.exports = router;
