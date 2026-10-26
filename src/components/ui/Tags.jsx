import React from 'react';

// 出逢いの特徴タグ（spec 3-2）。淡い色は原案の面＋濃い文字、濃い色は少し深めて白文字
const FEATURE_TAGS = {
  'おすすめ': 'bg-gold-deep text-white',
  '人気企画': 'bg-[#FF9286] text-[#333]',
  '参加無料': 'bg-accent-red-text text-white',
  'セミナー': 'bg-[#A39FFF] text-[#333]',
  '体験型': 'bg-[#99CDF5] text-[#333]',
  'バスハイク': 'bg-[#4A5CE6] text-white',
  'お土産付': 'bg-[#70BDB5] text-[#333]',
  'ドリンク付': 'bg-[#FFA100] text-[#333]',
  '食事付': 'bg-[#0068D1] text-white',
};

export const FeatureTag = ({ name, className = '' }) => (
  <span className={`flex items-center justify-center min-h-[30px] px-2 text-[0.75rem] font-bold tracking-[0.1em] ${FEATURE_TAGS[name] ?? 'bg-cream-200 text-ink'} ${className}`}>
    {name}
  </span>
);

// コラムのカテゴリ（終活 / Life / 食 など）
export const CategoryTag = ({ children }) => (
  <span className="inline-block bg-gold-deep text-white text-[0.75rem] leading-none px-2 py-[6px] tracking-[0.1em]">
    {children}
  </span>
);
