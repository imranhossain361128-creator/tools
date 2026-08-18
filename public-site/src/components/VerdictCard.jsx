import Stars from './Stars';

export default function VerdictCard({ tool, onVisit }) {
  if (!tool) return null;

  return (
    <div className="bg-white border border-mist-200 rounded-2xl p-5 sticky top-20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-battle-blue/10 flex items-center justify-center font-display font-bold text-battle-blue text-lg shrink-0">
          {tool.name?.charAt(0)}
        </div>
        <div>
          <p className="font-display font-bold">{tool.name}</p>
          <div className="flex items-center gap-1.5">
            <Stars rating={tool.rating || 0} size={13} />
            <span className="text-xs text-ink-600">{tool.rating?.toFixed(1)}/5</span>
          </div>
        </div>
      </div>

      {tool.pricing && (
        <div className="flex items-center justify-between text-sm py-2 border-t border-mist-100">
          <span className="text-ink-600">Pricing</span>
          <span className="font-medium">{tool.pricing}</span>
        </div>
      )}

      {tool.affiliateUrl && (
        <button
          onClick={onVisit}
          className="w-full mt-3 bg-battle-blue text-white text-sm font-semibold py-3 rounded-lg hover:opacity-90 transition"
        >
          Visit {tool.name} →
        </button>
      )}

      {(tool.pros?.length > 0 || tool.cons?.length > 0) && (
        <div className="mt-4 pt-4 border-t border-mist-100 space-y-1.5">
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
    </div>
  );
}
