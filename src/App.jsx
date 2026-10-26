import React, { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LoginModal } from './components/ui/LoginModal';
import { SiteProvider } from './context/SiteProvider';
import { useSite } from './context/siteContext';
import { TopPage } from './pages/TopPage';
import { SearchPage } from './pages/SearchPage';
import { ShukatsuTopPage } from './pages/ShukatsuTopPage';
import { GuideArticlePage } from './pages/GuideArticlePage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { NotFoundPage } from './pages/NotFoundPage';
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
      <Link to="/portal" className="underline underline-offset-2">ポータル型のTOP</Link>
      <Link to="/shukatsu" className="underline underline-offset-2">終活ガイドのTOP</Link>
      <button onClick={logout} className="underline underline-offset-2">公開表示に戻す</button>
    </div>
  );
};

// 公開前のページ：開発モードの人だけが見られる。それ以外には「準備中」を出す
const DevOnly = ({ title, children }) => {
  const { devMode } = useSite();
  return devMode ? children : <ComingSoonPage title={title} />;
};

const Shell = () => {
  const { go, loginOpen, closeLogin, login } = useSite();
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <DevBanner />
      <Header />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={HOME === 'shukatsu' ? <ShukatsuTopPage /> : <TopPage onTryAccess={go} />} />
          <Route path="/shukatsu" element={<ShukatsuTopPage />} />
          <Route path="/shukatsu/:slug" element={<GuideArticlePage />} />
          <Route path="/portal" element={<DevOnly title="ポータル型のTOP"><TopPage onTryAccess={go} /></DevOnly>} />
          <Route path="/search" element={<DevOnly title="病院・介護施設を探す"><SearchPage /></DevOnly>} />
          <Route path="/column" element={<DevOnly title="コラムを読む"><ComingSoonPage title="コラムを読む" /></DevOnly>} />
          <Route path="/community" element={<DevOnly title="出逢いを探す"><ComingSoonPage title="出逢いを探す" /></DevOnly>} />
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
