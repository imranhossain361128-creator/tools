import Stars from './Stars';

export default function ReviewCard({ review }) {
  const date = new Date(review.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="border-b border-mist-200 py-6">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {review.reviewerName?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-900">{review.reviewerName}</p>
            <p className="text-xs text-ink-600">
              {[review.reviewerRole, review.companyIndustry, review.companySize].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <Stars rating={review.rating} size={13} />
          <p className="text-xs text-ink-600 mt-0.5">{date}</p>
        </div>
      </div>

      {review.title && <p className="font-semibold text-sm mt-3">{review.title}</p>}
      {review.body && <p className="text-sm text-ink-700 mt-1.5 leading-relaxed">{review.body}</p>}

      {(review.pros || review.cons) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {review.pros && (
            <p className="text-xs text-ink-700">
              <span className="font-semibold text-green-700">Pros: </span>
              {review.pros}
            </p>
          )}
          {review.cons && (
            <p className="text-xs text-ink-700">
              <span className="font-semibold text-red-600">Cons: </span>
              {review.cons}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 mt-3 text-xs text-ink-600">
        {review.source && review.source !== 'ToolsBattle' && (
          <span className="bg-mist-100 px-2 py-0.5 rounded-full">{review.source}</span>
        )}
        {review.helpfulCount > 0 && <span>👍 {review.helpfulCount} found this helpful</span>}
      </div>
    </div>
  );
}
