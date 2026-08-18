import { useEffect } from 'react';

// Accepts either raw JSON-LD ({ "@context": ... }) or a full <script> tag
// copied from a schema generator, and injects it into <head> as a proper
// application/ld+json script tag for the lifetime of the page.
export default function JsonLdSchema({ schema }) {
  useEffect(() => {
    if (!schema || !schema.trim()) return;

    let jsonContent = schema.trim();
    const scriptMatch = jsonContent.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    if (scriptMatch) jsonContent = scriptMatch[1].trim();

    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.text = jsonContent;
    document.head.appendChild(el);

    return () => {
      document.head.removeChild(el);
    };
  }, [schema]);

  return null;
}
