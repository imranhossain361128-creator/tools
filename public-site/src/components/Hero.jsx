import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSettings from '../hooks/useSettings';

export default function Hero() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { settings } = useSettings();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const badge = settings?.heroBadge || '★ Trusted SaaS Reviews & Comparisons';
  const titleStart = settings?.heroTitle || 'Find The Best';
  const titleAccent = settings?.heroTitleAccent || 'Software';
  const titleEnd = settings?.heroTitleEnd || 'For Your Business';
  const subtitle =
    settings?.heroSubtitle ||
    'Compare SaaS tools, read expert reviews, discover alternatives, and choose the perfect software for your business.';
  const trustText = settings?.heroTrustText || '★★★★★ Trusted by 30,000+ Business Owners';

  return (
    <section className="bg-gradient-to-b from-navy-950 to-navy-900 text-white">
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <span className="inline-block text-xs font-medium text-white/70 bg-white/10 px-3 py-1.5 rounded-full mb-5">
          {badge}
        </span>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight">
          {titleStart} <span className="text-battle-blue">{titleAccent}</span>
          <br />
          {titleEnd}
        </h1>

        <p className="text-white/60 text-sm sm:text-base mt-4 max-w-xl mx-auto">{subtitle}</p>

        <form onSubmit={handleSearch} className="mt-7 flex max-w-md mx-auto shadow-lg rounded-lg overflow-hidden">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for software…"
            className="flex-1 px-4 py-3 text-sm text-ink-900 outline-none"
          />
          <button className="bg-battle-blue px-5 text-sm font-semibold hover:opacity-90 transition">
            Search
          </button>
        </form>

        <div className="mt-5 flex items-center justify-center gap-3">
          <a
            href="/category/all"
            className="text-xs font-semibold bg-battle-blue px-4 py-2.5 rounded-lg hover:opacity-90 transition"
          >
            Compare Software
          </a>
          <a
            href="/alternatives"
            className="text-xs font-semibold bg-white text-navy-900 px-4 py-2.5 rounded-lg hover:bg-mist-100 transition"
          >
            Find Alternatives
          </a>
        </div>

        <p className="text-white/40 text-xs mt-6">{trustText}</p>
      </div>
    </section>
  );
}
