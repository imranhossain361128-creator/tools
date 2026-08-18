import { useEffect, useState, useCallback } from 'react';
import api from '../api/client';

const empty = { title: '', content: '', metaTitle: '', metaDescription: '', status: 'published' };

export default function Pages() {
  const [pages, setPages] = useState([]);
  const [editing, setEditing] = useState(null); // null | 'new' | page object
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get('/pages')
      .then((res) => setPages(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startNew = () => {
    setForm(empty);
    setEditing('new');
  };

  const startEdit = (p) => {
    setForm({ title: p.title, content: p.content, metaTitle: p.metaTitle, metaDescription: p.metaDescription, status: p.status });
    setEditing(p);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing === 'new') {
        await api.post('/pages', form);
      } else {
        await api.put(`/pages/${editing._id}`, form);
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this page?')) return;
    await api.delete(`/pages/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Static Pages</h1>
          <p className="text-ink-600 text-sm mt-1">About, Contact, Terms of Service, Privacy Policy, etc.</p>
        </div>
        <button
          onClick={startNew}
          className="bg-battle-blue text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90"
        >
          + Add page
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-white border border-mist-200 rounded-2xl p-5 space-y-4 mb-6">
          <h2 className="font-display font-semibold">{editing === 'new' ? 'New page' : `Edit "${editing.title}"`}</h2>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. About Us"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Content (HTML)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              rows={6}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.metaTitle}
              onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
              placeholder="Meta title"
              className="border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="border border-mist-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <textarea
            value={form.metaDescription}
            onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
            placeholder="Meta description"
            rows={2}
            className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button className="bg-battle-blue text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-sm font-medium px-4 py-2.5 rounded-lg border border-mist-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-mist-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-mist-50 text-ink-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Title</th>
              <th className="text-left px-5 py-3 font-medium">URL</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-100">
            {loading && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-ink-600">Loading…</td>
              </tr>
            )}
            {!loading && pages.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-ink-600">No pages yet.</td>
              </tr>
            )}
            {pages.map((p) => (
              <tr key={p._id} className="hover:bg-mist-50/60">
                <td className="px-5 py-3 font-medium">{p.title}</td>
                <td className="px-5 py-3 text-ink-600">
                  <code className="text-xs">/{p.slug}/</code>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      p.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right space-x-3">
                  <button onClick={() => startEdit(p)} className="text-battle-blue font-medium">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 font-medium">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
