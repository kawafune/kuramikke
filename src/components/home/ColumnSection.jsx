import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionTitle } from '../ui/SectionTitle';
import { Button } from '../ui/Button';
import { CategoryTag } from '../ui/Tags';
import { PhotoPlaceholder } from '../ui/PhotoPlaceholder';
import { COLUMNS } from '../../data/dummy';

// 送り矢印（原案の金色の丸ボタン）
const Arrow = ({ dir, onClick }) => (
  <button
    onClick={onClick}
    aria-label={dir === 'prev' ? '前のコラム' : '次のコラム'}
    className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gold-deep text-white items-center justify-center hover:brightness-110"
    style={{ [dir === 'prev' ? 'left' : 'right']: 0 }}
  >
    {dir === 'prev' ? <ArrowLeft size={24} strokeWidth={2.5} /> : <ArrowRight size={24} strokeWidth={2.5} />}
  </button>
);

const ColumnCard = ({ col }) => (
  <article className="bg-white p-[10px] h-full flex flex-col">
    <PhotoPlaceholder className="aspect-square" />
    <div className="mt-2"><CategoryTag>{col.category}</CategoryTag></div>
    <h3 className="font-sans font-normal text-[0.9rem] leading-relaxed mt-2 mb-3 line-clamp-2">
      <a href="#" className="hover:text-gold-deep">{col.title}</a>
    </h3>
    <p className="mt-auto bg-cream-300 text-[0.75rem] px-2 py-1">公開日時：{col.date}</p>
  </article>
);

export const ColumnSection = ({ onNavigate }) => {
  const trackRef = useRef(null);
  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('li');
    el.scrollBy({ left: (card?.offsetWidth ?? 300) * (dir === 'next' ? 1 : -1), behavior: 'smooth' });
  };

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <SectionTitle>コラム</SectionTitle>
      <div className="relative max-w-content mx-auto md:px-16">
        <Arrow dir="prev" onClick={() => scroll('prev')} />
        {/* スマホは指で横に送る。PCは3枚表示＋矢印 */}
        <ul
          ref={trackRef}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 md:gap-12 px-[12%] md:px-0 scroll-px-[12%] md:scroll-px-0"
        >
          {COLUMNS.map((col) => (
            <li key={col.id} className="snap-start shrink-0 basis-[76%] sm:basis-[45%] md:basis-[calc((100%-6rem)/3)]">
              <ColumnCard col={col} />
            </li>
          ))}
        </ul>
        <Arrow dir="next" onClick={() => scroll('next')} />
      </div>
      <div className="text-center mt-10">
        <Button onClick={() => onNavigate('COLUMN')}>もっと読む</Button>
      </div>
    </section>
  );
};
