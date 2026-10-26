import React from 'react';
import { Link } from 'react-router-dom';

// 原案のパンくず：クリーム色の帯、左の「TOP」だけ濃いクリームの矢羽根形
export const Breadcrumb = ({ items = [] }) => (
  <nav aria-label="現在のページ" className="bg-cream-50">
    <ol className="max-w-[1200px] mx-auto flex items-stretch text-[0.75rem] min-h-[32px]">
      <li className="flex">
        <Link to="/" className="flex items-center bg-cream-200 text-gold-deep font-bold pl-6 pr-6 [clip-path:polygon(0_0,calc(100%-14px)_0,100%_50%,calc(100%-14px)_100%,0_100%)] hover:brightness-95">TOP</Link>
      </li>
      {items.map((item, i) => (
        <li key={item.label} className="flex items-center">
          {i > 0 && <span className="px-1 text-ink-sub" aria-hidden="true">&gt;</span>}
          {item.to
            ? <Link to={item.to} className="px-2 hover:text-gold-deep">{item.label}</Link>
            : <span className="px-2 text-ink-sub" aria-current="page">{item.label}</span>}
        </li>
      ))}
    </ol>
  </nav>
);
