const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Paper', 'Glass', 'Plastic', 'Metal', 'E-waste', 'Textile', 'Battery', 'Rubber', 'Wood', 'Organic'],
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['Kg', 'Tonnes', 'Pieces'],
    default: 'Kg' 
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
status: { 
    type: String,
enum: ['Processing', 'Melted', 'Recycled','Disposed'], 
    default: 'Processing' 
  } 
});

module.exports = mongoose.model('Material', materialSchema);