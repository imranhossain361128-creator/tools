import { useEffect, useState } from 'react';
import api from '../api/client';

const emptyNav = () => ({ label: '', href: '' });
const emptyFooter = () => ({ column: 'Explore', label: '', href: '' });
const emptyFaq = () => ({ question: '', answer: '', order: 0 });
const emptyStep = () => ({ text: '' });

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/settings')
      .then((res) => setSettings(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const update = (field, value) => setSettings((s) => ({ ...s, [field]: value }));

  const updateList = (field, index, key, value) => {
    setSettings((s) => {
      const list = [...s[field]];
      list[index] = { ...list[index], [key]: value };
      return { ...s, [field]: list };
    });
  };

  const addListItem = (field, factory) => {
    setSettings((s) => ({ ...s, [field]: [...s[field], factory()] }));
  };

  const removeListItem = (field, index) => {
    setSettings((s) => ({ ...s, [field]: s[field].filter((_, i) => i !== index) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await api.put('/settings', settings);
      setSettings(res.data);
      setSavedAt(new Date());
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-ink-600">Loading settings…</p>;
  if (!settings) return <p className="text-sm text-red-500">{error || 'Could not load settings'}</p>;

  return (
    <form onSubmit={handleSave} className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Site Settings</h1>
          <p className="text-ink-600 text-sm mt-1">
            Controls the homepage hero, navigation, footer, and FAQ on the live public site.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-battle-blue text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save all changes'}
        </button>
      </div>

      {savedAt && <p className="text-xs text-green-600">Saved at {savedAt.toLocaleTimeString()}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Identity */}
      <section className="bg-white border border-mist-200 rounded-2xl p-5 space-y-4">
        <h2 className="font-display font-semibold">Site identity</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Site name</label>
            <input
              value={settings.siteName}
              onChange={(e) => update('siteName', e.target.value)}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Tagline</label>
            <input
              value={settings.siteTagline}
              onChange={(e) => update('siteTagline', e.target.value)}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-white border border-mist-200 rounded-2xl p-5 space-y-4">
        <h2 className="font-display font-semibold">Homepage hero</h2>
        <div>
          <label className="block text-xs font-medium text-ink-600 mb-1.5">Badge text</label>
          <input
            value={settings.heroBadge}
            onChange={(e) => update('heroBadge', e.target.value)}
            className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Title (before)</label>
            <input
              value={settings.heroTitle}
              onChange={(e) => update('heroTitle', e.target.value)}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Title (accent word)</label>
            <input
              value={settings.heroTitleAccent}
              onChange={(e) => update('heroTitleAccent', e.target.value)}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Title (after)</label>
            <input
              value={settings.heroTitleEnd}
              onChange={(e) => update('heroTitleEnd', e.target.value)}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-600 mb-1.5">Subtitle</label>
          <textarea
            value={settings.heroSubtitle}
            onChange={(e) => update('heroSubtitle', e.target.value)}
            rows={2}
            className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-600 mb-1.5">Trust line</label>
          <input
            value={settings.heroTrustText}
            onChange={(e) => update('heroTrustText', e.target.value)}
            className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </section>

      {/* Recommendation steps */}
      <section className="bg-white border border-mist-200 rounded-2xl p-5 space-y-4">
        <h2 className="font-display font-semibold">"Personalized Recommendations" section</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Title</label>
            <input
              value={settings.recommendationTitle}
              onChange={(e) => update('recommendationTitle', e.target.value)}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Subtitle</label>
            <input
              value={settings.recommendationSubtitle}
              onChange={(e) => update('recommendationSubtitle', e.target.value)}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-ink-600">Steps</p>
          {settings.recommendationSteps.map((step, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={step.text}
                onChange={(e) => updateList('recommendationSteps', i, 'text', e.target.value)}
                className="flex-1 border border-mist-200 rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeListItem('recommendationSteps', i)}
                className="text-xs text-red-500 px-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem('recommendationSteps', emptyStep)}
            className="text-xs font-medium text-battle-blue"
          >
            + Add step
          </button>
        </div>
      </section>

      {/* Navigation */}
      <section className="bg-white border border-mist-200 rounded-2xl p-5 space-y-3">
        <h2 className="font-display font-semibold">Header navigation</h2>
        {settings.navLinks.map((link, i) => (
          <div key={i} className="flex gap-2">
            <input
              placeholder="Label"
              value={link.label}
              onChange={(e) => updateList('navLinks', i, 'label', e.target.value)}
              className="flex-1 border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="/path"
              value={link.href}
              onChange={(e) => updateList('navLinks', i, 'href', e.target.value)}
              className="flex-1 border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
            <button type="button" onClick={() => removeListItem('navLinks', i)} className="text-xs text-red-500 px-2">
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addListItem('navLinks', emptyNav)}
          className="text-xs font-medium text-battle-blue"
        >
          + Add nav link
        </button>
      </section>

      {/* Footer */}
      <section className="bg-white border border-mist-200 rounded-2xl p-5 space-y-3">
        <h2 className="font-display font-semibold">Footer</h2>
        <div>
          <label className="block text-xs font-medium text-ink-600 mb-1.5">Footer tagline</label>
          <input
            value={settings.footerTagline}
            onChange={(e) => update('footerTagline', e.target.value)}
            className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <p className="text-xs font-medium text-ink-600 pt-2">Footer links</p>
        {settings.footerLinks.map((link, i) => (
          <div key={i} className="flex gap-2">
            <select
              value={link.column}
              onChange={(e) => updateList('footerLinks', i, 'column', e.target.value)}
              className="border border-mist-200 rounded-lg px-2 py-2 text-sm bg-white w-28"
            >
              <option>Explore</option>
              <option>Company</option>
              <option>Legal</option>
            </select>
            <input
              placeholder="Label"
              value={link.label}
              onChange={(e) => updateList('footerLinks', i, 'label', e.target.value)}
              className="flex-1 border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="/path"
              value={link.href}
              onChange={(e) => updateList('footerLinks', i, 'href', e.target.value)}
              className="flex-1 border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => removeListItem('footerLinks', i)}
              className="text-xs text-red-500 px-2"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addListItem('footerLinks', emptyFooter)}
          className="text-xs font-medium text-battle-blue"
        >
          + Add footer link
        </button>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Facebook URL</label>
            <input
              value={settings.socialLinks?.facebook || ''}
              onChange={(e) => update('socialLinks', { ...settings.socialLinks, facebook: e.target.value })}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Twitter/X URL</label>
            <input
              value={settings.socialLinks?.twitter || ''}
              onChange={(e) => update('socialLinks', { ...settings.socialLinks, twitter: e.target.value })}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">YouTube URL</label>
            <input
              value={settings.socialLinks?.youtube || ''}
              onChange={(e) => update('socialLinks', { ...settings.socialLinks, youtube: e.target.value })}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border border-mist-200 rounded-2xl p-5 space-y-3">
        <h2 className="font-display font-semibold">FAQ</h2>
        {settings.faqs.map((faq, i) => (
          <div key={i} className="border border-mist-200 rounded-xl p-3 space-y-2">
            <div className="flex gap-2">
              <input
                placeholder="Question"
                value={faq.question}
                onChange={(e) => updateList('faqs', i, 'question', e.target.value)}
                className="flex-1 border border-mist-200 rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeListItem('faqs', i)}
                className="text-xs text-red-500 px-2 shrink-0"
              >
                Remove
              </button>
            </div>
            <textarea
              placeholder="Answer"
              value={faq.answer}
              onChange={(e) => updateList('faqs', i, 'answer', e.target.value)}
              rows={2}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => addListItem('faqs', emptyFaq)}
          className="text-xs font-medium text-battle-blue"
        >
          + Add FAQ
        </button>
      </section>

      <div className="flex justify-end pb-10">
        <button
          type="submit"
          disabled={saving}
          className="bg-battle-blue text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save all changes'}
        </button>
      </div>
    </form>
  );
}
