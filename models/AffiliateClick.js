const mongoose = require('mongoose');

const AffiliateClickSchema = new mongoose.Schema(
  {
    content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    contentType: { type: String, required: true },
    contentTitle: { type: String, required: true },
    toolName: { type: String, required: true },
    affiliateUrl: { type: String, required: true },
    referrer: { type: String, default: '' },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AffiliateClick', AffiliateClickSchema);
