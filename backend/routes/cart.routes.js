const express = require('express');
const mongoose = require('mongoose');
const Cart = require('../models/Cart'); // Assuming Cart model is in models folder
const Product = require('../models/Product'); // Product model for validation

const router = express.Router();

// Validate product exists in the request
const validateProductIds = async (productIds) => {
    const products = await Promise.all(productIds.map(productId => Product.findById(productId)));
    for (let i = 0; i < products.length; i++) {
        if (!products[i]) {
            return `Product with ID ${productIds[i]} not found`;
        }
    }
    return null;
};

// Create Cart
router.post('/create', async (req, res) => {
    try {
        const { userId, items } = req.body;

        // Validate input
        if (!userId || !Array.isArray(items) || items.length === 0 || !items.every(item => item.productId)) {
            return res.status(400).json({ message: 'Invalid input. Please provide userId and valid items.' });
        }

        // Validate all products exist
        const productIds = items.map(item => item.productId);
        const validationError = await validateProductIds(productIds);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        let cart = await Cart.findOne({ userId });
        
        if (cart) {
            items.forEach(item => {
                const existingItem = cart.items.find(cartItem => 
                    cartItem.productId.equals(mongoose.Types.ObjectId(item.productId))
                );
                if (!existingItem) {
                    cart.items.push({ productId: item.productId });
                }
            });

            // Save the updated cart
            await cart.save();

            return res.status(200).json({ message: 'Items added to existing cart', cart });
        } else {
            // Create and save new cart if none exists
            cart = new Cart({
                userId,
                items: items.map(item => ({ productId: item.productId }))
            });

            await cart.save();

            return res.status(201).json({ message: 'Cart created successfully', cart });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating or updating cart', error: error.message });
    }
});

module.exports = router;
