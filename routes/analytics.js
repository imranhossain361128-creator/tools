const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const AffiliateClick = require('../models/AffiliateClick');
const { auth } = require('../middleware/auth');

// GET /api/analytics/overview  (protected) -- powers the dashboard home page
router.get('/overview', auth, async (req, res) => {
  try {
    const [
      counts,
      publishedCount,
      draftCount,
      topViewed,
      totalViewsAgg,
      clicksLast30,
    ] = await Promise.all([
      Content.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
      Content.countDocuments({ status: 'published' }),
      Content.countDocuments({ status: 'draft' }),
      Content.find().sort({ views: -1 }).limit(5).select('title type views slug'),
      Content.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      AffiliateClick.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    const byType = { comparison: 0, review: 0, alternative: 0, statistic: 0, directory: 0 };
    counts.forEach((c) => {
      byType[c._id] = c.count;
    });

    res.json({
      byType,
      totalContent: Object.values(byType).reduce((a, b) => a + b, 0),
      publishedCount,
      draftCount,
      totalViews: totalViewsAgg[0]?.total || 0,
      topViewed,
      clicksLast30,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
