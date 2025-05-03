const mongoose = require('mongoose');
const Product = require('./Product');

const cartSchema = new mongoose.Schema({
  userId: {
    type: Number, 
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true
      }
    }
  ],
  totalPrice: {
    type: Number,
    default: 0 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

cartSchema.pre('save', async function (next) {
  const cart = this;
  cart.updatedAt = Date.now();

  let totalPrice = 0;
  
  for (const item of cart.items) {
    const product = await Product.findById(item.productId); 
    if (product) {
      totalPrice += product.price; 
    }
  }

  cart.totalPrice = totalPrice;

  next();
});

module.exports = mongoose.model('Cart', cartSchema);
