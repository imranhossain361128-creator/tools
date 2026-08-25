import Stars from './Stars';

function Cell({ children }) {
  return <td className="px-4 py-3 text-sm text-ink-700 text-center">{children ?? '—'}</td>;
}

export default function ComparisonTable({ toolA, toolB }) {
  if (!toolA || !toolB) return null;

  const rows = [
    {
      label: 'Rating',
      a: <Stars rating={toolA.rating || 0} size={13} />,
      b: <Stars rating={toolB.rating || 0} size={13} />,
    },
    { label: 'Pricing', a: toolA.pricing, b: toolB.pricing },
    { label: 'Best pro', a: toolA.pros?.[0], b: toolB.pros?.[0] },
    { label: 'Main drawback', a: toolA.cons?.[0], b: toolB.cons?.[0] },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-mist-200">
      <table className="w-full">
        <thead>
          <tr className="bg-mist-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-ink-600 uppercase tracking-wide">
              Feature
            </th>
            <th className="px-4 py-3 text-center text-sm font-display font-bold">{toolA.name}</th>
            <th className="px-4 py-3 text-center text-sm font-display font-bold">{toolB.name}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-mist-100">
          {rows.map((r) => (
            <tr key={r.label}>
              <td className="px-4 py-3 text-sm font-medium text-ink-900">{r.label}</td>
              <Cell>{r.a}</Cell>
              <Cell>{r.b}</Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
