import React from 'react';
import { CircleArrowRight } from 'lucide-react';
import { NAV_ITEMS } from '../../data/nav';
import { NavIcon } from '../ui/NavIcon';

// TOP冒頭のタイル型ナビ。左に大きく「病院・介護施設」、右に3つ（TOPにいるので、「TOPページ」のタイルは置かない）
const TILE_BG = {
  SEARCH: 'bg-cream-100',
  COLUMN: 'bg-cream-100',
  COMMUNITY: 'bg-cream-200',
  SHUKATSU: 'bg-cream-200',
};

const Tile = ({ item, big, wide, onNavigate }) => (
  <li className={big ? 'col-span-2 md:col-span-1 md:row-span-3' : wide ? 'col-span-2 md:col-span-1' : ''}>
    <button
      onClick={() => onNavigate(item.target)}
      className={`group w-full h-full flex flex-col items-center justify-center text-center gap-2 px-2 ${big ? 'py-6 md:py-10' : 'py-5 md:py-6'} ${TILE_BG[item.target]} hover:brightness-[0.97]`}
    >
      <NavIcon item={item} className={big ? 'h-16 md:h-24' : 'h-10 md:h-12'} />
      <span className={`flex items-center gap-1.5 font-round font-bold text-gold-deep tracking-[0.1em] ${big ? 'text-[1.1rem] md:text-[1.2rem] md:mt-8' : 'text-[0.9rem] md:text-[1.05rem]'}`}>
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
    <nav aria-label="メインメニュー" className="pt-1 md:pt-5">
      <ul className="grid grid-cols-2 gap-1 md:gap-[5px]">
        <Tile item={byTarget.SEARCH} big onNavigate={onNavigate} />
        <Tile item={byTarget.SHUKATSU} wide onNavigate={onNavigate} />
        <Tile item={byTarget.COMMUNITY} onNavigate={onNavigate} />
        <Tile item={byTarget.COLUMN} onNavigate={onNavigate} />
      </ul>
    </nav>
  );
};
