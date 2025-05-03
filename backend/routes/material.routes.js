const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Material = require('../models/Material'); 
const Stock = require('../models/Stock'); 
const router = express.Router();

// Create Material
router.post(
  '/create',
  [
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('category')
      .isIn(['Paper', 'Glass', 'Plastic', 'Metal', 'E-waste', 'Textile', 'Battery', 'Rubber', 'Wood', 'Organic'])
      .withMessage('Invalid category'),
    body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
    body('unit').isIn(['Kg', 'Tonnes', 'Pieces']).withMessage('Invalid unit'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    try {
      const { name, category, quantity, unit } = req.body;
      const newMaterial = new Material({ name, category, quantity, unit });
      await newMaterial.save();
      res.status(201).json(newMaterial);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);


// Get All Materials
router.get('/getAll', async (req, res) => {
  try {
    const materials = await Material.find();
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Material by ID
router.get(
  '/getById/:id',
  [param('id').isMongoId().withMessage('Invalid material ID')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const material = await Material.findById(req.params.id);
      if (!material) {
        return res.status(404).json({ error: 'Material not found' });
      }
      res.status(200).json(material);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update Material by ID
router.put(
    '/updateById/:id',
    [
      param('id').isMongoId().withMessage('Invalid material ID'),
      body('name').optional().isString().trim().notEmpty().withMessage('Name is required'),
      body('category')
        .optional()
        .isIn(['Paper', 'Glass', 'Plastic', 'Metal', 'E-waste', 'Textile', 'Battery', 'Rubber', 'Wood', 'Organic'])
        .withMessage('Invalid category'),
      body('quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
      body('unit').optional().isIn(['Kg', 'Tonnes', 'Pieces']).withMessage('Invalid unit'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const materialId = req.params.id;
        const { category, quantity, unit } = req.body;
  
        // Find the material to check its status
        const material = await Material.findById(materialId);
        if (!material) {
          return res.status(404).json({ error: 'Material not found' });
        }
  
        // Check if the material status is 'Recycled'
        if (material.status != 'Recycled' &&req.body.status=='Recycled') {
            let stock = await Stock.findOne({ material: category });
            const quantityInKg = convertToKg(quantity, unit);
      
            if (!stock) {
              stock = new Stock({ material: category, quantity: quantityInKg });
              await stock.save();
            } else {
              stock.quantity += quantityInKg;
              await stock.save();
            }
        }
        const updatedMaterial = await Material.findByIdAndUpdate(materialId, req.body, { new: true });
        res.status(200).json(updatedMaterial);
      } catch (error) {
        console.error(error); // For debugging
        res.status(500).json({ error: 'Server error' });
      }
    }
  );
  
  function convertToKg(quantity, unit) {
    if (unit === 'Kg') {
      return quantity;
    } else if (unit === 'Tonnes') {
      return quantity * 1000; 
    } else if (unit === 'Pieces') {
      const averageWeightPerPieceInKg = 1;
      return quantity * averageWeightPerPieceInKg;
    }
    return quantity; 
  }

// Delete Material by ID
router.delete(
  '/deleteById/:id',
  [param('id').isMongoId().withMessage('Invalid material ID')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const deletedMaterial = await Material.findByIdAndDelete(req.params.id);
      if (!deletedMaterial) {
        return res.status(404).json({ error: 'Material not found' });
      }
      res.status(200).json({ message: 'Material deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' }); 
    }
  }
);

router.get('/stock/', async (req, res) => {
    try {
      const stocks = await Stock.find();
      res.status(200).json(stocks);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });
  
  // Update stock by ID
  router.put(
    '/updateById/:id',
    [
      param('id').isMongoId().withMessage('Invalid stock ID'),
      body('quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const updatedStock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStock) {
          return res.status(404).json({ error: 'Stock not found' });
        }
        res.status(200).json(updatedStock);
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    }
  );

module.exports = router;
