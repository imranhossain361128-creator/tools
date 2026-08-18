import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { trackAffiliateClick } from '../api/client';
import parseHeadings from '../utils/parseHeadings';
import { contentHref } from '../config/contentTypes';
import JsonLdSchema from '../components/JsonLdSchema';

function RelatedToolCard({ item }) {
  const tool = item.tools?.[0];
  return (
    <Link
      to={contentHref(item)}
      className="block bg-white border border-mist-200 rounded-xl overflow-hidden hover:border-battle-blue hover:shadow-sm transition"
    >
      <div className="aspect-[16/10] bg-mist-100">
        {item.featuredImage ? (
          <img src={item.featuredImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-battle-blue/10 to-battle-gold/10">
            <span className="font-display font-extrabold text-2xl text-battle-blue/40">
              {(tool?.name || item.title).charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-semibold text-sm leading-snug line-clamp-2">{item.title}</p>
        {item.category?.name && (
          <span className="inline-block mt-2 text-[11px] font-medium text-battle-blue bg-battle-blue/10 px-2 py-0.5 rounded-full">
            {item.category.name}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function DirectoryDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get(`/content/public/directory/${slug}`)
      .then((res) => setItem(res.data))
      .catch((err) => setError(err.response?.status === 404 ? 'not-found' : 'error'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!item) return;
    api
      .get('/content', { params: { type: 'directory', status: 'published', limit: 4 } })
      .then((res) => setRelated(res.data.items.filter((i) => i._id !== item._id).slice(0, 3)))
      .catch(() => setRelated([]));
  }, [item]);

  const { html } = useMemo(() => parseHeadings(item?.content), [item?.content]);
  const tool = item?.tools?.[0];

  const handleVisit = () => {
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
        <h1 className="font-display text-2xl font-bold">Tool not found</h1>
        <p className="text-ink-600 text-sm mt-2">This directory listing doesn't exist or isn't published yet.</p>
        <Link to="/ai-tools-directory" className="text-battle-blue text-sm font-medium mt-4 inline-block">
          ← Back to directory
        </Link>
      </div>
    );
  }

  return (
    <article>
      <JsonLdSchema schema={item.customSchema} />
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <Link to="/ai-tools-directory" className="text-sm font-medium text-battle-blue">
          ← Back to directory
        </Link>
      </div>

      <header className="max-w-4xl mx-auto px-6 pt-4 pb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight">{item.title}</h1>
      </header>

      <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8">
        {/* Screenshot */}
        <div>
          <div className="aspect-[16/9] bg-mist-100 rounded-2xl overflow-hidden border border-mist-200">
            {item.featuredImage ? (
              <img src={item.featuredImage} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-battle-blue/10 to-battle-gold/10">
                <span className="font-display font-extrabold text-5xl text-battle-blue/40">
                  {(tool?.name || item.title).charAt(0)}
                </span>
              </div>
            )}
          </div>

          {item.excerpt && <p className="text-base text-ink-700 mt-6">{item.excerpt}</p>}

          {html && (
            <div
              className="prose prose-sm sm:prose-base max-w-none mt-6 prose-headings:font-display prose-headings:font-bold prose-a:text-battle-blue prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>

        {/* Info card */}
        <aside>
          <div className="bg-white border border-mist-200 rounded-2xl p-5 sticky top-20">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-600 mb-1">Pricing</p>
            <p className="text-sm font-medium mb-4">{tool?.pricing || 'Not specified'}</p>

            <p className="text-xs font-semibold uppercase tracking-wide text-ink-600 mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {item.category?.name && (
                <span className="text-xs font-medium text-battle-blue bg-battle-blue/10 px-2.5 py-1 rounded-full">
                  {item.category.name}
                </span>
              )}
            </div>

            {tool?.affiliateUrl && (
              <button
                onClick={handleVisit}
                className="w-full bg-battle-blue text-white text-sm font-semibold py-3 rounded-lg hover:opacity-90 transition"
              >
                Try {tool.name} →
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* Related tools */}
      {related.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-14 mt-6 border-t border-mist-200">
          <h2 className="font-display text-xl font-bold mb-6">Trending AI tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <RelatedToolCard key={r._id} item={r} />
            ))}
          </div>
        </section>
      )}

      {/* CTA banner */}
      <section className="bg-forest-800 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h2 className="font-display text-xl font-bold">Looking for something else?</h2>
          <p className="text-white/60 text-sm mt-2 mb-6">
            Browse the full AI Tools Directory to compare more options.
          </p>
          <Link
            to="/ai-tools-directory"
            className="inline-block bg-battle-blue text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
          >
            Browse the directory
          </Link>
        </div>
      </section>
    </article>
  );
}
