const mongoose = require('mongoose');

const ProductReviewSchema = new mongoose.Schema(
  {
    content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: '', trim: true },
    body: { type: String, default: '' },
    pros: { type: String, default: '' },
    cons: { type: String, default: '' },

    reviewerName: { type: String, default: 'Verified Reviewer', trim: true },
    reviewerRole: { type: String, default: '' }, // e.g. "Marketing Manager"
    companyIndustry: { type: String, default: '' }, // e.g. "Marketing and Advertising"
    companySize: { type: String, default: '' }, // e.g. "11-50 employees"

    source: { type: String, default: 'ToolsBattle' }, // e.g. "Imported from Capterra"
    sourceUrl: { type: String, default: '' }, // link back to the original review, if imported
    helpfulCount: { type: Number, default: 0 },

    publishedAt: { type: Date, default: Date.now }, // the review's original date (for imported content)
  },
  { timestamps: true }
);

// Powers: "all reviews for this product, filtered by star rating, sorted by date" at high volume
ProductReviewSchema.index({ content: 1, rating: 1, publishedAt: -1 });
ProductReviewSchema.index({ content: 1, publishedAt: -1 });
ProductReviewSchema.index({ content: 1, helpfulCount: -1 });

module.exports = mongoose.model('ProductReview', ProductReviewSchema);
