import { Link } from 'react-router-dom';
import { contentHref, CONTENT_TYPES } from '../config/contentTypes';

export default function ArticleRow({ item, showDivider = true }) {
  const date = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={showDivider ? 'border-b border-mist-200 py-5' : 'py-5'}>
      <div className="flex items-center gap-2 text-xs text-ink-600 mb-2">
        <span>{date}</span>
        <span className="text-mist-200">•</span>
        <span className="font-medium text-battle-blue bg-battle-blue/10 px-2 py-0.5 rounded">
          {CONTENT_TYPES[item.type]?.label}
        </span>
        {item.category?.name && (
          <>
            <span className="text-mist-200">•</span>
            <span>{item.category.name}</span>
          </>
        )}
      </div>
      <Link
        to={contentHref(item)}
        className="font-display text-lg font-bold text-ink-900 hover:text-battle-blue transition-colors leading-snug"
      >
        {item.title}
      </Link>
      {item.excerpt && (
        <p className="text-sm text-ink-600 mt-1.5 line-clamp-2 max-w-2xl">{item.excerpt}</p>
      )}
    </div>
  );
}
