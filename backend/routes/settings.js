const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { auth } = require('../middleware/auth');

const SINGLETON_ID = 'site-settings';

async function getOrCreateSettings() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
}

// GET /api/settings — public, powers the public site's header/footer/hero/FAQ
router.get('/', async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/settings — protected, used by the admin dashboard
router.put('/', auth, async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    Object.assign(settings, req.body);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
module.exports.SINGLETON_ID = SINGLETON_ID;
