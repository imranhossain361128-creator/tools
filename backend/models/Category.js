const mongoose = require('mongoose');

// Maps content "type" to how its category URL is prefixed, matching
// toolsbattle.com's live URL structure:
//   comparison -> /category/{slug}
//   review     -> /category/{slug}
//   alternative-> /alternatives/category/{slug}
//   statistic  -> /statistics/category/{slug}
//   directory  -> /ai-tools-directory/category/{slug}
const CATEGORY_URL_PREFIX = {
  comparison: '/category',
  review: '/category',
  alternative: '/alternatives/category',
  statistic: '/statistics/category',
  directory: '/ai-tools-directory/category',
};

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    type: {
      type: String,
      enum: ['comparison', 'review', 'alternative', 'statistic', 'directory'],
      required: true,
    },
    description: { type: String, default: '' },
    customSchema: { type: String, default: '' }, // raw JSON-LD (or a full <script> tag) for this category's page
  },
  { timestamps: true }
);

CategorySchema.index({ slug: 1, type: 1 }, { unique: true });

CategorySchema.virtual('url').get(function () {
  const prefix = CATEGORY_URL_PREFIX[this.type] || '/category';
  return `${prefix}/${this.slug}/`;
});

CategorySchema.set('toJSON', { virtuals: true });
CategorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Category', CategorySchema);
module.exports.CATEGORY_URL_PREFIX = CATEGORY_URL_PREFIX;
