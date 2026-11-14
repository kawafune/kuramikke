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
import { ContactForm } from './components/ContactForm';
import { SitemapPage } from './pages/SitemapPage';
import { ColumnListPage, ColumnArticlePage } from './pages/ColumnPages';
import { BUSINESS_PAGES, LEGAL_PAGES } from './data/businessPages';
import { HOME } from './config/site';
import { DevRefresh } from './components/layout/DevRefresh';
import { LpPage } from './pages/LpPage';
import { CommunityTopPage, CommunityEventPage } from './pages/CommunityPages';
import { MapSearchPage } from './pages/MapSearchPage';
import { initAnalytics, initOutboundTracking, trackPageView } from './lib/analytics';

// ページを移動したら、先頭にスクロールする
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// アクセス解析（測定IDがあるときだけ。開発モードの閲覧は計測しない）。ページを移動するたびに、閲覧を記録する
const Analytics = () => {
  const { pathname, search } = useLocation();
  const { devMode } = useSite();
  useEffect(() => {
    if (devMode) return;
    initAnalytics();
    initOutboundTracking();
    // ページの題名が付いてから記録する
    const t = setTimeout(() => trackPageView(pathname + search), 300);
    return () => clearTimeout(t);
  }, [pathname, search, devMode]);
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
      <DevRefresh />
      <button onClick={logout} className="underline underline-offset-2">公開表示に戻す</button>
    </div>
  );
};

// 公開前のページ：開発モードの人だけが見られる。それ以外には「準備中」を出す
const DevOnly = ({ title, children }) => {
  const { devMode } = useSite();
  return devMode ? children : <ComingSoonPage title={title} />;
};

// お問い合わせ：フォームが使えるとき（環境変数 VITE_CONTACT_FORM=1、または開発モード）は、フォームを出す。そうでなければ、メール方式
const ContactRoute = ({ page }) => {
  const { devMode } = useSite();
  const formOn = devMode || import.meta.env.VITE_CONTACT_FORM === '1';
  // フォームで受け付けているときは、メール向けの案内文（lead・note）を、フォーム向けに差し替える
  const p = formOn ? { ...page, lead: page.leadForm ?? page.lead, note: page.noteForm ?? page.note } : page;
  return <InfoPage page={p} form={formOn ? <ContactForm /> : null} hideMail={formOn} />;
};

// 開発モードへの入口（どこにもリンクしない）。/dev を開くと、パスワードの入力が出る
const DevEntry = () => {
  const { openLogin } = useSite();
  useEffect(() => { openLogin(); }, [openLogin]);
  return <Navigate to="/" replace />;
};

// 公開してよい機能（config/site.js の READY）は、誰でも見られる。まだの機能は、開発モードの人だけ
const Gate = ({ target, title, children }) => {
  const { devMode, isAvailable } = useSite();
  return devMode || isAvailable(target) ? children : <ComingSoonPage title={title} />;
};

const Shell = () => {
  const { devMode, go, loginOpen, closeLogin, login } = useSite();
  const { pathname } = useLocation();
  // 広告用のLP（隠しページ）は、サイトのヘッダー・フッターを出さない
  if (pathname.startsWith('/lp/')) {
    return (
      <>
        <ScrollToTop />
        <Analytics />
        <Routes>
          <Route path="/lp/kuramikke" element={<LpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Analytics />
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
          <Route path="/search" element={<Gate target="SEARCH" title="病院・介護施設を探す"><SearchTopPage /></Gate>} />
          <Route path="/search/results" element={<Gate target="SEARCH" title="病院・介護施設を探す"><SearchResultsPage /></Gate>} />
          <Route path="/search/map" element={<Gate target="SEARCH" title="マップから探す"><MapSearchPage /></Gate>} />
          <Route path="/search/favorites" element={<Gate target="SEARCH" title="お気に入りの病院"><FavoritesPage /></Gate>} />
          <Route path="/search/nursing" element={<Gate target="SEARCH" title="老人ホームを探す"><NursingSearchPage /></Gate>} />
          <Route path="/nursing-homes/:id" element={<Gate target="SEARCH" title="老人ホームを探す"><NursingDetailPage /></Gate>} />
          <Route path="/hospitals/:id" element={<Gate target="SEARCH" title="病院・介護施設を探す"><HospitalDetailPage /></Gate>} />
          <Route path="/column" element={<ColumnListPage />} />
          <Route path="/column/:slug" element={<ColumnArticlePage />} />
          <Route path="/community" element={<CommunityTopPage />} />
          <Route path="/community/:slug" element={<CommunityEventPage />} />
          {[...BUSINESS_PAGES, ...LEGAL_PAGES].map((p) => <Route key={p.path} path={p.path} element={p.path === '/contact' ? <ContactRoute page={p} /> : <InfoPage page={p} />} />)}
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
