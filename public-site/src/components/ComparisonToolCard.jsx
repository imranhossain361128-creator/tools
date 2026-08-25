import Stars from './Stars';

export default function ComparisonToolCard({ tool, onVisit, highlight = false }) {
  if (!tool) return null;

  return (
    <div
      className={`bg-white rounded-2xl p-6 flex flex-col border-2 ${
        highlight ? 'border-battle-blue' : 'border-mist-200'
      }`}
    >
      {highlight && (
        <span className="self-start text-[11px] font-semibold bg-battle-blue text-white px-2.5 py-1 rounded-full mb-3">
          Our pick
        </span>
      )}

      <div className="w-14 h-14 rounded-2xl bg-battle-blue/10 flex items-center justify-center font-display font-bold text-battle-blue text-2xl mb-4">
        {tool.name?.charAt(0)}
      </div>

      <h3 className="font-display text-xl font-bold">{tool.name}</h3>
      <div className="flex items-center gap-1.5 mt-1.5">
        <Stars rating={tool.rating || 0} size={15} />
        <span className="text-sm text-ink-600">{tool.rating?.toFixed(1) || '—'}/5</span>
      </div>

      {tool.pricing && <p className="text-sm text-ink-700 mt-3 font-medium">{tool.pricing}</p>}

      {(tool.pros?.length > 0 || tool.cons?.length > 0) && (
        <div className="mt-4 space-y-1.5 flex-1">
          {tool.pros?.slice(0, 3).map((p, i) => (
            <p key={`p${i}`} className="text-xs text-ink-700 flex gap-1.5">
              <span className="text-green-600 shrink-0">✓</span> {p}
            </p>
          ))}
          {tool.cons?.slice(0, 2).map((c, i) => (
            <p key={`c${i}`} className="text-xs text-ink-700 flex gap-1.5">
              <span className="text-red-500 shrink-0">✕</span> {c}
            </p>
          ))}
        </div>
      )}

      {tool.affiliateUrl && (
        <button
          onClick={onVisit}
          className="w-full mt-5 bg-battle-blue text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
        >
          Visit {tool.name} →
        </button>
      )}
    </div>
  );
}
