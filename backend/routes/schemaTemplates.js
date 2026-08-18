const express = require('express');
const router = express.Router();
const SchemaTemplate = require('../models/SchemaTemplate');
const { auth } = require('../middleware/auth');

// GET /api/schema-templates?appliesTo=review — public (admin dashboard reads these without extra auth friction)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.appliesTo) filter.appliesTo = { $in: [req.query.appliesTo, 'any'] };
    const templates = await SchemaTemplate.find(filter).sort({ name: 1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/schema-templates (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { name, appliesTo, template } = req.body;
    if (!name || !appliesTo || !template) {
      return res.status(400).json({ message: 'name, appliesTo, and template are required' });
    }
    const doc = await SchemaTemplate.create({ name, appliesTo, template });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/schema-templates/:id (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const doc = await SchemaTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/schema-templates/:id (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const doc = await SchemaTemplate.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
