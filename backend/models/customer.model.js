const mongoose = require('mongoose');

// Customer Schema
const customerSchema = new mongoose.Schema({
  customerId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  contactNumber: { type: String, required: true, match: /^0[0-9]{9}$/ },
  password: { type: String, required: true, minlength: 6 }, // Password field added
});

// Method to compare password during login
customerSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
