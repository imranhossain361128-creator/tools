import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Stars from './Stars';
import { contentHref } from '../config/contentTypes';

export default function PopularTools() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/content', { params: { type: 'directory', status: 'published', limit: 4 } })
      .then((res) => setItems(res.data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">Popular software &amp; tools</h2>
        <Link to="/ai-tools-directory" className="text-sm font-medium text-battle-blue">
          View all categories →
        </Link>
      </div>

      {loading && <p className="text-sm text-ink-600">Loading tools…</p>}

      {!loading && items.length === 0 && (
        <p className="text-sm text-ink-600">
          No directory listings yet — add some from the admin dashboard to populate this section.
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => {
          const tool = item.tools?.[0];
          return (
            <Link
              key={item._id}
              to={contentHref(item)}
              className="block bg-white border border-mist-200 rounded-xl p-4 hover:border-battle-blue hover:shadow-sm transition"
            >
              <div className="w-9 h-9 rounded-lg bg-mist-100 flex items-center justify-center font-display font-bold text-battle-blue mb-3">
                {(tool?.name || item.title).charAt(0)}
              </div>
              <p className="font-semibold text-sm truncate">{tool?.name || item.title}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Stars rating={tool?.rating || 0} size={12} />
                <span className="text-xs text-ink-600">{item.views} reviews</span>
              </div>
              <span className="text-xs font-medium text-battle-blue mt-2 inline-block">See reviews →</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
