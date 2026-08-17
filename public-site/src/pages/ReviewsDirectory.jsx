import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Stars from '../components/Stars';
import CategoryPills from '../components/CategoryPills';
import Pagination from '../components/Pagination';
import { contentHref } from '../config/contentTypes';

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'alpha', label: 'Alphabetical' },
];

function ProductRow({ item }) {
  const tool = item.tools?.[0];
  return (
    <div className="border border-mist-200 rounded-2xl p-5 bg-white hover:border-battle-blue transition-colors">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-12 h-12 rounded-xl bg-battle-blue/10 flex items-center justify-center font-display font-bold text-battle-blue text-lg shrink-0">
          {(tool?.name || item.title).charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link to={contentHref(item)} className="font-display font-bold text-lg hover:text-battle-blue transition-colors">
              {tool?.name || item.title}
            </Link>
            <div className="flex items-center gap-1.5">
              <Stars rating={tool?.rating || 0} size={14} />
              <span className="text-sm font-medium">{tool?.rating?.toFixed(1) || '—'}</span>
            </div>
          </div>

          {item.excerpt && <p className="text-sm text-ink-600 mt-1.5">{item.excerpt}</p>}

          {(tool?.pros?.length > 0 || tool?.cons?.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-3">
              {tool?.pros?.slice(0, 2).map((p, i) => (
                <p key={`p${i}`} className="text-xs text-ink-700">
                  <span className="text-green-600">✓</span> {p}
                </p>
              ))}
              {tool?.cons?.slice(0, 1).map((c, i) => (
                <p key={`c${i}`} className="text-xs text-ink-700">
                  <span className="text-red-500">✕</span> {c}
                </p>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-4 flex-wrap">
            {tool?.pricing && (
              <span className="text-xs text-ink-600">
                <span className="font-medium text-ink-900">{tool.pricing}</span>
              </span>
            )}
            <Link
              to={contentHref(item)}
              className="text-xs font-semibold border border-mist-200 rounded-lg px-3.5 py-2 hover:border-battle-blue transition"
            >
              Read Reviews
            </Link>
            {tool?.affiliateUrl && (
              <a
                href={tool.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold bg-battle-blue text-white rounded-lg px-3.5 py-2 hover:opacity-90 transition"
              >
                Visit Site →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsDirectory() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [sort, setSort] = useState('rating');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories', { params: { type: 'review' } }).then((res) => setCategories(res.data));
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get('/content', {
        params: { type: 'review', status: 'published', category: activeCategory || undefined, page, limit: PAGE_SIZE },
      })
      .then((res) => {
        let list = res.data.items;
        if (sort === 'rating') {
          list = [...list].sort((a, b) => (b.tools?.[0]?.rating || 0) - (a.tools?.[0]?.rating || 0));
        } else if (sort === 'alpha') {
          list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        }
        setItems(list);
        setTotal(res.data.total);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [activeCategory, sort, page]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <section className="bg-navy-950 text-white">
        <div className="max-w-4xl mx-auto px-6 py-14 text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold">Best Software Reviews</h1>
          <p className="text-white/60 text-sm sm:text-base mt-3">
            Compare top-rated tools based on real, in-depth reviews from our editorial team and verified users.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-3 mb-5">
          <p className="text-sm text-ink-600">{total} products reviewed</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-mist-200 rounded-lg px-3 py-2 bg-white"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <CategoryPills
            categories={categories}
            active={activeCategory}
            onSelect={(id) => {
              setActiveCategory(id);
              setPage(1);
            }}
          />
        </div>

        {loading && <p className="text-sm text-ink-600 py-10 text-center">Loading reviews…</p>}
        {!loading && items.length === 0 && (
          <p className="text-sm text-ink-600 py-10 text-center">
            No reviews published yet — add some from the admin dashboard.
          </p>
        )}

        <div className="space-y-4">
          {items.map((item) => (
            <ProductRow key={item._id} item={item} />
          ))}
        </div>

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </section>
    </>
  );
}
