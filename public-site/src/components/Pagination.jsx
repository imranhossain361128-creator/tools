export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const windowSize = 2;
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= windowSize) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="text-sm font-medium px-3 py-2 rounded-lg border border-mist-200 text-ink-700 disabled:opacity-40 hover:border-battle-blue transition"
      >
        Prev
      </button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-2 text-ink-600 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`text-sm font-medium w-9 h-9 rounded-lg transition ${
              p === page ? 'bg-battle-blue text-white' : 'text-ink-700 hover:bg-mist-100'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="text-sm font-medium px-3 py-2 rounded-lg border border-mist-200 text-ink-700 disabled:opacity-40 hover:border-battle-blue transition"
      >
        Next
      </button>
    </div>
  );
}
