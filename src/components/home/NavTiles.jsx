import React from 'react';
import { CircleArrowRight } from 'lucide-react';
import { NAV_ITEMS } from '../../data/nav';
import { NavIcon } from '../ui/NavIcon';

// TOP冒頭のタイル型ナビ。いまは「病院・介護施設」と「終活サポート」の2つ。
// 「コラム」「絆を見つける」のタイルは、デザインを決めるまで、いったん出さない（ヘッダーのメニューには残っている）。
// ファーストビューに、下の「病院・介護施設を探す」まで入るよう、タイルは低くしている
const TILE_BG = {
  SEARCH: 'bg-cream-100',
  COLUMN: 'bg-cream-100',
  COMMUNITY: 'bg-cream-200',
  SHUKATSU: 'bg-cream-200',
};

const Tile = ({ item, onNavigate }) => (
  <li>
    <button
      onClick={() => onNavigate(item.target)}
      className={`group w-full h-full flex flex-col items-center justify-center text-center gap-2 px-2 py-4 md:py-5 ${TILE_BG[item.target]} hover:brightness-[0.97]`}
    >
      <NavIcon item={item} className="h-10 md:h-14" />
      <span className={`flex items-center gap-1.5 font-round font-bold text-gold-deep tracking-[0.1em] text-[0.95rem] md:text-[1.1rem]`}>
        {item.label}
        <CircleArrowRight size={18} aria-hidden="true" className="shrink-0 transition-transform group-hover:translate-x-0.5" />
      </span>
      <span className="text-[0.75rem] md:text-[0.8rem] leading-snug">{item.desc}</span>
    </button>
  </li>
);

export const NavTiles = ({ onNavigate }) => {
  const byTarget = Object.fromEntries(NAV_ITEMS.map((n) => [n.target, n]));
  return (
    <nav aria-label="メインメニュー" className="pt-[5px]">
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-[5px]">
        <Tile item={byTarget.SEARCH} onNavigate={onNavigate} />
        <Tile item={byTarget.SHUKATSU} onNavigate={onNavigate} />
      </ul>
    </nav>
  );
};
