import React from 'react';
import { Link } from 'react-router-dom';
import hospitalIco from '../../assets/search_ico.svg';

// 「病院を探す／老人ホームを探す」の大きな切替（原案07）。選択中はゴールドの面＋下向きの三角
const Tab = ({ on, label, disabled, to }) => {
  const Tag = to && !disabled ? Link : 'div';
  return (
      <Tag
        {...(Tag === Link ? { to } : {})}
        role="tab"
        aria-selected={on}
        aria-disabled={disabled || undefined}
        className={`relative flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 min-h-[84px] md:min-h-[76px] px-2 md:px-3 py-2 border border-gold font-round font-bold text-[0.95rem] md:text-[1.35rem] tracking-[0.05em] md:tracking-[0.15em] text-center leading-tight ${on ? 'bg-gold-deep text-white' : 'bg-cream-50 text-gold-deep opacity-80'}`}
      >
        <img src={hospitalIco} alt="" aria-hidden="true" className="h-7 md:h-9 w-auto" />
        <span className="whitespace-nowrap">{label}</span>
        {disabled && <span className="text-[0.65rem] bg-cream-200 text-ink px-1.5 py-0.5 tracking-normal">準備中</span>}
        {on && <span className="absolute left-1/2 -bottom-[14px] -translate-x-1/2 w-0 h-0 border-x-[16px] border-x-transparent border-t-[14px] border-t-gold-deep" aria-hidden="true" />}
      </Tag>
  );
};

export const SearchTypeTabs = ({ active = 'hospital' }) => (
  <div role="tablist" aria-label="探す対象" className="grid grid-cols-2 gap-2 md:gap-3 mb-8">
    <Tab on={active === 'hospital'} label="病院を探す" to="/search" />
    <Tab on={active === 'nursing'} label="老人ホームを探す" to="/search/nursing" />
  </div>
);
