import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import api from '../api/client';
import StatCard from '../components/StatCard';
import { CONTENT_TYPES } from '../config/contentTypes';

export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/analytics/overview')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-ink-600 text-sm">Loading overview…</p>;
  if (error)
    return (
      <div className="bg-white border border-mist-200 rounded-xl p-6 text-sm text-red-500">{error}</div>
    );

  const chartData = CONTENT_TYPES.map((t) => ({
    name: t.label.replace(' Tools Directory', ''),
    count: data.byType[t.key] || 0,
    fill: t.color,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Overview</h1>
          <p className="text-ink-600 text-sm mt-1">Everything happening on ToolsBattle at a glance.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total content" value={data.totalContent} />
        <StatCard label="Published" value={data.publishedCount} accent="#22B07D" />
        <StatCard label="Drafts" value={data.draftCount} accent="#A855F7" />
        <StatCard label="Affiliate clicks (30d)" value={data.clicksLast30} accent="#FF7A33" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-mist-200 rounded-2xl p-5">
          <h2 className="font-display font-semibold mb-4">Content by type</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F5" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-mist-200 rounded-2xl p-5">
          <h2 className="font-display font-semibold mb-4">Most viewed</h2>
          <ul className="space-y-3">
            {data.topViewed.length === 0 && <p className="text-sm text-ink-600">No views yet.</p>}
            {data.topViewed.map((item) => (
              <li key={item._id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to={`/content/${item.type}`}
                    className="text-sm font-medium text-ink-900 hover:text-battle-blue truncate block"
                  >
                    {item.title}
                  </Link>
                  <span className="text-xs text-ink-600 capitalize">{item.type}</span>
                </div>
                <span className="text-sm font-semibold text-battle-blue shrink-0">{item.views}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 bg-white border border-mist-200 rounded-2xl p-5">
        <h2 className="font-display font-semibold mb-3">Content breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {CONTENT_TYPES.map((t) => (
            <Link
              key={t.key}
              to={`/content/${t.key}`}
              className="rounded-xl border border-mist-200 p-4 hover:border-battle-blue transition-colors"
            >
              <span className="w-2.5 h-2.5 rounded-full inline-block mb-2" style={{ background: t.color }} />
              <p className="text-sm font-medium">{t.label}</p>
              <p className="font-display text-xl font-bold mt-1">{data.byType[t.key] || 0}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
