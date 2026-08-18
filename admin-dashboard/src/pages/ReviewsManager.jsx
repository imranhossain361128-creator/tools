import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';

const SAMPLE_JSON = `[
  {
    "rating": 5,
    "title": "Great for keyword research",
    "body": "We've used this for two years and it keeps getting better.",
    "pros": "Huge keyword database, easy to learn",
    "cons": "Pricey for solo users",
    "reviewerName": "Sarah K.",
    "reviewerRole": "Marketing Manager",
    "companyIndustry": "Marketing and Advertising",
    "companySize": "11-50 employees",
    "source": "Imported from Capterra",
    "sourceUrl": "https://www.capterra.com/...",
    "publishedAt": "2026-03-14"
  }
]`;

export default function ReviewsManager() {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [distribution, setDistribution] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [bulkText, setBulkText] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');
  const [importing, setImporting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get('/reviews', { params: { content: id, page, limit: 20, sort: 'newest' } }),
      api.get('/reviews/distribution', { params: { content: id } }),
    ])
      .then(([listRes, distRes]) => {
        setReviews(listRes.data.items);
        setTotal(listRes.data.total);
        setDistribution(distRes.data);
      })
      .finally(() => setLoading(false));
  }, [id, page]);

  useEffect(() => {
    api.get(`/content/${id}`).then((res) => setContent(res.data));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleBulkImport = async (e) => {
    e.preventDefault();
    setBulkStatus('');
    let parsed;
    try {
      parsed = JSON.parse(bulkText);
      if (!Array.isArray(parsed)) throw new Error('Must be a JSON array');
    } catch (err) {
      setBulkStatus(`Invalid JSON: ${err.message}`);
      return;
    }

    setImporting(true);
    try {
      const res = await api.post('/reviews/bulk', { content: id, reviews: parsed });
      setBulkStatus(`Imported ${res.data.inserted} review(s).`);
      setBulkText('');
      setPage(1);
      load();
    } catch (err) {
      setBulkStatus(err.response?.data?.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Delete this review?')) return;
    await api.delete(`/reviews/${reviewId}`);
    load();
  };

  const totalPages = Math.max(1, Math.ceil(total / 20));

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link to={`/content/review/${id}`} className="text-sm text-battle-blue">
          ← Back to editor
        </Link>
        <h1 className="font-display text-2xl font-bold mt-2">
          Reviews for {content?.title || '…'}
        </h1>
        <p className="text-ink-600 text-sm mt-1">
          These are individual customer reviews shown on the live product review page — separate
          from the editorial write-up in the main editor.
        </p>
      </div>

      {distribution && (
        <div className="bg-white border border-mist-200 rounded-2xl p-5 mb-6 flex items-center gap-8">
          <div className="text-center shrink-0">
            <p className="font-display text-4xl font-bold text-battle-blue">{distribution.average || '—'}</p>
            <p className="text-xs text-ink-600">{distribution.total} reviews</p>
          </div>
          <div className="flex-1 space-y-1">
            {distribution.breakdown.map((b) => (
              <div key={b.star} className="flex items-center gap-2 text-xs">
                <span className="w-8 text-ink-600">{b.star}★</span>
                <div className="flex-1 h-2 bg-mist-100 rounded-full overflow-hidden">
                  <div className="h-full bg-battle-gold" style={{ width: `${b.percent}%` }} />
                </div>
                <span className="w-10 text-ink-600 text-right">{b.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk import */}
      <form onSubmit={handleBulkImport} className="bg-white border border-mist-200 rounded-2xl p-5 mb-6">
        <h2 className="font-display font-semibold mb-1">Bulk import reviews</h2>
        <p className="text-xs text-ink-600 mb-3">
          Paste a JSON array of reviews (copied and reformatted from other review sites). Only{' '}
          <code className="bg-mist-100 px-1 rounded">rating</code> is required per review — everything
          else is optional. This works for large batches (hundreds to thousands at once).
        </p>
        <textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          rows={10}
          placeholder={SAMPLE_JSON}
          className="w-full border border-mist-200 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-battle-blue"
        />
        {bulkStatus && <p className="text-xs mt-2 text-ink-700">{bulkStatus}</p>}
        <button
          disabled={importing || !bulkText.trim()}
          className="mt-3 bg-battle-blue text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {importing ? 'Importing…' : 'Import reviews'}
        </button>
      </form>

      {/* Reviews table */}
      <div className="bg-white border border-mist-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-mist-50 text-ink-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Rating</th>
              <th className="text-left px-4 py-3 font-medium">Reviewer</th>
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium">Source</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-100">
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ink-600">Loading…</td>
              </tr>
            )}
            {!loading && reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-600">
                  No reviews yet — import some above.
                </td>
              </tr>
            )}
            {reviews.map((r) => (
              <tr key={r._id}>
                <td className="px-4 py-3 font-medium">{r.rating}★</td>
                <td className="px-4 py-3 text-ink-600">{r.reviewerName}</td>
                <td className="px-4 py-3 max-w-xs truncate">{r.title || '—'}</td>
                <td className="px-4 py-3 text-ink-600">{r.source}</td>
                <td className="px-4 py-3 text-ink-600">
                  {new Date(r.publishedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(r._id)} className="text-red-500 font-medium">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm px-3 py-1.5 rounded-lg border border-mist-200 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-ink-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-sm px-3 py-1.5 rounded-lg border border-mist-200 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
