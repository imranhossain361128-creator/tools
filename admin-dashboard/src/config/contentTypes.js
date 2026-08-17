// Mirrors backend/models/Content.js CONTENT_URL_PREFIX + adds UI metadata
export const CONTENT_TYPES = [
  {
    key: 'comparison',
    label: 'Comparisons',
    singular: 'Comparison',
    urlPrefix: '',
    example: '/mullvad-vs-nordvpn/',
    keywordHint: 'e.g. "mullvad-vs-nordvpn" (used exactly as the slug)',
    color: '#3E7BFA',
  },
  {
    key: 'review',
    label: 'Reviews',
    singular: 'Review',
    urlPrefix: '/reviews',
    example: '/reviews/semrush-review/',
    keywordHint: 'e.g. "semrush" → becomes "semrush-review"',
    color: '#22B07D',
  },
  {
    key: 'alternative',
    label: 'Alternatives',
    singular: 'Alternative',
    urlPrefix: '/alternatives',
    example: '/alternatives/semrush-alternative/',
    keywordHint: 'e.g. "semrush" → becomes "semrush-alternative"',
    color: '#FF7A33',
  },
  {
    key: 'statistic',
    label: 'Statistics',
    singular: 'Statistic',
    urlPrefix: '/statistics',
    example: '/statistics/chatgpt-statistics/',
    keywordHint: 'e.g. "chatgpt" → becomes "chatgpt-statistics"',
    color: '#A855F7',
  },
  {
    key: 'directory',
    label: 'AI Tools Directory',
    singular: 'Directory Listing',
    urlPrefix: '/ai-tools-directory',
    example: '/ai-tools-directory/claude/',
    keywordHint: 'e.g. "claude" (used exactly as the slug)',
    color: '#EF4444',
  },
];

export const getTypeConfig = (key) => CONTENT_TYPES.find((t) => t.key === key) || CONTENT_TYPES[0];
