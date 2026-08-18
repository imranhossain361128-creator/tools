import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CONTENT_TYPES } from '../config/contentTypes';

const navItemBase =
  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-mist-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-ink-900 text-white flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-lg">
              <span className="text-battle-blue">Tools</span>
              <span className="text-battle-orange">Battle</span>
            </span>
          </div>
          <p className="text-[11px] text-white/40 mt-1 tracking-wide uppercase">Admin Dashboard</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${navItemBase} ${isActive ? 'bg-battle-blue text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
            }
          >
            Overview
          </NavLink>

          <p className="px-4 pt-4 pb-1 text-[11px] uppercase tracking-wide text-white/30">Content</p>
          {CONTENT_TYPES.map((t) => (
            <NavLink
              key={t.key}
              to={`/content/${t.key}`}
              className={({ isActive }) =>
                `${navItemBase} ${isActive ? 'bg-battle-blue text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
              }
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: t.color }} />
              {t.label}
            </NavLink>
          ))}

          <p className="px-4 pt-4 pb-1 text-[11px] uppercase tracking-wide text-white/30">Site</p>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `${navItemBase} ${isActive ? 'bg-battle-blue text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
            }
          >
            Categories
          </NavLink>
          <NavLink
            to="/pages"
            className={({ isActive }) =>
              `${navItemBase} ${isActive ? 'bg-battle-blue text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
            }
          >
            Static Pages
          </NavLink>
          <NavLink
            to="/affiliate"
            className={({ isActive }) =>
              `${navItemBase} ${isActive ? 'bg-battle-blue text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
            }
          >
            Affiliate Clicks
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${navItemBase} ${isActive ? 'bg-battle-blue text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
            }
          >
            Site Settings
          </NavLink>
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-white/40 truncate mb-3">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full text-sm px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
