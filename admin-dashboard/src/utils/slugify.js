export default function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Mirrors backend/routes/content.js buildSlug — used only to preview the
// live URL in the dashboard before saving.
export function buildSlug(type, mainKeyword) {
  const base = slugify(mainKeyword);
  switch (type) {
    case 'review':
      return base.endsWith('-review') ? base : `${base}-review`;
    case 'alternative':
      return base.endsWith('-alternative') ? base : `${base}-alternative`;
    case 'statistic':
      return base.endsWith('-statistics') ? base : `${base}-statistics`;
    default:
      return base;
  }
}
