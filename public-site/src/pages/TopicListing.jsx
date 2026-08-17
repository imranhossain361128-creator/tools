import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import TopicTabs from '../components/TopicTabs';
import ArticleRow from '../components/ArticleRow';
import { CONTENT_TYPES } from '../config/contentTypes';

export default function TopicListing() {
  const { type } = useParams();
  const cfg = CONTENT_TYPES[type];

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get('/content', {
        params: { type, status: 'published', limit: 20, category: activeCategory || undefined },
      })
      .then((res) => {
        setItems(res.data.items);
        setTotal(res.data.total);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [type, activeCategory]);

  useEffect(() => {
    api.get('/categories', { params: { type } }).then((res) => setCategories(res.data));
  }, [type]);

  useEffect(() => {
    load();
  }, [load]);

  if (!cfg) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-ink-600">Unknown topic.</p>
      </div>
    );
  }

  return (
    <>
      <TopicTabs active={type} />

      <section className="border-b border-mist-200">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="font-display text-2xl font-extrabold">{cfg.label}</h1>
          <p className="text-ink-600 text-sm mt-1">{total} published articles</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
        <aside className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-600 mb-2">Categories</p>
          <button
            onClick={() => setActiveCategory('')}
            className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
              activeCategory === '' ? 'bg-battle-blue/10 text-battle-blue font-medium' : 'text-ink-700 hover:bg-mist-50'
            }`}
          >
            All {cfg.label}
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setActiveCategory(c._id)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                activeCategory === c._id ? 'bg-battle-blue/10 text-battle-blue font-medium' : 'text-ink-700 hover:bg-mist-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </aside>

        <div>
          {loading && <p className="text-sm text-ink-600 py-4">Loading…</p>}
          {!loading && items.length === 0 && (
            <p className="text-sm text-ink-600 py-4">No published articles in this section yet.</p>
          )}
          {items.map((item, i) => (
            <ArticleRow key={item._id} item={item} showDivider={i < items.length - 1} />
          ))}
        </div>
      </div>
    </>
  );
}
