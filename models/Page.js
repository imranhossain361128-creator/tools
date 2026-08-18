const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true }, // e.g. "about", "contact"
    content: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
  },
  { timestamps: true }
);

PageSchema.virtual('url').get(function () {
  return `/${this.slug}/`;
});
PageSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Page', PageSchema);
