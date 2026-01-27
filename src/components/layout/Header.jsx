import React, { useState } from 'react';
import { Menu, X, User, LogIn, Search } from 'lucide-react';
import logoImg from '../../assets/cralogo.svg';
import mikeImg from '../../assets/mike.svg';

export const Header = ({ onNavigate, isAuthenticated, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // PC用ナビリンク
  const NavLink = ({ target, children }) => (
    <button
      onClick={() => onNavigate(target)}
      className="font-bold text-primary-light hover:text-[#4F8E5D] transition-colors text-sm whitespace-nowrap"
    >
      {children}
    </button>
  );

  // スマホ用ナビリンク
  const MobileNavLink = ({ target, children }) => (
    <button
      onClick={() => {
        onNavigate(target);
        setIsMenuOpen(false);
      }}
      className="block w-full text-left py-3 px-4 hover:bg-[#f9ecd3] text-primary font-bold border-b border-gray-100"
    >
      {children}
    </button>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        
        {/* 左：ロゴエリア */}
        <div 
          className="flex items-center gap-2 cursor-pointer shrink-0" 
          onClick={() => onNavigate('TOP')}
        >
          {/* ★修正: hiddenクラスを削除し、サイズを調整して常時表示 */}
          <img src={mikeImg} alt="クラミケちゃん" className="h-8 md:h-10 w-auto -mb-1" />
          <img src={logoImg} alt="クラミッケ" className="h-10 md:h-12 w-auto hover:opacity-80 transition-opacity" />
        </div>

        {/* 中央：検索窓（PCのみ） */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <input 
            type="text" 
            placeholder="キーワードで検索（例：内科、リハビリ）" 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4F8E5D] text-sm"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* 右：メニュー & ボタン */}
        <div className="hidden lg:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <NavLink target="SEARCH">病院を探す</NavLink>
            <NavLink target="SEARCH">施設を探す</NavLink>
            <NavLink target="COMMUNITY">コミュニティ</NavLink>
          </nav>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            {isAuthenticated ? (
               <button onClick={onLogout} className="flex items-center gap-1 text-primary-light hover:text-[#F4A460] font-bold text-sm">
                 <LogIn size={18} /> ログアウト
               </button>
            ) : (
              <>
                <button className="flex items-center gap-1 text-primary hover:text-[#4F8E5D] font-bold text-sm">
                  <User size={18} /> ログイン
                </button>
                {/* ★修正: 色を直接指定して確実に表示させる */}
                <button className="bg-[#F4A460] text-white px-5 py-2 rounded-full font-bold text-sm hover:opacity-90 shadow-md whitespace-nowrap transition-opacity">
                  新規会員登録
                </button>
              </>
            )}
          </div>
        </div>

        {/* スマホメニューボタン */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-primary-light">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* スマホ用メニュー展開部 */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0 top-20 max-h-[90vh] overflow-y-auto">
           {/* スマホ用検索窓 */}
           <div className="p-4 bg-gray-50 border-b border-gray-100">
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="キーワード検索" 
                 className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8E5D]"
               />
               <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
             </div>
           </div>

           <nav className="flex flex-col">
             <MobileNavLink target="TOP">トップページ</MobileNavLink>
             <MobileNavLink target="SEARCH">病院を探す</MobileNavLink>
             <MobileNavLink target="SEARCH">施設を探す</MobileNavLink>
             <MobileNavLink target="COMMUNITY">コミュニティ</MobileNavLink>
             <MobileNavLink target="COLUMN">お役立ちコラム</MobileNavLink>
             
             <div className="p-4 flex flex-col gap-3 bg-[#f9ecd3]/30 mt-2">
                <button className="w-full bg-white border border-[#F4A460] text-[#F4A460] font-bold py-3 rounded-lg hover:bg-orange-50">
                  ログイン
                </button>
                {/* ★修正: こちらも色を直接指定 */}
                <button className="w-full bg-[#F4A460] text-white font-bold py-3 rounded-lg hover:opacity-90 shadow-sm transition-opacity">
                  新規会員登録
                </button>
             </div>
           </nav>
        </div>
      )}
    </header>
  );
};