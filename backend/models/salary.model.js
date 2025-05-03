const mongoose = require('mongoose');

// Salary Schema
const salarySchema = new mongoose.Schema({
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId, // Reference to Employee model
        required: true,
        ref: 'Employee'

    },
    basicSalary: { 
        type: Number, 
        required: true 
    },
    epf: { 
        type: Number, 
        required: true 
    },
    etf: { 
        type: Number, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

// Calculate EPF and ETF based on basic salary
salarySchema.methods.calculateEPF = function() {
    // Assuming EPF contribution is 12% of the basic salary
    this.epf = this.basicSalary * 0.12;
};

salarySchema.methods.calculateETF = function() {
    // Assuming ETF contribution is 3% of the basic salary
    this.etf = this.basicSalary * 0.03;
};

// Create Salary model
const Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary;
