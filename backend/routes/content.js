const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const slugify = require('../utils/slugify');
const { auth } = require('../middleware/auth');

const VALID_TYPES = ['comparison', 'review', 'alternative', 'statistic', 'directory'];

// Builds the slug according to the site's real URL conventions:
//   comparison -> "tool-a-vs-tool-b"            (mainKeyword used as-is)
//   review     -> "{mainKeyword}-review"
//   alternative-> "{mainKeyword}-alternative"
//   statistic  -> "{mainKeyword}-statistics"
//   directory  -> "{mainKeyword}"
function buildSlug(type, mainKeyword) {
  const base = slugify(mainKeyword);
  switch (type) {
    case 'review':
      return base.endsWith('-review') ? base : `${base}-review`;
    case 'alternative':
      return base.endsWith('-alternative') ? base : `${base}-alternative`;
    case 'statistic':
      return base.endsWith('-statistics') ? base : `${base}-statistics`;
    default:
      return base;
  }
}

// GET /api/content?type=review&status=published&category=<id>&search=&page=1&limit=20
router.get('/', async (req, res) => {
  try {
    const { type, status, category, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (type) {
      if (!VALID_TYPES.includes(type)) return res.status(400).json({ message: 'Invalid type' });
      filter.type = type;
    }
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Content.find(filter)
        .populate('category', 'name slug type')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Content.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/content/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Content.findById(req.params.id).populate('category', 'name slug type');
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: GET /api/content/public/:type/:slug  (for the live site to render a page)
router.get('/public/:type/:slug', async (req, res) => {
  try {
    const { type, slug } = req.params;
    const item = await Content.findOneAndUpdate(
      { type, slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('category', 'name slug type');
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/content  (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { type, title, mainKeyword, tools = [] } = req.body;
    if (!VALID_TYPES.includes(type)) return res.status(400).json({ message: 'Invalid type' });
    if (!title || !mainKeyword) return res.status(400).json({ message: 'title and mainKeyword are required' });

    const slug = buildSlug(type, mainKeyword);
    const exists = await Content.findOne({ type, slug });
    if (exists) return res.status(409).json({ message: `A ${type} with this slug already exists: ${slug}` });

    const item = await Content.create({
      ...req.body,
      slug,
      tools,
      author: req.user.id,
      publishedAt: req.body.status === 'published' ? new Date() : undefined,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/content/:id  (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const existing = await Content.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });

    const updates = { ...req.body };
    if (req.body.mainKeyword) {
      updates.slug = buildSlug(existing.type, req.body.mainKeyword);
    }
    if (req.body.status === 'published' && existing.status !== 'published') {
      updates.publishedAt = new Date();
    }

    const item = await Content.findByIdAndUpdate(req.params.id, updates, { new: true }).populate(
      'category',
      'name slug type'
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/content/:id  (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Content.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
