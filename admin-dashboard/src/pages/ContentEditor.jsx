import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { getTypeConfig, publicUrlFor } from '../config/contentTypes';
import { SCHEMA_OPTIONS_BY_TYPE } from '../config/schemaTemplates';
import { buildSlug } from '../utils/slugify';
import { applyPlaceholders } from '../utils/schemaPlaceholders';

const emptyTool = () => ({ name: '', logo: '', rating: 0, pricing: '', pros: [''], cons: [''], affiliateUrl: '' });

const emptyForm = () => ({
  title: '',
  mainKeyword: '',
  category: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  metaTitle: '',
  metaDescription: '',
  customSchema: '',
  status: 'draft',
  tools: [emptyTool()],
});

export default function ContentEditor() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const cfg = getTypeConfig(type);
  const isNew = id === 'new';

  const [form, setForm] = useState(emptyForm());
  const [slug, setSlug] = useState('');
  const [schemaChoice, setSchemaChoice] = useState('');
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    api.get('/categories', { params: { type } }).then((res) => setCategories(res.data));
    api.get('/schema-templates', { params: { appliesTo: type } }).then((res) => setSavedTemplates(res.data));
  }, [type]);

  useEffect(() => {
    if (isNew) return;
    api
      .get(`/content/${id}`)
      .then((res) => {
        const d = res.data;
        setSlug(d.slug || '');
        setForm({
          title: d.title || '',
          mainKeyword: d.mainKeyword || '',
          category: d.category?._id || '',
          excerpt: d.excerpt || '',
          content: d.content || '',
          featuredImage: d.featuredImage || '',
          metaTitle: d.metaTitle || '',
          metaDescription: d.metaDescription || '',
          customSchema: d.customSchema || '',
          status: d.status || 'draft',
          tools: d.tools?.length ? d.tools : [emptyTool()],
        });
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const updateTool = (idx, field, value) => {
    setForm((f) => {
      const tools = [...f.tools];
      tools[idx] = { ...tools[idx], [field]: value };
      return { ...f, tools };
    });
  };

  const updateToolListField = (idx, field, listIdx, value) => {
    setForm((f) => {
      const tools = [...f.tools];
      const list = [...tools[idx][field]];
      list[listIdx] = value;
      tools[idx] = { ...tools[idx], [field]: list };
      return { ...f, tools };
    });
  };

  const addToolListItem = (idx, field) => {
    setForm((f) => {
      const tools = [...f.tools];
      tools[idx] = { ...tools[idx], [field]: [...tools[idx][field], ''] };
      return { ...f, tools };
    });
  };

  const addTool = () => setForm((f) => ({ ...f, tools: [...f.tools, emptyTool()] }));
  const removeTool = (idx) => setForm((f) => ({ ...f, tools: f.tools.filter((_, i) => i !== idx) }));

  const schemaOptions = SCHEMA_OPTIONS_BY_TYPE[type] || [];

  const handleGenerateSchema = () => {
    const previewSlug = slug || (form.mainKeyword ? buildSlug(type, form.mainKeyword) : 'your-page');
    const url = publicUrlFor(type, previewSlug);

    if (schemaChoice.startsWith('saved:')) {
      const id = schemaChoice.replace('saved:', '');
      const saved = savedTemplates.find((t) => t._id === id);
      if (!saved) return;
      const tool = form.tools?.[0];
      const filled = applyPlaceholders(saved.template, {
        title: form.title,
        excerpt: form.excerpt,
        url,
        siteName: 'ToolsBattle',
        date: new Date().toISOString().slice(0, 10),
        toolName: tool?.name || '',
        rating: tool?.rating || '',
        pricing: tool?.pricing || '',
      });
      update('customSchema', filled);
      return;
    }

    const option = schemaOptions.find((o) => o.key === schemaChoice);
    if (!option) return;
    const schema = option.build(form, url);
    update('customSchema', JSON.stringify(schema, null, 2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        type,
        tools: form.tools
          .filter((t) => t.name)
          .map((t) => ({ ...t, pros: t.pros.filter(Boolean), cons: t.cons.filter(Boolean) })),
      };
      if (isNew) {
        const res = await api.post('/content', payload);
        navigate(`/content/${type}/${res.data._id}`);
      } else {
        await api.put(`/content/${id}`, payload);
      }
      navigate(`/content/${type}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-ink-600 text-sm">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link to={`/content/${type}`} className="text-sm text-battle-blue">
          ← Back to {cfg.label}
        </Link>
        <h1 className="font-display text-2xl font-bold mt-2">
          {isNew ? `New ${cfg.singular}` : `Edit ${cfg.singular}`}
        </h1>
        {!isNew && form.status === 'published' && slug && (
          <a
            href={publicUrlFor(type, slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-medium text-green-600 mt-2 mr-4"
          >
            View live →
          </a>
        )}
        {type === 'review' && !isNew && (
          <Link
            to={`/content/review/${id}/reviews`}
            className="inline-block text-sm font-medium text-battle-blue mt-2"
          >
            Manage individual customer reviews (bulk import) →
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-mist-200 rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-battle-blue"
              placeholder={`e.g. "Mullvad vs NordVPN: Which VPN Is Better in 2026"`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">
              Main keyword (builds the URL slug)
            </label>
            <input
              required
              value={form.mainKeyword}
              onChange={(e) => update('mainKeyword', e.target.value)}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-battle-blue"
              placeholder={cfg.keywordHint}
            />
            <p className="text-xs text-ink-600 mt-1">
              Live URL will look like:{' '}
              <code className="bg-mist-100 px-1.5 py-0.5 rounded">{cfg.example}</code>
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Featured image URL</label>
            <input
              value={form.featuredImage}
              onChange={(e) => update('featuredImage', e.target.value)}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-battle-blue"
              placeholder="https://…"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => update('excerpt', e.target.value)}
              rows={2}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-battle-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Body content (HTML)</label>
            <textarea
              value={form.content}
              onChange={(e) => update('content', e.target.value)}
              rows={8}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-battle-blue font-mono"
            />
            <p className="text-xs text-ink-600 mt-1">
              Use <code className="bg-mist-100 px-1 rounded">&lt;h2&gt;</code> and{' '}
              <code className="bg-mist-100 px-1 rounded">&lt;h3&gt;</code> for section headings —
              the live site automatically builds a Table of Contents from them.
            </p>
          </div>
        </div>

        {/* Tools */}
        <div className="bg-white border border-mist-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold">Tools</h2>
            <button
              type="button"
              onClick={addTool}
              className="text-xs font-medium text-battle-blue"
            >
              + Add tool
            </button>
          </div>
          <p className="text-xs text-ink-600 mb-4">
            For comparisons, add both tools being compared. For reviews/alternatives/directory, one tool is usually enough.
          </p>

          <div className="space-y-4">
            {form.tools.map((tool, idx) => (
              <div key={idx} className="border border-mist-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-ink-600">Tool {idx + 1}</span>
                  {form.tools.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTool(idx)}
                      className="text-xs text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    placeholder="Tool name"
                    value={tool.name}
                    onChange={(e) => updateTool(idx, 'name', e.target.value)}
                    className="border border-mist-200 rounded-lg px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Pricing (e.g. From $19/mo)"
                    value={tool.pricing}
                    onChange={(e) => updateTool(idx, 'pricing', e.target.value)}
                    className="border border-mist-200 rounded-lg px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="Rating (0-5)"
                    value={tool.rating}
                    onChange={(e) => updateTool(idx, 'rating', Number(e.target.value))}
                    className="border border-mist-200 rounded-lg px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Affiliate URL"
                    value={tool.affiliateUrl}
                    onChange={(e) => updateTool(idx, 'affiliateUrl', e.target.value)}
                    className="border border-mist-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-ink-600 mb-1">Pros</p>
                    {tool.pros.map((p, pIdx) => (
                      <input
                        key={pIdx}
                        value={p}
                        onChange={(e) => updateToolListField(idx, 'pros', pIdx, e.target.value)}
                        className="w-full border border-mist-200 rounded-lg px-3 py-1.5 text-sm mb-1.5"
                        placeholder="Pro point"
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => addToolListItem(idx, 'pros')}
                      className="text-xs text-battle-blue"
                    >
                      + Add pro
                    </button>
                  </div>
                  <div>
                    <p className="text-xs text-ink-600 mb-1">Cons</p>
                    {tool.cons.map((c, cIdx) => (
                      <input
                        key={cIdx}
                        value={c}
                        onChange={(e) => updateToolListField(idx, 'cons', cIdx, e.target.value)}
                        className="w-full border border-mist-200 rounded-lg px-3 py-1.5 text-sm mb-1.5"
                        placeholder="Con point"
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => addToolListItem(idx, 'cons')}
                      className="text-xs text-battle-blue"
                    >
                      + Add con
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white border border-mist-200 rounded-2xl p-5 space-y-4">
          <h2 className="font-display font-semibold">SEO</h2>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Meta title</label>
            <input
              value={form.metaTitle}
              onChange={(e) => update('metaTitle', e.target.value)}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Meta description</label>
            <textarea
              value={form.metaDescription}
              onChange={(e) => update('metaDescription', e.target.value)}
              rows={2}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">
              Custom Schema (JSON-LD structured data)
            </label>
            <div className="flex gap-2 mb-2">
              <select
                value={schemaChoice}
                onChange={(e) => setSchemaChoice(e.target.value)}
                className="flex-1 border border-mist-200 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="">Choose a schema…</option>
                {savedTemplates.length > 0 && (
                  <optgroup label="Your saved templates">
                    {savedTemplates.map((t) => (
                      <option key={t._id} value={`saved:${t._id}`}>
                        {t.name}
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="Built-in templates">
                  {schemaOptions.map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.label}
                    </option>
                  ))}
                </optgroup>
              </select>
              <button
                type="button"
                disabled={!schemaChoice}
                onClick={handleGenerateSchema}
                className="text-sm font-medium bg-battle-blue text-white px-4 py-2 rounded-lg disabled:opacity-40 hover:opacity-90"
              >
                Generate
              </button>
            </div>
            <textarea
              value={form.customSchema}
              onChange={(e) => update('customSchema', e.target.value)}
              rows={8}
              placeholder="Pick a schema type above and click Generate — it will fill in this box using this post's title, excerpt, and tool info."
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-xs font-mono"
            />
            <p className="text-xs text-ink-600 mt-1">
              Auto-generated from this post's data. You can still edit the JSON by hand after generating,
              or leave it blank to skip structured data for this page. Write reusable templates once in{' '}
              <Link to="/schema-templates" className="text-battle-blue">Schema Templates</Link>.
            </p>
          </div>
        </div>

        {/* Status + submit */}
        <div className="bg-white border border-mist-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              className="border border-mist-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-battle-blue text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving…' : isNew ? `Create ${cfg.singular}` : 'Save changes'}
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
}
