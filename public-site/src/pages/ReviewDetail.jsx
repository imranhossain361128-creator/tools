import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { trackAffiliateClick } from '../api/client';
import parseHeadings from '../utils/parseHeadings';
import RatingBreakdown from '../components/RatingBreakdown';
import ReviewFilterBar from '../components/ReviewFilterBar';
import ReviewCard from '../components/ReviewCard';
import Pagination from '../components/Pagination';
import ProsConsBox from '../components/ProsConsBox';
import RelatedArticles from '../components/RelatedArticles';

const PAGE_SIZE = 10;

export default function ReviewDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [distribution, setDistribution] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get(`/content/public/review/${slug}`)
      .then((res) => setItem(res.data))
      .catch((err) => setError(err.response?.status === 404 ? 'not-found' : 'error'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!item) return;
    api.get('/reviews/distribution', { params: { content: item._id } }).then((res) => setDistribution(res.data));
  }, [item]);

  const loadReviews = useCallback(() => {
    if (!item) return;
    setReviewsLoading(true);
    api
      .get('/reviews', {
        params: { content: item._id, rating: ratingFilter || undefined, sort, page, limit: PAGE_SIZE },
      })
      .then((res) => {
        setReviews(res.data.items);
        setReviewsTotal(res.data.total);
      })
      .finally(() => setReviewsLoading(false));
  }, [item, ratingFilter, sort, page]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const { html } = useMemo(() => parseHeadings(item?.content), [item?.content]);
  const primaryTool = item?.tools?.[0];

  const handleVisit = () => {
    if (!item || !primaryTool?.affiliateUrl) return;
    trackAffiliateClick({ contentId: item._id, toolName: primaryTool.name, affiliateUrl: primaryTool.affiliateUrl });
    window.open(primaryTool.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const handleRatingChange = (val) => {
    setRatingFilter(val);
    setPage(1);
  };
  const handleSortChange = (val) => {
    setSort(val);
    setPage(1);
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-ink-600 text-sm">Loading…</div>;
  }

  if (error === 'not-found' || !item) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Review not found</h1>
        <p className="text-ink-600 text-sm mt-2">This review doesn't exist or isn't published yet.</p>
        <Link to="/reviews" className="text-battle-blue text-sm font-medium mt-4 inline-block">
          ← Back to Reviews
        </Link>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(reviewsTotal / PAGE_SIZE));

  return (
    <article>
      {/* Header */}
      <header className="border-b border-mist-200 bg-mist-50">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-xs mb-3">
            <Link to="/reviews" className="font-semibold text-battle-blue">
              Reviews
            </Link>
            {item.category?.name && (
              <>
                <span className="text-mist-200">•</span>
                <span className="text-ink-600">{item.category.name}</span>
              </>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight">{item.title}</h1>
          {item.excerpt && <p className="text-ink-600 text-sm mt-3 max-w-2xl">{item.excerpt}</p>}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
        <div className="min-w-0">
          {/* Rating breakdown */}
          <RatingBreakdown distribution={distribution} />

          <ProsConsBox tool={primaryTool} />

          {/* Editorial verdict (collapsed-ish, short) */}
          {html && (
            <div
              className="prose prose-sm max-w-none mt-8 prose-headings:font-display prose-headings:font-bold prose-a:text-battle-blue"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}

          {/* Individual reviews */}
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold mb-4">Customer Reviews</h2>
            <ReviewFilterBar
              rating={ratingFilter}
              onRatingChange={handleRatingChange}
              sort={sort}
              onSortChange={handleSortChange}
              total={reviewsTotal}
            />

            {reviewsLoading && <p className="text-sm text-ink-600 py-6">Loading reviews…</p>}
            {!reviewsLoading && reviews.length === 0 && (
              <p className="text-sm text-ink-600 py-6">
                No reviews match this filter yet. Try a different rating, or check back soon.
              </p>
            )}

            <div>
              {reviews.map((r) => (
                <ReviewCard key={r._id} review={r} />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>

        {/* Sidebar */}
        <aside>
          {primaryTool && (
            <div className="bg-white border border-mist-200 rounded-2xl p-5 sticky top-20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-battle-blue/10 flex items-center justify-center font-display font-bold text-battle-blue text-lg shrink-0">
                  {primaryTool.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-display font-bold">{primaryTool.name}</p>
                  <p className="text-xs text-ink-600">{distribution?.average || primaryTool.rating}/5</p>
                </div>
              </div>
              {primaryTool.pricing && (
                <div className="flex items-center justify-between text-sm py-2 border-t border-mist-100">
                  <span className="text-ink-600">Starting price</span>
                  <span className="font-medium">{primaryTool.pricing}</span>
                </div>
              )}
              {primaryTool.affiliateUrl && (
                <button
                  onClick={handleVisit}
                  className="w-full mt-3 bg-battle-blue text-white text-sm font-semibold py-3 rounded-lg hover:opacity-90 transition"
                >
                  Visit {primaryTool.name} →
                </button>
              )}
            </div>
          )}
        </aside>
      </div>

      <RelatedArticles type="review" excludeId={item._id} />
    </article>
  );
}
