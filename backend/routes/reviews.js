const express = require('express');
const router = express.Router();
const ProductReview = require('../models/ProductReview');
const Content = require('../models/Content');
const { auth } = require('../middleware/auth');

const SORT_OPTIONS = {
  newest: { publishedAt: -1 },
  oldest: { publishedAt: 1 },
  highest: { rating: -1, publishedAt: -1 },
  lowest: { rating: 1, publishedAt: -1 },
  helpful: { helpfulCount: -1, publishedAt: -1 },
};

// GET /api/reviews?content=<id>&rating=5&sort=newest&page=1&limit=20
// Public. Built to stay fast even with hundreds of thousands of reviews per product,
// since it only ever touches the indexed (content, rating, publishedAt) fields.
router.get('/', async (req, res) => {
  try {
    const { content, rating, sort = 'newest', page = 1, limit = 20 } = req.query;
    if (!content) return res.status(400).json({ message: 'content (id) is required' });

    const filter = { content };
    if (rating) filter.rating = Number(rating);

    const skip = (Number(page) - 1) * Number(limit);
    const sortSpec = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;

    const [items, total] = await Promise.all([
      ProductReview.find(filter).sort(sortSpec).skip(skip).limit(Number(limit)),
      ProductReview.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reviews/distribution?content=<id>
// Public. Rating breakdown (count + % per star) and the average — powers the histogram bars.
// Uses a single aggregation pass so it stays cheap even at very high review counts.
router.get('/distribution', async (req, res) => {
  try {
    const { content } = req.query;
    if (!content) return res.status(400).json({ message: 'content (id) is required' });

    const rows = await ProductReview.aggregate([
      { $match: { content: new (require('mongoose').Types.ObjectId)(content) } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
    ]);

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    rows.forEach((r) => {
      counts[r._id] = r.count;
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const average = total
      ? Object.entries(counts).reduce((sum, [star, count]) => sum + Number(star) * count, 0) / total
      : 0;

    res.json({
      total,
      average: Math.round(average * 10) / 10,
      breakdown: [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: counts[star],
        percent: total ? Math.round((counts[star] / total) * 100) : 0,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reviews (protected) — add a single review
router.post('/', auth, async (req, res) => {
  try {
    const { content, rating } = req.body;
    if (!content || !rating) return res.status(400).json({ message: 'content and rating are required' });

    const exists = await Content.findById(content);
    if (!exists) return res.status(404).json({ message: 'Content not found' });

    const review = await ProductReview.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reviews/bulk (protected) — import many reviews at once
// Body: { content: "<contentId>", reviews: [{ rating, title, body, pros, cons, reviewerName, ... }, ...] }
// Designed for pasting in reviews copied from other sites — insertMany is fast even for
// thousands of rows in one request. For truly massive imports (50k+), call this in batches
// of a few thousand from your import script rather than one giant request.
router.post('/bulk', auth, async (req, res) => {
  try {
    const { content, reviews } = req.body;
    if (!content || !Array.isArray(reviews) || reviews.length === 0) {
      return res.status(400).json({ message: 'content and a non-empty reviews array are required' });
    }

    const exists = await Content.findById(content);
    if (!exists) return res.status(404).json({ message: 'Content not found' });

    const docs = reviews
      .filter((r) => r.rating)
      .map((r) => ({
        content,
        rating: Number(r.rating),
        title: r.title || '',
        body: r.body || '',
        pros: r.pros || '',
        cons: r.cons || '',
        reviewerName: r.reviewerName || 'Verified Reviewer',
        reviewerRole: r.reviewerRole || '',
        companyIndustry: r.companyIndustry || '',
        companySize: r.companySize || '',
        source: r.source || 'Imported',
        sourceUrl: r.sourceUrl || '',
        publishedAt: r.publishedAt ? new Date(r.publishedAt) : new Date(),
      }));

    const result = await ProductReview.insertMany(docs, { ordered: false });
    res.status(201).json({ inserted: result.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/reviews/:id (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await ProductReview.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
