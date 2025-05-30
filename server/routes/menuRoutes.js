const express = require('express');
const router = express.Router();

// ✅ Import MenuItem model
const MenuItem = require('../models/MenuItem');

const {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');

// GET all menu items
router.get('/', getMenuItems);

// POST a new menu item
router.post('/', async (req, res) => {
  try {
    // Simple role check (temporary logic until real auth is added)
    const { role } = req.body;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create items' });
    }

    const { name, category, price, ingredients, tags, available } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const newItem = new MenuItem({
      name,
      category,
      price,
      ingredients: ingredients || [],
      tags: tags || [],
      available: available !== undefined ? available : true
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error creating menu item:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT update a menu item
router.put('/:id', updateMenuItem);

// DELETE a menu item
router.delete('/:id', deleteMenuItem);

module.exports = router;
