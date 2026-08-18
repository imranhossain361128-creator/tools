export const CONTENT_TYPES = {
  comparison: { label: 'Comparison', urlPrefix: '' },
  review: { label: 'Review', urlPrefix: '/reviews' },
  alternative: { label: 'Alternative', urlPrefix: '/alternatives' },
  statistic: { label: 'Statistics', urlPrefix: '/statistics' },
  directory: { label: 'AI Tools Directory', urlPrefix: '/ai-tools-directory' },
};

export function contentHref(item) {
  const prefix = CONTENT_TYPES[item.type]?.urlPrefix ?? '';
  return `${prefix}/${item.slug}/`;
}
