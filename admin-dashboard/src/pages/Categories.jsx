import { useEffect, useState, useCallback } from 'react';
import api from '../api/client';
import { CONTENT_TYPES } from '../config/contentTypes';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState(CONTENT_TYPES[0].key);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get('/categories')
      .then((res) => setCategories(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/categories', { name, type });
      setName('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Categories</h1>
      <p className="text-ink-600 text-sm mb-6">
        Categories are scoped per content type, since each has its own category URL pattern
        (e.g. <code className="bg-mist-100 px-1.5 py-0.5 rounded">/alternatives/category/seo-tools/</code>).
      </p>

      <form onSubmit={handleCreate} className="bg-white border border-mist-200 rounded-2xl p-5 flex gap-3 items-end mb-6">
        <div className="flex-1">
          <label className="block text-xs font-medium text-ink-600 mb-1.5">Category name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. VPN & Security Tools"
            className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-600 mb-1.5">Applies to</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-mist-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            {CONTENT_TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <button className="bg-battle-blue text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90">
          Add category
        </button>
      </form>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONTENT_TYPES.map((t) => {
          const items = categories.filter((c) => c.type === t.key);
          return (
            <div key={t.key} className="bg-white border border-mist-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                <h2 className="font-display font-semibold text-sm">{t.label}</h2>
              </div>
              {loading && <p className="text-xs text-ink-600">Loading…</p>}
              {!loading && items.length === 0 && (
                <p className="text-xs text-ink-600">No categories yet.</p>
              )}
              <ul className="space-y-2">
                {items.map((c) => (
                  <li key={c._id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{c.name}</span>
                      <span className="text-xs text-ink-600 block">{c.url}</span>
                    </div>
                    <button onClick={() => handleDelete(c._id)} className="text-xs text-red-500">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
