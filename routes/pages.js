const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const slugify = require('../utils/slugify');
const { auth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const pages = await Page.find().sort({ title: 1 });
  res.json(pages);
});

router.get('/public/:slug', async (req, res) => {
  const page = await Page.findOne({ slug: req.params.slug, status: 'published' });
  if (!page) return res.status(404).json({ message: 'Not found' });
  res.json(page);
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, content = '', metaTitle = '', metaDescription = '', status = 'published' } = req.body;
    if (!title) return res.status(400).json({ message: 'title is required' });
    const slug = slugify(title);
    const page = await Page.create({ title, slug, content, metaTitle, metaDescription, status });
    res.status(201).json(page);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'A page with this slug already exists' });
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  const updates = { ...req.body };
  if (req.body.title) updates.slug = slugify(req.body.title);
  const page = await Page.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!page) return res.status(404).json({ message: 'Not found' });
  res.json(page);
});

router.delete('/:id', auth, async (req, res) => {
  const page = await Page.findByIdAndDelete(req.params.id);
  if (!page) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
