import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { contentHref } from '../config/contentTypes';

export default function PopularWidget() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get('/content', { params: { status: 'published', limit: 5 } })
      .then((res) => setItems([...res.data.items].sort((a, b) => b.views - a.views).slice(0, 4)))
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="bg-white border border-mist-200 rounded-2xl p-5">
      <h3 className="font-display font-bold text-sm mb-4">Popular right now</h3>
      <div className="space-y-4">
        {items.map((item) => {
          const date = new Date(item.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
          return (
            <Link key={item._id} to={contentHref(item)} className="flex items-start gap-3 group">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-mist-100 shrink-0">
                {item.featuredImage ? (
                  <img src={item.featuredImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-battle-blue/10 to-battle-gold/10">
                    <span className="font-display font-bold text-sm text-battle-blue/40">
                      {item.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug group-hover:text-battle-blue transition-colors line-clamp-2">
                  {item.title}
                </p>
                <p className="text-xs text-ink-600 mt-1">{date}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
