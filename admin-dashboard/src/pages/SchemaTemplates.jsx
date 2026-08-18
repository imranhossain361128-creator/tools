import { useEffect, useState, useCallback } from 'react';
import api from '../api/client';
import { CONTENT_TYPES } from '../config/contentTypes';
import { AVAILABLE_PLACEHOLDERS_CONTENT, AVAILABLE_PLACEHOLDERS_CATEGORY } from '../utils/schemaPlaceholders';

const APPLIES_TO_OPTIONS = [
  { value: 'any', label: 'Any content type' },
  ...CONTENT_TYPES.map((t) => ({ value: t.key, label: t.label })),
  { value: 'category', label: 'Category pages' },
];

const EXAMPLE = `{
  "@context": "https://schema.org",
  "@type": "Review",
  "name": "{{title}}",
  "url": "{{url}}",
  "reviewBody": "{{excerpt}}",
  "itemReviewed": { "@type": "SoftwareApplication", "name": "{{toolName}}" },
  "reviewRating": { "@type": "Rating", "ratingValue": "{{rating}}", "bestRating": 5 },
  "author": { "@type": "Organization", "name": "{{siteName}}" }
}`;

export default function SchemaTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | template object
  const [form, setForm] = useState({ name: '', appliesTo: 'any', template: '' });
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    api
      .get('/schema-templates')
      .then((res) => setTemplates(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startNew = () => {
    setForm({ name: '', appliesTo: 'any', template: '' });
    setEditing('new');
  };

  const startEdit = (t) => {
    setForm({ name: t.name, appliesTo: t.appliesTo, template: t.template });
    setEditing(t);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing === 'new') {
        await api.post('/schema-templates', form);
      } else {
        await api.put(`/schema-templates/${editing._id}`, form);
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this template?')) return;
    await api.delete(`/schema-templates/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Schema Templates</h1>
          <p className="text-ink-600 text-sm mt-1 max-w-2xl">
            Write your JSON-LD structured data once per content type. When editing a post or
            category, you'll pick one of these from a dropdown and it fills in automatically —
            no hand-writing schema on every page.
          </p>
        </div>
        <button
          onClick={startNew}
          className="bg-battle-blue text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90 shrink-0"
        >
          + New template
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-white border border-mist-200 rounded-2xl p-5 space-y-4 mb-6">
          <h2 className="font-display font-semibold">
            {editing === 'new' ? 'New template' : `Edit "${editing.name}"`}
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1.5">Template name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Standard Review Schema"
                className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1.5">Applies to</label>
              <select
                value={form.appliesTo}
                onChange={(e) => setForm((f) => ({ ...f, appliesTo: e.target.value }))}
                className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm bg-white"
              >
                {APPLIES_TO_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">JSON-LD template</label>
            <textarea
              required
              value={form.template}
              onChange={(e) => setForm((f) => ({ ...f, template: e.target.value }))}
              rows={10}
              placeholder={EXAMPLE}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-xs font-mono"
            />
          </div>

          <div className="bg-mist-50 rounded-lg p-3 text-xs text-ink-700">
            <p className="font-medium mb-1.5">Available placeholders (auto-filled when applied):</p>
            <p className="mb-1">
              <span className="font-semibold">Posts:</span>{' '}
              {AVAILABLE_PLACEHOLDERS_CONTENT.map((p) => (
                <code key={p} className="bg-white px-1.5 py-0.5 rounded mr-1.5 border border-mist-200">
                  {p}
                </code>
              ))}
            </p>
            <p>
              <span className="font-semibold">Categories:</span>{' '}
              {AVAILABLE_PLACEHOLDERS_CATEGORY.map((p) => (
                <code key={p} className="bg-white px-1.5 py-0.5 rounded mr-1.5 border border-mist-200">
                  {p}
                </code>
              ))}
            </p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button className="bg-battle-blue text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90">
              Save template
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
              <th className="text-left px-5 py-3 font-medium">Name</th>
              <th className="text-left px-5 py-3 font-medium">Applies to</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-100">
            {loading && (
              <tr>
                <td colSpan={3} className="px-5 py-6 text-center text-ink-600">Loading…</td>
              </tr>
            )}
            {!loading && templates.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-ink-600">
                  No templates yet. Click "+ New template" to write your first reusable schema.
                </td>
              </tr>
            )}
            {templates.map((t) => (
              <tr key={t._id}>
                <td className="px-5 py-3 font-medium">{t.name}</td>
                <td className="px-5 py-3 text-ink-600 capitalize">
                  {APPLIES_TO_OPTIONS.find((o) => o.value === t.appliesTo)?.label || t.appliesTo}
                </td>
                <td className="px-5 py-3 text-right space-x-3">
                  <button onClick={() => startEdit(t)} className="text-battle-blue font-medium">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(t._id)} className="text-red-500 font-medium">
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
