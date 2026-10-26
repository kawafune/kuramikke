import React from 'react';
import hospitalIco from '../../assets/search_ico.svg';

// 「病院を探す／老人ホームを探す」の大きな切替（原案07）。選択中はゴールドの面＋下向きの三角
const Tab = ({ on, label, disabled }) => (
      <div
        role="tab"
        aria-selected={on}
        aria-disabled={disabled || undefined}
        className={`relative flex items-center justify-center gap-3 min-h-[64px] md:min-h-[76px] px-3 border border-gold font-round font-bold text-[1.05rem] md:text-[1.35rem] tracking-[0.15em] ${on ? 'bg-gold-deep text-white' : 'bg-cream-50 text-gold-deep opacity-80'}`}
      >
        <img src={hospitalIco} alt="" aria-hidden="true" className="h-7 md:h-9 w-auto" />
        {label}
        {disabled && <span className="text-[0.65rem] bg-cream-200 text-ink px-1.5 py-0.5 tracking-normal">準備中</span>}
        {on && <span className="absolute left-1/2 -bottom-[14px] -translate-x-1/2 w-0 h-0 border-x-[16px] border-x-transparent border-t-[14px] border-t-gold-deep" aria-hidden="true" />}
      </div>
);

export const SearchTypeTabs = ({ active = 'hospital' }) => (
  <div role="tablist" aria-label="探す対象" className="grid grid-cols-2 gap-2 md:gap-3 mb-8">
    <Tab on={active === 'hospital'} label="病院を探す" />
    <Tab on={active === 'nursing'} label="老人ホームを探す" disabled />
  </div>
);
