const mongoose = require('mongoose');

// Maps content "type" to its live URL prefix on toolsbattle.com:
//   comparison  -> /{slug}                       e.g. /mullvad-vs-nordvpn/
//   review      -> /reviews/{slug}                e.g. /reviews/semrush-review/
//   alternative -> /alternatives/{slug}            e.g. /alternatives/semrush-alternative/
//   statistic   -> /statistics/{slug}              e.g. /statistics/chatgpt-statistics/
//   directory   -> /ai-tools-directory/{slug}       e.g. /ai-tools-directory/chatgpt/
const CONTENT_URL_PREFIX = {
  comparison: '',
  review: '/reviews',
  alternative: '/alternatives',
  statistic: '/statistics',
  directory: '/ai-tools-directory',
};

const ToolSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    logo: { type: String, default: '' },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    pricing: { type: String, default: '' },
    pros: [{ type: String }],
    cons: [{ type: String }],
    affiliateUrl: { type: String, default: '' },
  },
  { _id: false }
);

const ContentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['comparison', 'review', 'alternative', 'statistic', 'directory'],
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    mainKeyword: { type: String, required: true, trim: true }, // used to build the slug
    slug: { type: String, required: true, trim: true, lowercase: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' }, // rich HTML body
    featuredImage: { type: String, default: '' },
    tools: [ToolSchema], // used for comparisons (2+ tools) and single-tool reviews/directory/alternatives
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    customSchema: { type: String, default: '' }, // raw JSON-LD (or a full <script> tag) pasted by an editor
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

ContentSchema.index({ slug: 1, type: 1 }, { unique: true });

ContentSchema.virtual('url').get(function () {
  const prefix = CONTENT_URL_PREFIX[this.type] ?? '';
  return `${prefix}/${this.slug}/`;
});

ContentSchema.set('toJSON', { virtuals: true });
ContentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Content', ContentSchema);
module.exports.CONTENT_URL_PREFIX = CONTENT_URL_PREFIX;
