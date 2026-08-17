const STAR_FILTERS = [
  { value: '', label: 'All ratings' },
  { value: '5', label: '5 stars' },
  { value: '4', label: '4 stars' },
  { value: '3', label: '3 stars' },
  { value: '2', label: '2 stars' },
  { value: '1', label: '1 star' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Most Recent' },
  { value: 'helpful', label: 'Most Helpful' },
  { value: 'highest', label: 'Highest Rated' },
  { value: 'lowest', label: 'Lowest Rated' },
];

export default function ReviewFilterBar({ rating, onRatingChange, sort, onSortChange, total }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
      <div className="flex flex-wrap gap-1.5">
        {STAR_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onRatingChange(f.value)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              rating === f.value
                ? 'bg-navy-900 text-white border-navy-900'
                : 'border-mist-200 text-ink-700 hover:border-navy-900'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-ink-600">{total.toLocaleString()} reviews</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-sm border border-mist-200 rounded-lg px-3 py-1.5 bg-white"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              Sort: {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
