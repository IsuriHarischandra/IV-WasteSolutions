const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Stock = require('../models/Stock');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save images in 'uploads' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });

// Validation function
const validateProduct = (data) => {
  const { name, price, category, quantity } = data;
  if (!name || !price || !category || !quantity) {
    return 'All fields (name, price, category, quantity) are required';
  }
  if (price < 0 || quantity < 0) {
    return 'Price and quantity must be non-negative';
  }
  const validCategories = ['Paper', 'Glass', 'Plastic', 'Metal', 'E-waste', 'Textile', 'Battery', 'Rubber', 'Wood', 'Organic'];
  if (!validCategories.includes(category)) {
    return 'Invalid category';
  }
  return null;
};

// Create a new product
router.post('/create', upload.single('image'), async (req, res) => {
  try {
    const error = validateProduct(req.body);
    if (error) return res.status(400).json({ message: error });

    const { name, description, price, category, quantity } = req.body;

    // Find stock associated with the category
    const stock = await Stock.findOne({ material: category });
    if (!stock || stock.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Deduct quantity from stock
    stock.quantity -= quantity;
    await stock.save();

    // Save the new product
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      quantity,
      image: req.file ? req.file.filename : null
    });
    await newProduct.save();

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
});

// Get all products
router.get('/getAll', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Get product by ID
router.get('/getById/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
});

// Update product by ID
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const error = validateProduct(req.body);
    if (error) return res.status(400).json({ message: error });

    const { name, description, price, category, quantity } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const stock = await Stock.findOne({ material: category });
    if (!stock) return res.status(400).json({ message: 'Stock not found for the category' });

    stock.quantity += product.quantity;
    if (stock.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock for the update' });
    }
    stock.quantity -= quantity;
    await stock.save();

    // Update product fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.quantity = quantity;
    if (req.file) {
      product.image = req.file.filename; 
    }

    await product.save();
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// Delete product by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const stock = await Stock.findOne({ material: product.category });
    if (stock) {
      stock.quantity += product.quantity;
      await stock.save();
    }

    await product.remove();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

module.exports = router;
