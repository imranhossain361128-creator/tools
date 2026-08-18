import { Link } from 'react-router-dom';
import { contentHref } from '../config/contentTypes';

export default function ToolCard({ item }) {
  const tool = item.tools?.[0];

  return (
    <Link
      to={contentHref(item)}
      className="group bg-white border border-mist-200 rounded-xl overflow-hidden hover:shadow-md hover:border-battle-blue transition-all flex flex-col"
    >
      <div className="aspect-[16/10] bg-mist-100 overflow-hidden">
        {item.featuredImage ? (
          <img
            src={item.featuredImage}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-battle-blue/10 to-battle-gold/10">
            <span className="font-display font-extrabold text-3xl text-battle-blue/40">
              {(tool?.name || item.title).charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="font-semibold text-sm leading-snug line-clamp-2">{item.title}</p>
        {item.excerpt && (
          <p className="text-xs text-ink-600 mt-1.5 line-clamp-2 flex-1">{item.excerpt}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          {item.category?.name ? (
            <span className="text-[11px] font-medium text-battle-blue bg-battle-blue/10 px-2 py-1 rounded-full">
              {item.category.name}
            </span>
          ) : (
            <span />
          )}
          <span className="text-xs font-semibold text-battle-blue opacity-0 group-hover:opacity-100 transition-opacity">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
