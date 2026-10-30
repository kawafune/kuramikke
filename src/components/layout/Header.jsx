import React, { useState } from 'react';
import { Menu, X, Share2 } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { SnsIcons } from '../ui/SnsIcons';
import { SearchForm } from './SearchForm';
import { NAV_ITEMS } from '../../data/nav';
import { NavIcon } from '../ui/NavIcon';
import { useSite } from '../../context/siteContext';

// 準備中の項目は薄く表示して、押せないようにする
const PreparingBadge = () => <span className="whitespace-nowrap text-[0.65rem] leading-none bg-cream-200 text-ink px-1.5 py-0.5 rounded-sm">準備中</span>;

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { devMode, currentTarget, showTileNav, isAvailable, go, logout } = useSite();

  const to = (target) => {
    go(target);
    setIsMenuOpen(false);
  };

  // 開発モードのときだけ「公開表示に戻す」を出す。一般の訪問者には、ボタンを出さない（開発モードには /dev から入る）
  const authButton = devMode
    ? <button onClick={logout} className="shrink-0 whitespace-nowrap h-10 px-6 bg-white border border-gold-deep text-gold-deep font-round font-bold text-[0.85rem] rounded">公開表示に戻す</button>
    : null;

  return (
    <header className="bg-white sticky top-0 z-50 border-b-[3px] border-gold-line">
      {/* 上段 */}
      <div className="max-w-[1200px] mx-auto px-4 lg:px-10 h-16 lg:h-[100px] flex items-center justify-between gap-6">
        <button onClick={() => to('TOP')} className="shrink-0" aria-label="クラミッケ トップページへ">
          <Logo />
        </button>

        {/* PC：説明・SNS・検索・ログイン */}
        <div className="hidden lg:flex flex-col items-end gap-2 flex-1 max-w-[620px]">
          <div className="flex items-center gap-4">
            <p className="text-[0.75rem] text-ink">暮らしのお役立ち情報WEBマガジン</p>
            <button className="flex flex-col items-center text-ink-sub text-[0.55rem] leading-none" aria-label="このページをシェア">
              <Share2 size={18} />シェア
            </button>
            <SnsIcons />
          </div>
          <div className="flex items-center gap-3 w-full">
            <SearchForm id="search-pc" />
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

      {/* 下段：5メニュー（ポータル型TOPは大きなタイルナビがあるので出さない＝原案どおり） */}
      {!showTileNav && (
        <nav className="hidden lg:block" aria-label="メインメニュー">
          <ul className="max-w-[1160px] mx-auto flex items-center justify-center pb-2">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.target} className={`flex ${i > 0 ? 'border-l border-gold-line' : ''}`}>
                {isAvailable(item.target) ? (
                  <button
                    onClick={() => to(item.target)}
                    aria-current={currentTarget === item.target ? 'page' : undefined}
                    className="flex items-center gap-2 px-4 xl:px-5 py-1 whitespace-nowrap font-round font-bold text-[0.85rem] text-gold-deep hover:opacity-70 aria-[current=page]:underline underline-offset-4"
                  >
                    <NavIcon item={item} className="h-6" />
                    {item.label}
                  </button>
                ) : (
                  <span aria-disabled="true" className="flex items-center gap-2 px-4 xl:px-5 py-1 whitespace-nowrap font-round font-bold text-[0.85rem] text-gold-deep opacity-45 cursor-not-allowed">
                    <NavIcon item={item} className="h-6" />
                    {item.label}
                    <PreparingBadge />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* スマホ：開閉メニュー */}
      {isMenuOpen && (
        <div id="sp-menu" className="lg:hidden absolute inset-x-0 top-full bg-white border-t border-gold-line shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4 bg-cream-50">
            <SearchForm id="search-sp" />
          </div>
          <nav aria-label="メインメニュー">
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.target} className="border-b border-cream-200">
                  {isAvailable(item.target) ? (
                    <button onClick={() => to(item.target)} className="w-full flex items-center gap-4 px-5 min-h-[60px] text-left font-round font-bold text-gold-deep">
                      <span className="w-12 flex justify-center"><NavIcon item={item} className="h-7" /></span>
                      {item.label}
                    </button>
                  ) : (
                    <span aria-disabled="true" className="w-full flex items-center gap-4 px-5 min-h-[60px] font-round font-bold text-gold-deep opacity-45">
                      <span className="w-12 flex justify-center"><NavIcon item={item} className="h-7" /></span>
                      {item.label}
                      <PreparingBadge />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-5 flex flex-col items-center gap-5">
            {authButton && <div className="w-full [&>button]:w-full">{authButton}</div>}
            <SnsIcons />
          </div>
        </div>
      )}
    </header>
  );
};
