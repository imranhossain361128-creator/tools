import { Link } from 'react-router-dom';
import { contentHref, CONTENT_TYPES } from '../config/contentTypes';
import readingTime from '../utils/readingTime';

export default function ArticleCard({ item }) {
  const date = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const authorName = item.author?.name || 'ToolsBattle Editorial Team';
  const authorInitial = authorName.charAt(0);

  return (
    <article>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[11px] font-bold text-battle-blue uppercase tracking-wide">
          {CONTENT_TYPES[item.type]?.label}
        </span>
        {item.category?.name && (
          <>
            <span className="text-battle-gold">•</span>
            <span className="text-[11px] font-bold text-battle-gold uppercase tracking-wide">
              {item.category.name}
            </span>
          </>
        )}
      </div>

      <Link to={contentHref(item)} className="block relative mb-8">
        <div className="aspect-[16/10] rounded-xl overflow-hidden bg-mist-100">
          {item.featuredImage ? (
            <img src={item.featuredImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-battle-blue/10 to-battle-gold/10">
              <span className="font-display font-extrabold text-3xl text-battle-blue/40">
                {item.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="absolute -bottom-5 left-3 w-9 h-9 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
          {authorInitial}
        </div>
      </Link>

      <Link to={contentHref(item)} className="block">
        <h2 className="font-display text-lg font-bold leading-snug hover:text-battle-blue transition-colors line-clamp-2">
          {item.title}
        </h2>
      </Link>
      <p className="text-xs font-medium text-battle-blue mt-1.5">By {authorName}</p>

      {item.excerpt && (
        <p className="text-sm text-ink-600 mt-2 line-clamp-2">{item.excerpt}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-ink-600 mt-3">
        <span>{readingTime(item.content)} min read</span>
        {item.views > 0 && <span>{item.views.toLocaleString()} reads</span>}
        <span>{date}</span>
      </div>
    </article>
  );
}
