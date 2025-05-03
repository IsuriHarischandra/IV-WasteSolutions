const express = require('express');
const router = express.Router();
const Task = require('../models/task.model'); // Import the Task model
const Employee = require('../models/employee.model'); // Import the Employee model

// Create a new task
// Create a new task
router.post('/', async (req, res) => {
    try {
        const { title, description, assignedEmployeeId, status, priority, dueDate } = req.body;

        // Validate if the assigned employee exists
        const employee = await Employee.findById(assignedEmployeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Generate taskId (example logic for auto-increment)
        const lastTask = await Task.findOne().sort({ _id: -1 }); // Find the last created task
        let newId = 1; // Default for the first task

        // Check if there was a previous task
        if (lastTask && lastTask.taskId && lastTask.taskId.startsWith("Task")) {
            const lastTaskIdNumber = parseInt(lastTask.taskId.slice(4)); // Extract the numeric part after "Task"
            if (!isNaN(lastTaskIdNumber)) {
                newId = lastTaskIdNumber + 1; // Increment the number
            }
        }

        const taskId = `Task${newId.toString().padStart(3, '0')}`; // Ensure taskId has 3 digits, e.g., "Task001"

        const newTask = new Task({ taskId, title, description, assignedEmployeeId, status, priority, dueDate });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedEmployeeId', 'name email'); // Populate employee data
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single task by ID
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedEmployeeId', 'name email');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    console.log('Received data for update:', req.body); // Log incoming request body
    try {
        const { title, description, assignedEmployeeId, status, priority, dueDate } = req.body;

        // Validate if the assigned employee exists
        if (assignedEmployeeId) {
            const employee = await Employee.findById(assignedEmployeeId);
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, assignedEmployeeId, status, priority, dueDate },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error); // Log error details
        res.status(400).json({ message: error.message });
    }
});


// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
