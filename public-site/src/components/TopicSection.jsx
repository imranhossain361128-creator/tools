import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { contentHref } from '../config/contentTypes';

function MiniCard({ item }) {
  const date = new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return (
    <Link to={contentHref(item)} className="block py-4 border-b border-mist-200 last:border-0 group">
      <p className="text-xs text-ink-600 mb-1.5">{date}</p>
      <p className="text-sm font-semibold text-ink-900 group-hover:text-battle-blue transition-colors leading-snug line-clamp-2">
        {item.title}
      </p>
    </Link>
  );
}

export default function TopicSection({ title, type, viewAllHref, accent = '#4C7DFF' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/content', { params: { type, status: 'published', limit: 5 } })
      .then((res) => setItems(res.data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [type]);

  if (!loading && items.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
          {title}
        </h2>
        <Link to={viewAllHref} className="text-sm font-medium text-battle-blue">
          View all →
        </Link>
      </div>
      <div className="border-t border-mist-200 mt-4">
        {loading && <p className="text-sm text-ink-600 py-4">Loading…</p>}
        {items.map((item) => (
          <MiniCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}
