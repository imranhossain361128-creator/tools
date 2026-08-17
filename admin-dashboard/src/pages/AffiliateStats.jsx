import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../api/client';
import StatCard from '../components/StatCard';

export default function AffiliateStats() {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/affiliate/stats', { params: { days } })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Affiliate Clicks</h1>
          <p className="text-ink-600 text-sm mt-1">
            Tracks clicks on affiliate/"Visit site" buttons across comparisons, reviews & alternatives.
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="border border-mist-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {loading && <p className="text-sm text-ink-600">Loading…</p>}

      {data && (
        <>
          <div className="mb-6">
            <StatCard label={`Total clicks (${days}d)`} value={data.totalClicks} accent="#FF7A33" />
          </div>

          <div className="bg-white border border-mist-200 rounded-2xl p-5 mb-6">
            <h2 className="font-display font-semibold mb-4">Clicks over time</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F5" />
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="clicks" stroke="#FF7A33" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-mist-200 rounded-2xl p-5">
              <h2 className="font-display font-semibold mb-3">Top tools by clicks</h2>
              <ul className="space-y-2">
                {data.byTool.length === 0 && <p className="text-sm text-ink-600">No clicks yet.</p>}
                {data.byTool.map((t) => (
                  <li key={t._id} className="flex items-center justify-between text-sm">
                    <span>{t._id}</span>
                    <span className="font-semibold text-battle-orange">{t.clicks}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-mist-200 rounded-2xl p-5">
              <h2 className="font-display font-semibold mb-3">Top content by clicks</h2>
              <ul className="space-y-2">
                {data.byContent.length === 0 && <p className="text-sm text-ink-600">No clicks yet.</p>}
                {data.byContent.map((c) => (
                  <li key={c._id.content} className="flex items-center justify-between text-sm gap-3">
                    <span className="truncate">{c._id.title}</span>
                    <span className="font-semibold text-battle-orange shrink-0">{c.clicks}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white border border-mist-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-mist-100">
              <h2 className="font-display font-semibold">Recent clicks</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-mist-50 text-ink-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Tool</th>
                  <th className="text-left px-5 py-3 font-medium">From content</th>
                  <th className="text-left px-5 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist-100">
                {data.recent.map((r) => (
                  <tr key={r._id}>
                    <td className="px-5 py-3 font-medium">{r.toolName}</td>
                    <td className="px-5 py-3 text-ink-600 truncate max-w-xs">{r.contentTitle}</td>
                    <td className="px-5 py-3 text-ink-600">{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
