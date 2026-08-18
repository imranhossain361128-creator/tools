const mongoose = require('mongoose');

const SchemaTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // shown in the dropdown, e.g. "Standard Review Schema"
    appliesTo: {
      type: String,
      enum: ['comparison', 'review', 'alternative', 'statistic', 'directory', 'category', 'any'],
      required: true,
      index: true,
    },
    // Raw JSON-LD text. Supports placeholders like {{title}}, {{url}}, {{toolName}}
    // which get substituted with the post/category's real data when applied.
    template: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SchemaTemplate', SchemaTemplateSchema);
