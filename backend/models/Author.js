const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: '' }, // e.g. "Written by ToolsBattle Team"
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' }, // optional photo; falls back to initials
    socialLinks: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Author', AuthorSchema);
