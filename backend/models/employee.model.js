const mongoose = require('mongoose');

// Employee Schema
const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true },
  name: { type: String, required: true },
  nic: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  age: { type: Number, required: true, min: 18, max: 65 }, // Adjust the range as needed
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  designation: { 
    type: String, 
    enum: [
      'Manager', 
      'HR Manager', 
      'Finance Manager', 
      'Waste Sorter', 
      'Mass and Hazardous Waste Manager', 
      'Driver'
    ], 
    required: true 
  },
  emergencyContactNumber: { type: String, required: true },
  emergencyContactName: { type: String, required: true },
  emergencyEmail: { type: String, required: true },
  password: { type: String, required: true }, // Added password field
});

// Create Employee model
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
