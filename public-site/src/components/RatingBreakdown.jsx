import Stars from './Stars';

export default function RatingBreakdown({ distribution }) {
  if (!distribution) return null;

  return (
    <div className="bg-white border border-mist-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-8">
      <div className="text-center shrink-0">
        <p className="font-display text-5xl font-extrabold text-ink-900">{distribution.average || '—'}</p>
        <div className="flex justify-center mt-1">
          <Stars rating={distribution.average || 0} size={16} />
        </div>
        <p className="text-xs text-ink-600 mt-1">{distribution.total.toLocaleString()} reviews</p>
      </div>

      <div className="flex-1 w-full space-y-1.5">
        {distribution.breakdown.map((b) => (
          <div key={b.star} className="flex items-center gap-3 text-sm">
            <span className="w-10 text-ink-600 shrink-0">{b.star} star</span>
            <div className="flex-1 h-2.5 bg-mist-100 rounded-full overflow-hidden">
              <div className="h-full bg-battle-gold" style={{ width: `${b.percent}%` }} />
            </div>
            <span className="w-12 text-ink-600 text-right shrink-0">{b.count.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
