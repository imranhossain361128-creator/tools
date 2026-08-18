import { useEffect, useState, useCallback } from 'react';
import api from '../api/client';
import CategoryPills from '../components/CategoryPills';
import ToolCard from '../components/ToolCard';
import Pagination from '../components/Pagination';
import JsonLdSchema from '../components/JsonLdSchema';

const PAGE_SIZE = 12;

export default function Directory() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories', { params: { type: 'directory' } }).then((res) => setCategories(res.data));
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get('/content', {
        params: {
          type: 'directory',
          status: 'published',
          category: activeCategory || undefined,
          search: search || undefined,
          page,
          limit: PAGE_SIZE,
        },
      })
      .then((res) => {
        setItems(res.data.items);
        setTotal(res.data.total);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [activeCategory, search, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleCategorySelect = (id) => {
    setPage(1);
    setActiveCategory(id);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <JsonLdSchema schema={categories.find((c) => c._id === activeCategory)?.customSchema} />
      {/* Hero */}
      <section className="bg-navy-950 text-white">
        <div className="max-w-4xl mx-auto px-6 py-14 text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold">AI Tools Directory</h1>
          <p className="text-white/60 text-sm sm:text-base mt-3">
            Discover and compare the best AI tools for content creation, writing, image
            generation, productivity, and more.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="font-display text-lg font-bold">Find the right AI tool for your needs</h2>
        <p className="text-ink-600 text-sm mt-1 mb-5">
          Search or filter by category to find exactly what you're looking for.
        </p>

        <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-5 max-w-md">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search AI tools…"
            className="flex-1 border border-mist-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-battle-blue"
          />
          <button className="bg-battle-blue text-white text-sm font-semibold px-5 rounded-lg hover:opacity-90 transition">
            Search
          </button>
        </form>

        <CategoryPills categories={categories} active={activeCategory} onSelect={handleCategorySelect} />
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <p className="text-xs text-ink-600 mb-4">{total} tools found</p>

        {loading && <p className="text-sm text-ink-600 py-10 text-center">Loading tools…</p>}

        {!loading && items.length === 0 && (
          <p className="text-sm text-ink-600 py-10 text-center">
            No tools found. Try a different search or category — or add some from the admin dashboard.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <ToolCard key={item._id} item={item} />
          ))}
        </div>

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </section>

      {/* CTA banner */}
      <section className="bg-forest-800 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h2 className="font-display text-xl font-bold">Didn't find the right AI tool?</h2>
          <p className="text-white/60 text-sm mt-2 mb-6">
            Get a free personalized software recommendation from our team.
          </p>
          <a
            href="/get-recommendation"
            className="inline-block bg-battle-blue text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
          >
            Get Free Recommendation
          </a>
        </div>
      </section>
    </>
  );
}
