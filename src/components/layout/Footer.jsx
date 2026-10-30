import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleArrowRight, ChevronUp } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { SnsIcons } from '../ui/SnsIcons';
import { NAV_ITEMS, PREFECTURES } from '../../data/nav';
import { useSite } from '../../context/siteContext';

// to があるものはサイト内のページ。ほかは、ページができるまで仮のリンク
const SUB_LINKS = [
  { label: 'ホーム', to: '/' },
  { label: '掲載のお申込み', to: '/business' },
  { label: 'ご利用規約', to: '/terms' },
  { label: 'プライバシーポリシー', to: '/privacy' },
  { label: '免責事項', to: '/disclaimer' },
  { label: 'サイトマップ' },
  { label: '運営会社' },
  { label: 'お問い合わせ' },
];

const PageTopButton = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed right-4 bottom-4 md:right-8 md:bottom-8 z-40 w-14 h-14 rounded-full bg-gold-deep text-white flex flex-col items-center justify-center font-round font-bold text-[0.55rem] leading-tight shadow-md transition-opacity ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-label="ページの先頭へ戻る"
    >
      <ChevronUp size={20} strokeWidth={2.5} aria-hidden="true" />
      ページ<br />トップ
    </button>
  );
};

export const Footer = () => {
  const { devMode, isAvailable, go } = useSite();
  return (
  <footer className="border-t border-gold-line mt-auto">
    <div className="max-w-content mx-auto px-4 lg:px-8 pt-10 md:pt-12">
      {/* 4導線 */}
      <ul className="flex flex-wrap gap-x-6 gap-y-3">
        {NAV_ITEMS.filter((n) => n.target !== 'TOP').map((item) => (
          <li key={item.target}>
            {isAvailable(item.target) ? (
              <button onClick={() => go(item.target)} className="flex items-center gap-1.5 font-round font-bold text-[0.85rem] text-gold-deep hover:opacity-70">
                <CircleArrowRight size={18} aria-hidden="true" />
                {item.label}
              </button>
            ) : (
              <span aria-disabled="true" className="flex items-center gap-1.5 font-round font-bold text-[0.85rem] text-gold-deep opacity-45">
                <CircleArrowRight size={18} aria-hidden="true" />
                {item.label}（準備中）
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* エリアから探す（検索が公開されるまでは開発モードだけ） */}
      {devMode && (
        <>
      <h2 className="mt-8 mb-3 text-[0.85rem] text-gold-deep">エリアから病院・介護施設を探す</h2>
      <ul className="flex flex-wrap text-[0.8rem] leading-loose">
        {PREFECTURES.map((pref) => (
          <li key={pref} className="border-l border-ink px-2.5 md:px-3 my-0.5 leading-none">
            <Link to={`/search/results?pref=${encodeURIComponent(pref)}`} className="inline-block py-2 md:py-1 hover:text-gold-deep">{pref}</Link>
          </li>
        ))}
      </ul>
        </>
      )}

      {/* ロゴ・SNS */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-24 my-10">
        <Logo size="lg" />
        <SnsIcons size="lg" />
      </div>

      <ul className="flex flex-wrap justify-center gap-y-2 text-[0.8rem] pb-6">
        {SUB_LINKS.map(({ label, to }, i) => (
          <li key={label} className={`px-3 leading-none ${i > 0 ? 'border-l border-ink' : ''}`}>
            {to
              ? <Link to={to} className="hover:text-gold-deep">{label}</Link>
              : <a href="#" className="hover:text-gold-deep">{label}</a> /* 【未実装】ページができるまでの仮リンク */}
          </li>
        ))}
      </ul>
    </div>
    <p className="bg-gold-deep text-white text-center text-[0.75rem] py-3 tracking-[0.1em]">
      ©Happiino All Rights Reserved.
    </p>
    <PageTopButton />
  </footer>
  );
};
