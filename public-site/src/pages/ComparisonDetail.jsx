import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { trackAffiliateClick } from '../api/client';
import parseHeadings from '../utils/parseHeadings';
import ComparisonToolCard from '../components/ComparisonToolCard';
import ComparisonTable from '../components/ComparisonTable';
import TableOfContents from '../components/TableOfContents';
import RelatedArticles from '../components/RelatedArticles';
import NewsletterBox from '../components/NewsletterBox';
import JsonLdSchema from '../components/JsonLdSchema';

export default function ComparisonDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get(`/content/public/comparison/${slug}`)
      .then((res) => setItem(res.data))
      .catch((err) => setError(err.response?.status === 404 ? 'not-found' : 'error'))
      .finally(() => setLoading(false));
  }, [slug]);

  const { html, toc } = useMemo(() => parseHeadings(item?.content), [item?.content]);

  const toolA = item?.tools?.[0];
  const toolB = item?.tools?.[1];
  const winner = toolA && toolB ? (toolA.rating >= toolB.rating ? toolA : toolB) : null;

  const handleVisit = (tool) => {
    if (!item || !tool?.affiliateUrl) return;
    trackAffiliateClick({ contentId: item._id, toolName: tool.name, affiliateUrl: tool.affiliateUrl });
    window.open(tool.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-ink-600 text-sm">Loading…</div>;
  }

  if (error === 'not-found' || !item) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Comparison not found</h1>
        <p className="text-ink-600 text-sm mt-2">
          This comparison doesn't exist or isn't published yet.
        </p>
        <Link to="/blog" className="text-battle-blue text-sm font-medium mt-4 inline-block">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const date = new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article>
      <JsonLdSchema schema={item.customSchema} />

      {/* Header */}
      <header className="bg-mist-50 border-b border-mist-200">
        <div className="max-w-4xl mx-auto px-6 pt-10 pb-10 text-center">
          <div className="flex items-center justify-center gap-2 text-xs mb-4">
            <Link to="/blog/comparison" className="font-semibold text-battle-blue">
              Comparisons
            </Link>
            {item.category?.name && (
              <>
                <span className="text-mist-200">•</span>
                <span className="text-ink-600">{item.category.name}</span>
              </>
            )}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight">{item.title}</h1>
          <p className="text-ink-600 text-xs mt-3">Updated {date}</p>
          {item.excerpt && (
            <p className="text-ink-700 text-sm sm:text-base mt-4 max-w-xl mx-auto">{item.excerpt}</p>
          )}
        </div>
      </header>

      {/* Side-by-side tool cards */}
      {toolA && toolB && (
        <section className="max-w-4xl mx-auto px-6 -mt-2 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <ComparisonToolCard
              tool={toolA}
              highlight={winner === toolA}
              onVisit={() => handleVisit(toolA)}
            />
            <span className="font-display text-lg font-bold text-ink-600 justify-self-center">VS</span>
            <ComparisonToolCard
              tool={toolB}
              highlight={winner === toolB}
              onVisit={() => handleVisit(toolB)}
            />
          </div>
        </section>
      )}

      {/* Comparison table */}
      {toolA && toolB && (
        <section className="max-w-4xl mx-auto px-6 py-10">
          <h2 className="font-display text-xl font-bold mb-4">Side-by-side comparison</h2>
          <ComparisonTable toolA={toolA} toolB={toolB} />
        </section>
      )}

      {/* Verdict */}
      {winner && (
        <section className="max-w-4xl mx-auto px-6 pb-10">
          <div className="bg-forest-800 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Our verdict</p>
              <p className="font-display text-lg font-bold">
                {winner.name} is the better choice for most people
              </p>
            </div>
            {winner.affiliateUrl && (
              <button
                onClick={() => handleVisit(winner)}
                className="bg-battle-blue text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition shrink-0"
              >
                Visit {winner.name} →
              </button>
            )}
          </div>
        </section>
      )}

      {/* Body + ToC */}
      <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10">
        <div
          className="prose prose-sm sm:prose-base max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-battle-blue prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: html || '<p>Full write-up coming soon.</p>' }}
        />
        <aside>
          <TableOfContents toc={toc} />
        </aside>
      </div>

      <NewsletterBox />
      <RelatedArticles type="comparison" excludeId={item._id} />
    </article>
  );
}
