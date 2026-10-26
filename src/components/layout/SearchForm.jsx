import React from 'react';

// サイト内検索（検索処理は未実装）
export const SearchForm = ({ id }) => (
  <form role="search" onSubmit={(e) => e.preventDefault()} className="flex items-stretch gap-2 w-full">
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
