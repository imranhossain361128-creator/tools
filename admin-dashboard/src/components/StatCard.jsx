export default function StatCard({ label, value, accent = '#3E7BFA', suffix = '' }) {
  return (
    <div className="bg-white rounded-2xl border border-mist-200 p-5">
      <p className="text-xs font-medium text-ink-600 uppercase tracking-wide">{label}</p>
      <p className="font-display text-3xl font-bold mt-2" style={{ color: accent }}>
        {value}
        <span className="text-base font-medium text-ink-600">{suffix}</span>
      </p>
    </div>
  );
}
