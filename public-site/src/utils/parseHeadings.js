import slugify from './slugify';

/**
 * Takes a raw HTML string (the article body), finds every <h2> and <h3>,
 * gives each one a stable id (slugified from its text, de-duplicated),
 * and returns both the updated HTML and a flat list for the table of contents.
 */
export default function parseHeadings(html) {
  if (!html || typeof window === 'undefined') return { html: html || '', toc: [] };

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h2, h3');
  const used = new Map();
  const toc = [];

  headings.forEach((el) => {
    const text = el.textContent.trim();
    if (!text) return;
    let id = slugify(text) || 'section';
    const count = used.get(id) || 0;
    used.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;

    el.id = id;
    toc.push({ id, text, level: el.tagName === 'H2' ? 2 : 3 });
  });

  return { html: doc.body.innerHTML, toc };
}
