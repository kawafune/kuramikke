import React, { useState } from 'react';
import { Menu, LogIn } from 'lucide-react';
import logo from '../../assets/cralogo.svg'; // ★ここを修正 (cralogo.svg)

export const Header = ({ onNavigate, isAuthenticated, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 h-16 md:h-20 flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* ロゴ部分 */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('TOP')}
        >
          {/* ロゴのサイズ調整: 少し横長かもしれないので w-auto で比率保持 */}
          <img
            src={logo}
            alt="クラミッケ"
            className="h-10 md:h-12 w-auto group-hover:opacity-80 transition-opacity"
          />

          {/* SVGに文字が含まれている場合は h1 は隠しても良いですが、SEO的に残しておきます */}
          <h1 className="text-xl md:text-2xl font-bold text-green-800 tracking-tight hidden xs:block">
            クラミッケ
          </h1>
        </div>

        {/* ... (以下ナビゲーション部分は変更なし) ... */}
        <nav className="hidden md:flex gap-8 text-sm font-bold text-gray-600 items-center">
          <button
            onClick={() => onNavigate('TOP')}
            className="hover:text-green-600 transition-colors"
          >
            TOPページ
          </button>
          <button
            onClick={() => onNavigate('SEARCH')}
            className="hover:text-green-600 transition-colors"
          >
            病院・施設を探す
          </button>
          <button
            onClick={() => onNavigate('COMMUNITY')}
            className="hover:text-green-600 transition-colors"
          >
            コミュニティ
          </button>

          {isAuthenticated && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-orange-500 border border-orange-200 px-4 py-2 rounded-full hover:bg-orange-50"
            >
              <LogIn size={16} /> ログアウト
            </button>
          )}
        </nav>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-gray-600"
        >
          <Menu size={28} />
        </button>
      </div>
      {/* ... (スマホメニュー変更なし) ... */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl p-4 flex flex-col gap-4 md:hidden">
          <button
            onClick={() => {
              onNavigate('TOP');
              setIsMenuOpen(false);
            }}
            className="text-left py-2 font-bold text-gray-700"
          >
            TOPページ
          </button>
          <button
            onClick={() => {
              onNavigate('SEARCH');
              setIsMenuOpen(false);
            }}
            className="text-left py-2 font-bold text-gray-700"
          >
            病院・施設を探す
          </button>
          <button
            onClick={() => {
              onNavigate('COMMUNITY');
              setIsMenuOpen(false);
            }}
            className="text-left py-2 font-bold text-gray-700"
          >
            コミュニティ
          </button>
        </div>
      )}
    </header>
  );
};
