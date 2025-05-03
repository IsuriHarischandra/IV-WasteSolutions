const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['Paper', 'Glass', 'Plastic', 'Metal', 'E-waste', 'Textile', 'Battery', 'Rubber', 'Wood', 'Organic'],
    required: true
  },
  quantity: { 
    type:Number,
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);