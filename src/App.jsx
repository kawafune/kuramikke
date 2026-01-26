import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LoginModal } from './components/ui/LoginModal';
import { TopPage } from './pages/TopPage';
import { SearchPage } from './pages/SearchPage';

const App = () => {
  // --- 状態管理 ---
  const [currentPage, setCurrentPage] = useState('TOP'); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingTarget, setPendingTarget] = useState(null);

  // --- 初期化 ---
  useEffect(() => {
    const auth = localStorage.getItem('kuramikke_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  // --- ページ遷移ロジック ---
  const handleNavigation = (targetPage) => {
    // TOPは誰でもアクセス可能
    if (targetPage === 'TOP') {
      setCurrentPage('TOP');
      window.scrollTo(0, 0);
      return;
    }

    // それ以外は認証が必要
    if (isAuthenticated) {
      setCurrentPage(targetPage);
      window.scrollTo(0, 0);
    } else {
      setPendingTarget(targetPage);
      setShowLoginModal(true);
    }
  };

  // --- ログイン処理 ---
  const handleLoginSuccess = () => {
    localStorage.setItem('kuramikke_auth', 'true');
    setIsAuthenticated(true);
    setShowLoginModal(false);
    if (pendingTarget) {
      setCurrentPage(pendingTarget);
      setPendingTarget(null);
    } else {
      setCurrentPage('SEARCH');
    }
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('kuramikke_auth');
    setIsAuthenticated(false);
    setCurrentPage('TOP');
    window.location.reload(); // 状態リセットのためリロード推奨
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans text-[#333] flex flex-col">
      <Header 
        onNavigate={handleNavigation} 
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {currentPage === 'TOP' && (
          <TopPage onTryAccess={(target) => handleNavigation(target)} />
        )}
        
        {(currentPage === 'SEARCH' || currentPage === 'COMMUNITY') && (
          <SearchPage />
        )}
      </main>

      <Footer />

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;