import { useEffect, useState } from 'react';
import api from '../api/client';
import TopicTabs from '../components/TopicTabs';
import ArticleRow from '../components/ArticleRow';
import NewsletterBox from '../components/NewsletterBox';
import TopicSection from '../components/TopicSection';
import { CONTENT_TYPES } from '../config/contentTypes';

const SECTION_ACCENTS = {
  comparison: '#4C7DFF',
  review: '#22B07D',
  alternative: '#FF7A33',
  statistic: '#A855F7',
  directory: '#EF4444',
};

export default function Blog() {
  const [latest, setLatest] = useState([]);
  const [totals, setTotals] = useState({ articles: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/content', { params: { status: 'published', limit: 6 } }),
      api.get('/content', { params: { status: 'published', limit: 1 } }), // just for the total count
      api.get('/categories'),
    ])
      .then(([latestRes, countRes, catRes]) => {
        setLatest(latestRes.data.items);
        setTotals({ articles: countRes.data.total, categories: catRes.data.length });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <TopicTabs active="all" />

      {/* Hero */}
      <section className="border-b border-mist-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="font-display text-3xl font-extrabold">ToolsBattle Blog</h1>
          <p className="text-ink-600 text-sm mt-2 max-w-xl">
            Comparisons, reviews, alternatives, statistics, and AI tool profiles — everything
            you need to pick the right software, in one place.
          </p>
          <div className="flex items-center gap-6 mt-5 text-sm text-ink-600">
            <span>
              <strong className="text-ink-900">{totals.articles}</strong> published articles
            </span>
            <span>
              <strong className="text-ink-900">{totals.categories}</strong> categories
            </span>
          </div>
        </div>
      </section>

      {/* Latest feed */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="font-display text-xl font-bold mb-2">Latest</h2>
        {loading && <p className="text-sm text-ink-600 py-4">Loading articles…</p>}
        {!loading && latest.length === 0 && (
          <p className="text-sm text-ink-600 py-4">
            Nothing published yet — add content from the admin dashboard to populate this feed.
          </p>
        )}
        <div>
          {latest.map((item, i) => (
            <ArticleRow key={item._id} item={item} showDivider={i < latest.length - 1} />
          ))}
        </div>
      </section>

      <NewsletterBox />

      {Object.entries(CONTENT_TYPES).map(([key, cfg]) => (
        <TopicSection
          key={key}
          type={key}
          title={cfg.label}
          viewAllHref={`/blog/${key}`}
          accent={SECTION_ACCENTS[key]}
        />
      ))}
    </>
  );
}
