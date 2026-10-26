import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHero } from '../components/ui/PageHero';
import { Button } from '../components/ui/Button';
import { RichText } from '../components/ui/RichText';
import { GuideBlocks } from '../components/shukatsu/GuideBlocks';
import { ListingSection } from '../components/shukatsu/ListingSection';
import { NotFoundPage } from './NotFoundPage';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSite } from '../context/siteContext';
import { GUIDE_BY_SLUG, GUIDE_PAGES, isReadable } from '../data/shukatsuGuide';

const Notice = ({ title }) => (
  <div className="max-w-content mx-auto px-4 py-16 md:py-24 text-center">
    <h1 className="text-[1.3rem] text-gold-deep mb-6">{title}</h1>
    <p className="mb-10">このページは、ただいま準備中です。</p>
    <Button to="/shukatsu">終活サポートへ戻る</Button>
  </div>
);

// 終活ガイドの記事ページ
export const GuideArticlePage = () => {
  const { slug } = useParams();
  const { devMode } = useSite();
  const page = GUIDE_BY_SLUG[slug];
  usePageTitle(page?.title);

  if (!page) return <NotFoundPage />;
  if (!isReadable(page, devMode)) return <Notice title={page.title} />;

  const ordered = [...GUIDE_PAGES].sort((a, b) => a.no - b.no);
  const readable = ordered.filter((p) => isReadable(p, devMode));
  const idx = readable.findIndex((p) => p.slug === page.slug);
  const prev = readable[idx - 1];
  const next = readable[idx + 1];

  return (
    <>
      <Breadcrumb items={[{ label: '終活サポート', to: '/shukatsu' }, { label: page.title }]} />
      <PageHero title={page.title} />

      <div className="max-w-content mx-auto px-4 py-10 md:py-14 lg:grid lg:grid-cols-[1fr_260px] lg:gap-12">
        <article className="min-w-0 max-w-[760px]">
          {(!page.published || page.expertReview === 'required') && (
            <p className="mb-6 text-[0.85rem] bg-[#FFE3DD] text-accent-red-text font-bold p-3">
              下書きです。公開前に、内容の確認と、【要確認】の解消が必要です。（開発モードでだけ表示されています）
              {page.expertReview === 'required' && <><br />専門家の確認が済むまでは、公開の設定をしても、一般の訪問者には表示されません。</>}
            </p>
          )}
          <p className="mb-10 text-[1.05rem]"><RichText text={page.lead} /></p>

          {page.sections.map((s) => (
            <section key={s.h} className="mb-10">
              <h2 className="text-[1.15rem] md:text-[1.25rem] border-l-[6px] border-gold pl-3 mb-5 text-ink">{s.h}</h2>
              <GuideBlocks blocks={s.blocks} />
            </section>
          ))}

          {page.listings && <ListingSection groups={page.listings} adNote={page.adNote} />}

          {/* 原案の二重枠 */}
          <div className="mt-12 border border-gold p-1">
            <div className="border border-gold p-5 text-[0.85rem]">
              <p className="font-round font-bold mb-1">ご注意</p>
              <p><RichText text={page.note} /></p>
              {devMode && <p className="mt-2 text-ink-sub"><RichText text={page.sources} /></p>}
            </div>
          </div>

          <nav aria-label="前後のページ" className="mt-10 flex justify-between gap-3 text-[0.9rem]">
            {prev ? <Link to={`/shukatsu/${prev.slug}`} className="text-gold-deep underline underline-offset-4">← {prev.title}</Link> : <span />}
            {next ? <Link to={`/shukatsu/${next.slug}`} className="text-gold-deep underline underline-offset-4 text-right">{next.title} →</Link> : <span />}
          </nav>
        </article>

        <aside className="mt-12 lg:mt-0" aria-label="終活ガイドの目次">
          <div className="lg:sticky lg:top-[170px] border border-gold-line bg-cream-50 p-5">
            <p className="font-round font-bold text-gold-deep mb-3 border-b border-dotted border-gold pb-2">終活ガイドの目次</p>
            <ol className="space-y-1.5 text-[0.85rem]">
              {ordered.map((p) => {
                const ok = isReadable(p, devMode);
                return (
                  <li key={p.slug}>
                    {ok
                      ? <Link to={`/shukatsu/${p.slug}`} aria-current={p.slug === page.slug ? 'page' : undefined} className="block py-1 hover:text-gold-deep aria-[current=page]:font-bold aria-[current=page]:text-gold-deep">{p.no}. {p.title}</Link>
                      : <span className="block py-1 text-ink-sub">{p.no}. {p.title}（準備中）</span>}
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      </div>
    </>
  );
};
