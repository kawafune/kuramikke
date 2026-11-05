import React from 'react';
import { ArrowRight } from 'lucide-react';
import { NAV_ITEMS } from '../../data/nav';
import { NavIcon } from '../ui/NavIcon';

// TOP冒頭のタイル型ナビ。いまは「病院・介護施設」と「終活サポート」の2つ。
// 「コラム」「絆を見つける」のタイルは、デザインを決めるまで、いったん出さない（ヘッダーのメニューには残っている）。
// ファーストビューに、下の「病院・介護施設を探す」まで入るよう、タイルは低くしている
// 2026-11 モダン化：角丸のカード＋アイコンの円＋右端の矢印。影は使わず、枠線と面の色でまとめる（トンマナ維持）
const Tile = ({ item, onNavigate }) => (
  <li>
    <button
      onClick={() => onNavigate(item.target)}
      className="group w-full h-full flex items-center gap-3 md:gap-5 text-left rounded-2xl border border-gold/40 bg-white px-4 py-3 md:px-6 md:py-5 transition-colors hover:border-gold hover:bg-cream-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-deep"
    >
      <span className="shrink-0 grid place-items-center w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden bg-cream-100 group-hover:bg-cream-200 transition-colors">
        <NavIcon item={item} className="h-8 md:h-11 max-w-[80%] object-contain" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-round font-bold text-gold-deep tracking-[0.04em] md:tracking-[0.08em] text-[0.98rem] md:text-[1.2rem] leading-snug">{item.label}</span>
        <span className="block mt-0.5 text-[0.78rem] md:text-[0.85rem] leading-snug text-ink-sub">{item.desc}</span>
      </span>
      <span className="shrink-0 grid place-items-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-gold-deep text-white transition-transform group-hover:translate-x-1">
        <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
      </span>
    </button>
  </li>
);

export const NavTiles = ({ onNavigate }) => {
  const byTarget = Object.fromEntries(NAV_ITEMS.map((n) => [n.target, n]));
  return (
    <nav aria-label="メインメニュー" className="bg-cream-50 px-4 py-4 md:py-6">
      <ul className="max-w-content mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5">
        <Tile item={byTarget.SEARCH} onNavigate={onNavigate} />
        <Tile item={byTarget.SHUKATSU} onNavigate={onNavigate} />
      </ul>
    </nav>
  );
};
