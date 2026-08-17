const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const slugify = require('../utils/slugify');
const { auth } = require('../middleware/auth');

// GET /api/categories?type=review
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const categories = await Category.find(filter).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/categories (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, description = '' } = req.body;
    if (!name || !type) return res.status(400).json({ message: 'name and type are required' });

    const slug = slugify(name);
    const exists = await Category.findOne({ slug, type });
    if (exists) return res.status(409).json({ message: 'Category already exists for this type' });

    const category = await Category.create({ name, slug, type, description });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/categories/:id (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.body.name) updates.slug = slugify(req.body.name);
    const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!category) return res.status(404).json({ message: 'Not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/categories/:id (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
