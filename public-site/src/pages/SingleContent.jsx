import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { trackAffiliateClick } from '../api/client';
import parseHeadings from '../utils/parseHeadings';
import { CONTENT_TYPES } from '../config/contentTypes';
import TableOfContents from '../components/TableOfContents';
import VerdictCard from '../components/VerdictCard';
import ProsConsBox from '../components/ProsConsBox';
import RelatedArticles from '../components/RelatedArticles';
import NewsletterBox from '../components/NewsletterBox';
import JsonLdSchema from '../components/JsonLdSchema';

export default function SingleContent({ type }) {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get(`/content/public/${type}/${slug}`)
      .then((res) => setItem(res.data))
      .catch((err) => setError(err.response?.status === 404 ? 'not-found' : 'error'))
      .finally(() => setLoading(false));
  }, [type, slug]);

  const { html, toc } = useMemo(() => parseHeadings(item?.content), [item?.content]);

  const primaryTool = item?.tools?.[0];

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
        <h1 className="font-display text-2xl font-bold">Page not found</h1>
        <p className="text-ink-600 text-sm mt-2">
          This {CONTENT_TYPES[type]?.label.toLowerCase() || 'page'} doesn't exist or isn't published yet.
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
      <header className="border-b border-mist-200">
        <div className="max-w-3xl mx-auto px-6 pt-10 pb-8">
          <div className="flex items-center gap-2 text-xs mb-4">
            <Link to={`/blog/${type}`} className="font-semibold text-battle-blue">
              {CONTENT_TYPES[type]?.label}
            </Link>
            {item.category?.name && (
              <>
                <span className="text-mist-200">•</span>
                <span className="text-ink-600">{item.category.name}</span>
              </>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight">{item.title}</h1>

          <div className="flex items-center gap-3 mt-5">
            <div className="w-9 h-9 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
              TB
            </div>
            <div className="text-sm">
              <p className="font-medium text-ink-900">ToolsBattle Editorial Team</p>
              <p className="text-ink-600 text-xs">Updated {date}</p>
            </div>
          </div>
        </div>
      </header>

      {item.featuredImage && (
        <div className="max-w-5xl mx-auto px-6 -mt-2 mb-2 pt-8">
          <img src={item.featuredImage} alt={item.title} className="w-full rounded-2xl object-cover max-h-[420px]" />
        </div>
      )}

      {/* Body + sidebar */}
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
        <div className="min-w-0">
          {item.excerpt && (
            <p className="text-base text-ink-700 border-l-2 border-battle-blue pl-4 mb-8 italic">
              {item.excerpt}
            </p>
          )}

          <ProsConsBox tool={primaryTool} />

          <div
            className="prose prose-sm sm:prose-base max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-battle-blue prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: html || '<p>Content coming soon.</p>' }}
          />

          {primaryTool?.affiliateUrl && (
            <div className="not-prose mt-10 bg-forest-800 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-display font-bold">Ready to try {primaryTool.name}?</p>
                <p className="text-white/60 text-sm mt-0.5">
                  {primaryTool.pricing || 'See current pricing on their site.'}
                </p>
              </div>
              <button
                onClick={() => handleVisit(primaryTool)}
                className="bg-battle-blue text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition shrink-0"
              >
                Visit {primaryTool.name} →
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <TableOfContents toc={toc} />
          <VerdictCard tool={primaryTool} onVisit={() => handleVisit(primaryTool)} />
        </aside>
      </div>

      <NewsletterBox />

      <RelatedArticles type={type} excludeId={item._id} />
    </article>
  );
}
