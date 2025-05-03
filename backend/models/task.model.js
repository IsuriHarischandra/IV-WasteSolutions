const mongoose = require('mongoose');

// Create a schema for the task
const taskSchema = new mongoose.Schema({
    taskId: {
        type: String,
        unique: true,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    assignedEmployeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // Reference to the Employee model
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in progress', 'completed'], // Dropdown options
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'], // Dropdown options
        default: 'medium'
    },
    dueDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true // Automatically create createdAt and updatedAt fields
});


const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
