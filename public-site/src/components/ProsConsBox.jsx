export default function ProsConsBox({ tool }) {
  if (!tool || (!tool.pros?.length && !tool.cons?.length)) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-8">
      <div className="bg-green-50 border border-green-100 rounded-xl p-5">
        <p className="text-sm font-semibold text-green-800 mb-3">What we like</p>
        <ul className="space-y-2">
          {tool.pros?.map((p, i) => (
            <li key={i} className="text-sm text-ink-700 flex gap-2">
              <span className="text-green-600 shrink-0">✓</span> {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-red-50 border border-red-100 rounded-xl p-5">
        <p className="text-sm font-semibold text-red-800 mb-3">Where it falls short</p>
        <ul className="space-y-2">
          {tool.cons?.map((c, i) => (
            <li key={i} className="text-sm text-ink-700 flex gap-2">
              <span className="text-red-500 shrink-0">✕</span> {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
