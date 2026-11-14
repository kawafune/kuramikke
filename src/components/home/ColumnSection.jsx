import React from 'react';
import { Link } from 'react-router-dom';
import { SectionTitle } from '../ui/SectionTitle';
import { Button } from '../ui/Button';
import { CategoryTag } from '../ui/Tags';
import { PhotoPlaceholder } from '../ui/PhotoPlaceholder';
import { useSite } from '../../context/siteContext';
import { getColumnItems, CATEGORY_LABEL } from '../../data/column';

// 絆を見つける のカード（EventCard）と同じ形：カード全体がリンク。hoverは、枠をゴールド＋面をクリームに
const ColumnCard = ({ col }) => (
  <Link to={col.to} className="group block h-full bg-white rounded-2xl border border-gold/50 p-3 transition-colors hover:border-gold hover:bg-cream-50">
    <PhotoPlaceholder image={col.image} art={col.art} alt={col.title} className="aspect-square rounded-xl" />
    <div className="mt-2"><CategoryTag>{CATEGORY_LABEL[col.category]}</CategoryTag></div>
    <h3 className="font-sans font-normal text-[0.9rem] leading-relaxed mt-2 mb-3 line-clamp-2 group-hover:text-gold-deep">{col.title}</h3>
    {col.date && <p className="bg-cream-100 rounded-full text-[0.75rem] px-3 py-1 inline-block">公開日時：{col.date.replaceAll('-', '.')}</p>}
  </Link>
);

// TOPの「コラム」。新しい順（data/column.js の並び順）の先頭から、最大8件。
// スマホは指で横に送る（1枚ずつ）。PCは、絆を見つける のカードと同じ、3〜4列のグリッド
export const ColumnSection = ({ onNavigate }) => {
  const { devMode } = useSite();
  const columns = getColumnItems(devMode).slice(0, 8);
  if (columns.length === 0) return null;
  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <SectionTitle>コラム</SectionTitle>
      <div className="max-w-content mx-auto px-4">
        <ul className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar px-4 md:px-0 scroll-px-4">
          {columns.map((col) => (
            <li key={col.key} className="snap-start shrink-0 basis-[72%] sm:basis-[42%] md:basis-auto">
              <ColumnCard col={col} />
            </li>
          ))}
        </ul>
      </div>
      <div className="text-center mt-10">
        <Button onClick={() => onNavigate('COLUMN')}>もっと読む</Button>
      </div>
    </section>
  );
};
