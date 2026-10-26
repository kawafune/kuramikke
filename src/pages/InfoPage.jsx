import React from 'react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHero } from '../components/ui/PageHero';
import { RichText } from '../components/ui/RichText';
import { GuideBlocks } from '../components/shukatsu/GuideBlocks';
import { ComingSoonPage } from './ComingSoonPage';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSite } from '../context/siteContext';

// 事業者向けなどの、1ページで完結する案内ページ（data/businessPages.js）
export const InfoPage = ({ page }) => {
  const { devMode } = useSite();
  usePageTitle(page.title);
  if (!page.published && !devMode) return <ComingSoonPage title={page.title} />;

  return (
    <>
      <Breadcrumb items={[{ label: page.crumb }]} />
      <PageHero title={page.title} />
      <article className="max-w-[760px] mx-auto px-4 py-10 md:py-14">
        {!page.published && (
          <p className="mb-6 text-[0.85rem] bg-[#FFE3DD] text-accent-red-text font-bold p-3">
            下書きです。公開前に、内容の確認と、【要確認】の解消が必要です。（開発モードでだけ表示されています）
          </p>
        )}
        <p className="mb-10 text-[1.05rem]"><RichText text={page.lead} /></p>
        {page.sections.map((s) => (
          <section key={s.h} className="mb-10">
            <h2 className="text-[1.15rem] md:text-[1.25rem] border-l-[6px] border-gold pl-3 mb-5 text-ink">{s.h}</h2>
            <GuideBlocks blocks={s.blocks} />
          </section>
        ))}
        <div className="mt-12 border border-gold p-1">
          <div className="border border-gold p-5 text-[0.85rem]"><RichText text={page.note} /></div>
        </div>
      </article>
    </>
  );
};
