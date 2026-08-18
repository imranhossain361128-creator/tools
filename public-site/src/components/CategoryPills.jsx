export default function CategoryPills({ categories, active, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect('')}
        className={`text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
          active === ''
            ? 'bg-navy-900 text-white border-navy-900'
            : 'border-mist-200 text-ink-700 hover:border-navy-900'
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c._id}
          onClick={() => onSelect(c._id)}
          className={`text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
            active === c._id
              ? 'bg-navy-900 text-white border-navy-900'
              : 'border-mist-200 text-ink-700 hover:border-navy-900'
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
