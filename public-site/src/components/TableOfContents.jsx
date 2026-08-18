import { useEffect, useState } from 'react';

export default function TableOfContents({ toc }) {
  const [activeId, setActiveId] = useState(toc[0]?.id);

  useEffect(() => {
    if (toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-100px 0px -70% 0px' }
    );
    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav className="bg-white border border-mist-200 rounded-xl p-4 sticky top-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-600 mb-3">
        Table of Contents
      </p>
      <ul className="space-y-1.5">
        {toc.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
            <a
              href={`#${item.id}`}
              className={`block text-sm py-0.5 border-l-2 pl-2.5 -ml-px transition-colors ${
                activeId === item.id
                  ? 'border-battle-blue text-battle-blue font-medium'
                  : 'border-transparent text-ink-600 hover:text-ink-900'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
