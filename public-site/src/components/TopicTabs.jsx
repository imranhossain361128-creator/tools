import { Link } from 'react-router-dom';
import { CONTENT_TYPES } from '../config/contentTypes';

const TOPICS = [
  { key: 'all', label: 'All topics', href: '/blog' },
  ...Object.entries(CONTENT_TYPES).map(([key, cfg]) => ({
    key,
    label: cfg.label,
    href: `/blog/${key}`,
  })),
];

export default function TopicTabs({ active = 'all' }) {
  return (
    <div className="border-b border-mist-200 bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {TOPICS.map((t) => (
            <Link
              key={t.key}
              to={t.href}
              className={`shrink-0 text-sm font-medium px-3.5 py-2.5 rounded-md transition-colors ${
                active === t.key
                  ? 'text-battle-blue bg-battle-blue/10'
                  : 'text-ink-600 hover:text-ink-900 hover:bg-mist-50'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
