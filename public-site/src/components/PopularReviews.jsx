import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Stars from './Stars';
import { contentHref } from '../config/contentTypes';

export default function PopularReviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/content', { params: { type: 'review', status: 'published', limit: 3 } })
      .then((res) => setItems(res.data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display text-xl font-bold">Popular Software Reviews</h2>
        <Link to="/reviews" className="text-sm font-medium text-battle-blue">
          View all reviews →
        </Link>
      </div>
      <p className="text-ink-600 text-sm mb-6">In-depth, honest reviews from our editorial team.</p>

      {loading && <p className="text-sm text-ink-600">Loading reviews…</p>}
      {!loading && items.length === 0 && (
        <p className="text-sm text-ink-600">No published reviews yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => {
          const tool = item.tools?.[0];
          return (
            <div key={item._id} className="bg-white border border-mist-200 rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-battle-blue/10 flex items-center justify-center font-display font-bold text-battle-blue text-sm">
                  {(tool?.name || item.title).charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{tool?.name || item.title}</p>
                  <Stars rating={tool?.rating || 4} size={11} />
                </div>
              </div>
              <p className="text-xs text-ink-600 line-clamp-3 flex-1">{item.excerpt}</p>

              {(tool?.pros?.length || tool?.cons?.length) && (
                <ul className="text-xs text-ink-700 mt-3 space-y-1">
                  {tool?.pros?.slice(0, 1).map((p, i) => (
                    <li key={`p${i}`}>✅ {p}</li>
                  ))}
                  {tool?.cons?.slice(0, 1).map((c, i) => (
                    <li key={`c${i}`}>⚠️ {c}</li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex gap-2">
                <Link
                  to={contentHref(item)}
                  className="flex-1 text-center text-xs font-semibold border border-mist-200 rounded-lg py-2 hover:border-battle-blue transition"
                >
                  Read Review
                </Link>
                {tool?.affiliateUrl && (
                  <a
                    href={tool.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-xs font-semibold bg-battle-blue text-white rounded-lg py-2 hover:opacity-90 transition"
                  >
                    Visit Site
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
