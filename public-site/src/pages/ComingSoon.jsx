export default function ComingSoon({ label }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">{label || 'This page'} is coming soon</h1>
      <p className="text-ink-600 text-sm mt-2">
        We're building this out next. Check back soon, or head back to the homepage.
      </p>
    </div>
  );
}
