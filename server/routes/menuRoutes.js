const express = require('express');
const router = express.Router();
const {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');

router.get('/', getMenuItems);
router.post('/', async (req, res) => {
  try {
    // Simulate simple role check from frontend (replace with real auth later)
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
      available: available !== undefined ? available : true,
      role: 'admin' ,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error creating menu item:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);

module.exports = router;
