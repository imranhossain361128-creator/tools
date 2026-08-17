import { Link } from 'react-router-dom';
import useSettings from '../hooks/useSettings';

const COLUMN_ORDER = ['Explore', 'Company', 'Legal'];

export default function Footer() {
  const { settings } = useSettings();
  const siteName = settings?.siteName || 'ToolsBattle';
  const tagline =
    settings?.footerTagline ||
    'Compare the best SaaS, AI & software tools with honest, independent reviews.';
  const links = settings?.footerLinks || [];
  const social = settings?.socialLinks || {};

  const columns = COLUMN_ORDER.map((name) => ({
    title: name,
    links: links.filter((l) => l.column === name),
  })).filter((col) => col.links.length > 0);

  return (
    <footer className="bg-navy-950 text-white/70 pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <Link to="/" className="font-display font-extrabold text-white text-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-battle-gold" />
              {siteName}
            </Link>
            <p className="text-xs mt-3 max-w-[200px]">{tagline}</p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold text-white uppercase tracking-wide mb-3">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link to={l.href} className="text-xs hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex items-center gap-3 text-xs">
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Facebook
              </a>
            )}
            {social.twitter && (
              <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Twitter
              </a>
            )}
            {social.youtube && (
              <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                YouTube
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
