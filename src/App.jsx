import React, { useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LoginModal } from './components/ui/LoginModal';
import { SiteProvider } from './context/SiteProvider';
import { useSite } from './context/siteContext';
import { TopPage } from './pages/TopPage';
import { SearchTopPage } from './pages/SearchTopPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { HospitalDetailPage } from './pages/HospitalDetailPage';
import { NursingSearchPage } from './pages/NursingSearchPage';
import { NursingDetailPage } from './pages/NursingDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ShukatsuTopPage } from './pages/ShukatsuTopPage';
import { GuideArticlePage } from './pages/GuideArticlePage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { InfoPage } from './pages/InfoPage';
import { SitemapPage } from './pages/SitemapPage';
import { ColumnListPage, ColumnArticlePage } from './pages/ColumnPages';
import { BUSINESS_PAGES, LEGAL_PAGES } from './data/businessPages';
import { HOME } from './config/site';

// ページを移動したら、先頭にスクロールする
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// 開発モードのときだけ出す帯（いま見ているのは公開前の画面を含むことを忘れないため）
const DevBanner = () => {
  const { devMode, logout } = useSite();
  if (!devMode) return null;
  return (
    <div className="bg-ink text-white text-[0.75rem] px-4 py-1.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
      <span className="font-bold">開発モード：公開前の画面も表示しています</span>
      <Link to="/" className="underline underline-offset-2">TOP（開発用：ポータル型）</Link>
      <Link to="/shukatsu" className="underline underline-offset-2">公開中のTOP（終活ガイド）</Link>
      <button onClick={logout} className="underline underline-offset-2">公開表示に戻す</button>
    </div>
  );
};

// 公開前のページ：開発モードの人だけが見られる。それ以外には「準備中」を出す
const DevOnly = ({ title, children }) => {
  const { devMode } = useSite();
  return devMode ? children : <ComingSoonPage title={title} />;
};

// 開発モードへの入口（どこにもリンクしない）。/dev を開くと、パスワードの入力が出る
const DevEntry = () => {
  const { openLogin } = useSite();
  useEffect(() => { openLogin(); }, [openLogin]);
  return <Navigate to="/" replace />;
};

const Shell = () => {
  const { devMode, go, loginOpen, closeLogin, login } = useSite();
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <DevBanner />
      <Header />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={HOME === 'shukatsu' && !devMode ? <ShukatsuTopPage /> : <TopPage onTryAccess={go} />} />
          <Route path="/dev" element={<DevEntry />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/shukatsu" element={<ShukatsuTopPage />} />
          <Route path="/shukatsu/:slug" element={<GuideArticlePage />} />
          <Route path="/portal" element={<DevOnly title="ポータル型のTOP"><TopPage onTryAccess={go} /></DevOnly>} />
          <Route path="/search" element={<DevOnly title="病院・介護施設を探す"><SearchTopPage /></DevOnly>} />
          <Route path="/search/results" element={<DevOnly title="病院・介護施設を探す"><SearchResultsPage /></DevOnly>} />
          <Route path="/search/favorites" element={<DevOnly title="お気に入りの病院"><FavoritesPage /></DevOnly>} />
          <Route path="/search/nursing" element={<DevOnly title="老人ホームを探す"><NursingSearchPage /></DevOnly>} />
          <Route path="/nursing-homes/:id" element={<DevOnly title="老人ホームを探す"><NursingDetailPage /></DevOnly>} />
          <Route path="/hospitals/:id" element={<DevOnly title="病院・介護施設を探す"><HospitalDetailPage /></DevOnly>} />
          <Route path="/column" element={<ColumnListPage />} />
          <Route path="/column/:slug" element={<ColumnArticlePage />} />
          <Route path="/community" element={<DevOnly title="絆を見つける"><ComingSoonPage title="絆を見つける" /></DevOnly>} />
          {[...BUSINESS_PAGES, ...LEGAL_PAGES].map((p) => <Route key={p.path} path={p.path} element={<InfoPage page={p} />} />)}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <LoginModal isOpen={loginOpen} onClose={closeLogin} onLoginSuccess={login} />
    </div>
  );
};

const App = () => (
  <SiteProvider>
    <Shell />
  </SiteProvider>
);

export default App;
