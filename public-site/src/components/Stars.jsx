export default function Stars({ rating = 0, size = 14 }) {
  const full = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill={i <= full ? '#F0B429' : '#E2E5ED'}
        >
          <path d="M10 1.5l2.6 5.4 5.9.7-4.3 4.1 1.1 5.8L10 14.7l-5.3 2.8 1.1-5.8L1.5 7.6l5.9-.7z" />
        </svg>
      ))}
    </span>
  );
}
