import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import ContentList from './pages/ContentList';
import ContentEditor from './pages/ContentEditor';
import Categories from './pages/Categories';
import Pages from './pages/Pages';
import AffiliateStats from './pages/AffiliateStats';
import ReviewsManager from './pages/ReviewsManager';
import Settings from './pages/Settings';

function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="content/:type" element={<ContentList />} />
        <Route path="content/:type/:id" element={<ContentEditor />} />
        <Route path="content/review/:id/reviews" element={<ReviewsManager />} />
        <Route path="categories" element={<Categories />} />
        <Route path="pages" element={<Pages />} />
        <Route path="affiliate" element={<AffiliateStats />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
