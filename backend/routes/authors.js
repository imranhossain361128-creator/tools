const express = require('express');
const router = express.Router();
const Author = require('../models/Author');
const { auth } = require('../middleware/auth');

// GET /api/authors — public, powers author dropdowns and public byline display
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find().sort({ name: 1 });
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/authors (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });
    const author = await Author.create(req.body);
    res.status(201).json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/authors/:id (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!author) return res.status(404).json({ message: 'Not found' });
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/authors/:id (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
