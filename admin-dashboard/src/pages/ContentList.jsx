import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { getTypeConfig } from '../config/contentTypes';

export default function ContentList() {
  const { type } = useParams();
  const navigate = useNavigate();
  const cfg = getTypeConfig(type);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    api
      .get('/content', { params: { type, search: search || undefined, status: status || undefined, limit: 50 } })
      .then((res) => {
        setItems(res.data.items);
        setTotal(res.data.total);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [type, search, status]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    await api.delete(`/content/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">{cfg.label}</h1>
          <p className="text-ink-600 text-sm mt-1">
            URL pattern: <code className="bg-mist-100 px-1.5 py-0.5 rounded">{cfg.example}</code>
          </p>
        </div>
        <button
          onClick={() => navigate(`/content/${type}/new`)}
          className="bg-battle-blue text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90"
        >
          + Add {cfg.singular}
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title…"
          className="flex-1 border border-mist-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-battle-blue bg-white"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-mist-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      <div className="bg-white border border-mist-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-mist-50 text-ink-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Title</th>
              <th className="text-left px-5 py-3 font-medium">Slug / URL</th>
              <th className="text-left px-5 py-3 font-medium">Category</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Views</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-100">
            {loading && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-ink-600">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink-600">
                  No {cfg.label.toLowerCase()} yet. Click "+ Add {cfg.singular}" to create one.
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-mist-50/60">
                <td className="px-5 py-3 font-medium max-w-xs truncate">{item.title}</td>
                <td className="px-5 py-3 text-ink-600">
                  <code className="text-xs">{cfg.urlPrefix}/{item.slug}/</code>
                </td>
                <td className="px-5 py-3 text-ink-600">{item.category?.name || '—'}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      item.status === 'published'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-ink-600">{item.views}</td>
                <td className="px-5 py-3 text-right space-x-3">
                  <Link to={`/content/${type}/${item._id}`} className="text-battle-blue font-medium">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(item._id)} className="text-red-500 font-medium">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-ink-600 mt-3">{total} total</p>
    </div>
  );
}
