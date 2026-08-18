import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { contentHref, CONTENT_TYPES } from '../config/contentTypes';

function ArticleThumb({ item }) {
  if (item.featuredImage) {
    return <img src={item.featuredImage} alt="" className="w-full h-28 object-cover" />;
  }
  return (
    <div className="w-full h-28 bg-battle-gold flex items-center justify-center">
      <span className="font-display font-extrabold text-navy-900 text-xs text-center px-3 leading-tight">
        {item.title}
      </span>
    </div>
  );
}

export default function ContentHub() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/content', { params: { status: 'published', limit: 6 } })
      .then((res) => setItems(res.data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-mist-50 py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold">Latest articles in ContentHub</h2>
          <Link to="/blog" className="text-sm font-medium text-battle-blue">
            More articles →
          </Link>
        </div>

        {loading && <p className="text-sm text-ink-600">Loading articles…</p>}
        {!loading && items.length === 0 && <p className="text-sm text-ink-600">No articles published yet.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link
              key={item._id}
              to={contentHref(item)}
              className="bg-white border border-mist-200 rounded-xl overflow-hidden hover:shadow-sm hover:border-battle-blue transition"
            >
              <ArticleThumb item={item} />
              <div className="p-4">
                <div className="flex items-center gap-2 text-[11px] text-ink-600 mb-1.5">
                  <span className="font-semibold text-battle-blue uppercase">
                    {CONTENT_TYPES[item.type]?.label}
                  </span>
                  <span>·</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="font-semibold text-sm leading-snug line-clamp-2">{item.title}</p>
                <p className="text-xs text-ink-600 mt-1.5 line-clamp-2">{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
