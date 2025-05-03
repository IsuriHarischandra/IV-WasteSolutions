const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    material: {
    type: String,
    required: true,
    trim: true,
    enum: ['Paper', 'Glass', 'Plastic', 'Metal', 'E-waste', 'Textile', 'Battery', 'Rubber', 'Wood', 'Organic']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  }
});

module.exports = mongoose.model('Stock', stockSchema);