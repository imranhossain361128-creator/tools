import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import ArticleCard from '../components/ArticleCard';
import PopularWidget from '../components/PopularWidget';
import NewsletterSignup from '../components/NewsletterSignup';
import Pagination from '../components/Pagination';
import JsonLdSchema from '../components/JsonLdSchema';

const PAGE_SIZE = 12;

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [siblingCategories, setSiblingCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Categories are scoped per content type, so first find which type this slug belongs to.
  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get('/categories')
      .then((res) => {
        const match = res.data.find((c) => c.slug === slug);
        if (!match) {
          setNotFound(true);
          return;
        }
        setCategory(match);
        setSiblingCategories(res.data.filter((c) => c.type === match.type));
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  const loadContent = useCallback(() => {
    if (!category) return;
    setLoading(true);
    api
      .get('/content', {
        params: { type: category.type, status: 'published', category: category._id, page, limit: PAGE_SIZE },
      })
      .then((res) => {
        setItems(res.data.items);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  }, [category, page]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Category not found</h1>
        <Link to="/blog" className="text-battle-blue text-sm font-medium mt-4 inline-block">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <JsonLdSchema schema={category?.customSchema} />

      {/* Pill filter bar */}
      {siblingCategories.length > 0 && (
        <div className="border-b border-mist-200 bg-white sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              {siblingCategories.map((c) => (
                <Link
                  key={c._id}
                  to={`/category/${c.slug}`}
                  className={`shrink-0 text-sm font-medium px-3.5 py-2.5 rounded-md transition-colors ${
                    c.slug === slug
                      ? 'text-battle-blue bg-battle-blue/10'
                      : 'text-ink-600 hover:text-ink-900 hover:bg-mist-50'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="border-b border-mist-200">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="font-display text-3xl font-extrabold">{category?.name || 'Category'}</h1>
          {category?.description && (
            <p className="text-ink-600 text-sm mt-2 max-w-2xl">{category.description}</p>
          )}
          <p className="text-xs text-ink-600 mt-3">{total} articles</p>
        </div>
      </section>

      {/* Content + sidebar */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <div>
          {loading && <p className="text-sm text-ink-600 py-6">Loading…</p>}
          {!loading && items.length === 0 && (
            <p className="text-sm text-ink-600 py-6">No published articles in this category yet.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
            {items.map((item) => (
              <ArticleCard key={item._id} item={item} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>

        <aside className="space-y-5">
          <PopularWidget />
          <div className="bg-forest-800 text-white rounded-2xl p-5">
            <p className="font-display font-bold text-sm mb-1.5">Get personalized picks</p>
            <p className="text-white/60 text-xs mb-4">
              Tell us your needs and we'll match you with the right software — free.
            </p>
            <Link
              to="/get-recommendation"
              className="block text-center bg-battle-blue text-xs font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
            >
              Get Free Recommendation
            </Link>
          </div>
        </aside>
      </div>

      <NewsletterSignup topics={siblingCategories.map((c) => c.name)} />
    </>
  );
}
