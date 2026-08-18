import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { contentHref } from '../config/contentTypes';

export default function RelatedArticles({ type, excludeId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get('/content', { params: { type, status: 'published', limit: 4 } })
      .then((res) => setItems(res.data.items.filter((i) => i._id !== excludeId).slice(0, 3)))
      .catch(() => setItems([]));
  }, [type, excludeId]);

  if (items.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-14 border-t border-mist-200">
      <h2 className="font-display text-xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item._id}
            to={contentHref(item)}
            className="bg-white border border-mist-200 rounded-xl overflow-hidden hover:shadow-sm hover:border-battle-blue transition"
          >
            {item.featuredImage ? (
              <img src={item.featuredImage} alt="" className="w-full h-32 object-cover" />
            ) : (
              <div className="w-full h-32 bg-mist-100 flex items-center justify-center">
                <span className="text-xs text-ink-600 px-4 text-center">{item.title}</span>
              </div>
            )}
            <div className="p-4">
              <p className="text-xs text-ink-600 mb-1">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
              <p className="font-semibold text-sm leading-snug line-clamp-2">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
