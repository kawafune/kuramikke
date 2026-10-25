import React, { useState } from 'react';
import { Menu, X, Search, Share2 } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { SnsIcons } from '../ui/SnsIcons';
import { NAV_ITEMS, NavIcon } from '../../data/nav';

const SearchForm = ({ id, onSubmit }) => (
  <form role="search" onSubmit={onSubmit} className="flex items-stretch gap-2 w-full">
    <label htmlFor={id} className="sr-only">サイト内検索</label>
    <input
      id={id}
      type="search"
      placeholder="キーワードで検索できます"
      className="flex-1 min-w-0 h-10 px-3 border border-[#B5B5B5] rounded text-[0.85rem] placeholder:text-ink-sub focus:outline-none focus:border-gold-deep"
    />
    <button type="submit" className="shrink-0 h-10 px-3 bg-cream-200 text-gold-deep font-round font-bold text-[0.8rem] rounded shadow-[0_2px_0_theme(colors.gold.line)] hover:brightness-95">
      サイト内検索
    </button>
  </form>
);

export const Header = ({ currentPage, onNavigate, isAuthenticated, onLogout, onLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const go = (target) => {
    onNavigate(target);
    setIsMenuOpen(false);
  };
  const handleSearch = (e) => {
    e.preventDefault(); // 【未実装】検索処理
  };

  const authButton = isAuthenticated
    ? <button onClick={onLogout} className="shrink-0 whitespace-nowrap h-10 px-6 bg-white border border-gold-deep text-gold-deep font-round font-bold text-[0.85rem] rounded">ログアウト</button>
    : <button onClick={onLogin} className="shrink-0 whitespace-nowrap h-10 px-6 bg-gold-deep text-white font-round font-bold text-[0.85rem] tracking-[0.15em] rounded shadow-[0_3px_0_theme(colors.gold.shadow)]">ログイン</button>;

  return (
    <header className="bg-white sticky top-0 z-50 border-b-[3px] border-gold-line">
      {/* 上段 */}
      <div className="max-w-[1200px] mx-auto px-4 lg:px-10 h-16 lg:h-[100px] flex items-center justify-between gap-6">
        <button onClick={() => go('TOP')} className="shrink-0" aria-label="クラミッケ トップページへ">
          <Logo />
        </button>

        {/* PC：説明・SNS・検索・ログイン */}
        <div className="hidden lg:flex flex-col items-end gap-2 flex-1 max-w-[620px]">
          <div className="flex items-center gap-4">
            <p className="text-[0.75rem] text-ink">【病院・介護施設検索】暮らしのお役立ち情報WEBマガジン</p>
            <button className="flex flex-col items-center text-ink-sub text-[0.55rem] leading-none" aria-label="このページをシェア">
              <Share2 size={18} />シェア
            </button>
            <SnsIcons />
          </div>
          <div className="flex items-center gap-3 w-full">
            <SearchForm id="search-pc" onSubmit={handleSearch} />
            {authButton}
          </div>
        </div>

        {/* スマホ：メニューボタン（シニア向けに文字ラベル付き） */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden flex flex-col items-center justify-center w-12 h-12 text-gold-deep"
          aria-expanded={isMenuOpen}
          aria-controls="sp-menu"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          <span className="text-[0.6rem] font-bold leading-none mt-0.5">{isMenuOpen ? '閉じる' : 'メニュー'}</span>
        </button>
      </div>

      {/* 下段：5メニュー（TOPは大きなタイルナビがあるので出さない＝原案どおり） */}
      {currentPage !== 'TOP' && (
        <nav className="hidden lg:block" aria-label="メインメニュー">
          <ul className="max-w-[1000px] mx-auto flex items-center justify-center pb-2">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.target} className={`flex ${i > 0 ? 'border-l border-gold-line' : ''}`}>
                <button
                  onClick={() => go(item.target)}
                  aria-current={currentPage === item.target ? 'page' : undefined}
                  className="flex items-center gap-2 px-5 py-1 font-round font-bold text-[0.85rem] text-gold-deep hover:opacity-70 aria-[current=page]:underline underline-offset-4"
                >
                  <NavIcon item={item} className="h-6" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* スマホ：開閉メニュー */}
      {isMenuOpen && (
        <div id="sp-menu" className="lg:hidden absolute inset-x-0 top-full bg-white border-t border-gold-line shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4 bg-cream-50">
            <SearchForm id="search-sp" onSubmit={handleSearch} />
          </div>
          <nav aria-label="メインメニュー">
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.target} className="border-b border-cream-200">
                  <button onClick={() => go(item.target)} className="w-full flex items-center gap-4 px-5 min-h-[60px] text-left font-round font-bold text-gold-deep">
                    <span className="w-12 flex justify-center"><NavIcon item={item} className="h-7" /></span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-5 flex flex-col items-center gap-5">
            <div className="w-full [&>button]:w-full">{authButton}</div>
            <SnsIcons />
          </div>
        </div>
      )}
    </header>
  );
};
