const express = require('express');
const router = express.Router();
const AffiliateClick = require('../models/AffiliateClick');
const Content = require('../models/Content');
const { auth } = require('../middleware/auth');

// POST /api/affiliate/click  -- public, called from the live site when a user clicks an affiliate button
router.post('/click', async (req, res) => {
  try {
    const { contentId, toolName, affiliateUrl } = req.body;
    if (!contentId || !toolName || !affiliateUrl) {
      return res.status(400).json({ message: 'contentId, toolName, affiliateUrl are required' });
    }
    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json({ message: 'Content not found' });

    await AffiliateClick.create({
      content: content._id,
      contentType: content.type,
      contentTitle: content.title,
      toolName,
      affiliateUrl,
      referrer: req.get('referer') || '',
      ip: req.ip,
      userAgent: req.get('user-agent') || '',
    });

    res.status(201).json({ message: 'Click recorded' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/affiliate/stats  (protected) -- for the admin dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000);

    const [totalClicks, byTool, byContent, timeline, recent] = await Promise.all([
      AffiliateClick.countDocuments({ createdAt: { $gte: since } }),
      AffiliateClick.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$toolName', clicks: { $sum: 1 } } },
        { $sort: { clicks: -1 } },
        { $limit: 10 },
      ]),
      AffiliateClick.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: { content: '$content', title: '$contentTitle' }, clicks: { $sum: 1 } } },
        { $sort: { clicks: -1 } },
        { $limit: 10 },
      ]),
      AffiliateClick.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            clicks: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      AffiliateClick.find({ createdAt: { $gte: since } }).sort({ createdAt: -1 }).limit(20),
    ]);

    res.json({ totalClicks, byTool, byContent, timeline, recent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
