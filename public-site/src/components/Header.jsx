import { Link } from 'react-router-dom';
import useSettings from '../hooks/useSettings';

const FALLBACK_NAV = [
  { label: 'Software Categories', href: '/category/all' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Blog', href: '/blog' },
];

export default function Header() {
  const { settings } = useSettings();
  const navLinks = settings?.navLinks?.length ? settings.navLinks : FALLBACK_NAV;
  const siteName = settings?.siteName || 'ToolsBattle';

  return (
    <header className="bg-forest-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="font-display font-extrabold text-lg flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-battle-gold" />
          {siteName}
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-white/80">
          {navLinks.map((l) => (
            <Link key={l.href} to={l.href} className="hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/get-recommendation"
          className="text-xs font-semibold bg-white text-forest-800 px-4 py-2 rounded-full hover:bg-mist-100 transition-colors"
        >
          Get Free Recommendation
        </Link>
      </div>
    </header>
  );
}
