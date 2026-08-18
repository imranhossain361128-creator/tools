import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import TopicListing from './pages/TopicListing';
import Directory from './pages/Directory';
import DirectoryDetail from './pages/DirectoryDetail';
import ReviewsDirectory from './pages/ReviewsDirectory';
import ReviewDetail from './pages/ReviewDetail';
import SingleContent from './pages/SingleContent';
import ComingSoon from './pages/ComingSoon';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:type" element={<TopicListing />} />
          <Route path="/ai-tools-directory" element={<Directory />} />
          <Route path="/reviews" element={<ReviewsDirectory />} />

          {/* Single content pages, one route per type's real URL prefix */}
          <Route path="/reviews/:slug" element={<ReviewDetail />} />
          <Route path="/alternatives/:slug" element={<SingleContent type="alternative" />} />
          <Route path="/statistics/:slug" element={<SingleContent type="statistic" />} />
          <Route path="/ai-tools-directory/:slug" element={<DirectoryDetail />} />
          <Route path="/:slug" element={<SingleContent type="comparison" />} />

          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
