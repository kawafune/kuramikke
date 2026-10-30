import React from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHero } from '../components/ui/PageHero';
import { Button } from '../components/ui/Button';
import { RichText } from '../components/ui/RichText';
import { CategoryTag } from '../components/ui/Tags';
import { PhotoPlaceholder } from '../components/ui/PhotoPlaceholder';
import { GuideBlocks } from '../components/shukatsu/GuideBlocks';
import { AdBanner } from '../components/ui/AdBanner';
import { ComingSoonPage } from './ComingSoonPage';
import { NotFoundPage } from './NotFoundPage';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSite } from '../context/siteContext';
import { COLUMN_CATEGORIES, CATEGORY_LABEL, COLUMN_BY_SLUG, getColumnItems, isArticleReadable } from '../data/column';

const PAGE_SIZE = 10;

const dateLabel = (d) => d.replaceAll('-', '.');

// 右の欄（カテゴリ・最新記事）。スマホでは、一覧の下に出る
const Sidebar = ({ items, active }) => (
  <aside className="space-y-10">
    <section aria-labelledby="col-cat">
      <h2 id="col-cat" className="text-[0.95rem] text-gold-deep border-b border-dotted border-gold pb-1 mb-3">カテゴリ</h2>
      <ul className="grid grid-cols-3 gap-2">
        {COLUMN_CATEGORIES.map((c) => (
          <li key={c.key}>
            <Link to={active === c.key ? '/column' : `/column?cat=${c.key}`} aria-current={active === c.key ? 'true' : undefined}
              className={`flex items-center justify-center text-center min-h-[64px] px-1 border border-gold font-round font-bold text-[0.8rem] leading-snug ${active === c.key ? 'bg-gold-deep text-white' : 'bg-white text-gold-deep hover:bg-cream-50'}`}>
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
    <section aria-labelledby="col-new">
      <h2 id="col-new" className="text-[0.95rem] text-gold-deep border-b border-dotted border-gold pb-1 mb-3">最新記事</h2>
      <ul className="space-y-3">
        {items.slice(-5).reverse().map((it) => (
          <li key={it.key}>
            <Link to={it.to} className="flex gap-3 hover:text-gold-deep">
              <PhotoPlaceholder art={it.art} alt="" className="w-16 h-16 shrink-0" />
              <span className="text-[0.8rem] leading-snug">{it.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  </aside>
);

// 準備ができるまで、公開表示では「準備中」を出す
const useColumnOpen = () => {
  const { devMode, isAvailable } = useSite();
  return { devMode, open: devMode || isAvailable('COLUMN') };
};

// コラムの一覧（原案 02_column）。?cat=shukatsu|care|life で、カテゴリを絞る
export const ColumnListPage = () => {
  usePageTitle('コラム');
  const { devMode, open } = useColumnOpen();
  const [sp] = useSearchParams();
  if (!open) return <ComingSoonPage title="コラムを読む" />;

  const cat = sp.get('cat') ?? '';
  const all = getColumnItems(devMode);
  const items = all.filter((it) => !cat || it.category === cat);
  const page = Math.max(1, Number(sp.get('page')) || 1);
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const shown = items.slice((Math.min(page, pages) - 1) * PAGE_SIZE, Math.min(page, pages) * PAGE_SIZE);
  const pageLink = (n) => `?${new URLSearchParams({ ...(cat && { cat }), page: String(n) }).toString()}`;

  return (
    <>
      <Breadcrumb items={[{ label: 'コラム' }]} />
      <PageHero title={cat ? `コラム｜${CATEGORY_LABEL[cat]}` : 'コラム'} />
      <div className="max-w-content mx-auto px-4 py-10 md:py-14 grid gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          {shown.length === 0 ? (
            <p className="py-10 text-center">このカテゴリの記事は、ただいま準備中です。</p>
          ) : (
            <ul>
              {shown.map((it, i) => (
                <li key={it.key} className={`flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 ${i % 2 === 1 ? 'bg-cream-50' : ''}`}>
                  <Link to={it.to} className="sm:w-[220px] shrink-0" aria-hidden="true" tabIndex={-1}><PhotoPlaceholder art={it.art} alt="" className="aspect-[4/3]" /></Link>
                  <div className="min-w-0">
                    {it.date && <p className="inline-block bg-cream-300 text-[0.75rem] px-2 py-0.5 mb-2">公開日時：{dateLabel(it.date)}</p>}
                    <p className="mb-2"><CategoryTag>{CATEGORY_LABEL[it.category]}</CategoryTag></p>
                    <h2 className="text-[1.05rem] md:text-[1.15rem] leading-snug mb-2"><Link to={it.to} className="hover:text-gold-deep">{it.title}</Link></h2>
                    <p className="text-[0.85rem] mb-2">{it.excerpt}</p>
                    <Link to={it.to} className="text-[0.85rem] text-gold-deep underline underline-offset-4">この記事を読む</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {pages > 1 && (
            <nav aria-label="ページ送り" className="mt-8 flex flex-wrap justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link key={n} to={pageLink(n)} aria-current={n === page ? 'page' : undefined} className={`w-10 h-10 flex items-center justify-center ${n === page ? 'bg-gold-deep text-white' : 'bg-cream-100 hover:bg-cream-200'}`}>{n}</Link>
              ))}
            </nav>
          )}
        </div>
        <Sidebar items={all} active={cat} />
      </div>
      <div className="max-w-content mx-auto px-4 pb-12"><AdBanner placement="guide" className="h-[60px] md:h-[75px]" /></div>
    </>
  );
};

// コラムの記事ページ
export const ColumnArticlePage = () => {
  const { slug } = useParams();
  const { devMode, open } = useColumnOpen();
  const a = COLUMN_BY_SLUG[slug];
  usePageTitle(a?.title);
  if (!open) return <ComingSoonPage title="コラムを読む" />;
  if (!a) return <NotFoundPage />;
  if (!isArticleReadable(a, devMode)) return <ComingSoonPage title={a.title} />;

  const related = getColumnItems(devMode).filter((it) => it.category === a.category && it.to !== `/column/${a.slug}`).slice(0, 4);
  return (
    <>
      <Breadcrumb items={[{ label: 'コラム', to: '/column' }, { label: a.title }]} />
      <article className="max-w-[760px] mx-auto px-4 py-10 md:py-14">
        {!isArticleReadable(a, false) && (
          <p className="mb-6 text-[0.85rem] bg-[#FFE3DD] text-accent-red-text font-bold p-3">下書きです。公開前に、内容の確認と、【要確認】の解消が必要です。（開発モードでだけ表示されています）</p>
        )}
        <p className="mb-3 flex flex-wrap items-center gap-3"><CategoryTag>{CATEGORY_LABEL[a.category]}</CategoryTag><span className="text-[0.8rem] text-ink-sub">公開日時：{dateLabel(a.date)}</span></p>
        <h1 className="text-[1.4rem] md:text-[1.7rem] leading-snug mb-6">{a.title}</h1>
        <p className="mb-10"><RichText text={a.lead} /></p>
        {a.sections.map((s) => (
          <section key={s.h} className="mb-10">
            <h2 className="text-[1.15rem] md:text-[1.25rem] border-l-[6px] border-gold pl-3 mb-5 text-ink">{s.h}</h2>
            <GuideBlocks blocks={s.blocks} />
          </section>
        ))}
        <p className="text-[0.75rem] text-ink-sub mb-10">この記事は、一般的な案内です。個別のご事情については、専門家や、医療機関・施設へご相談ください。<Link to="/disclaimer" className="underline underline-offset-4">免責事項</Link></p>
        {related.length > 0 && (
          <section aria-labelledby="related" className="border-t border-line pt-8">
            <h2 id="related" className="text-center text-gold-deep text-[1.05rem] mb-5">関連記事</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {related.map((it) => (
                <li key={it.key}><Link to={it.to} className="flex gap-3 hover:text-gold-deep"><PhotoPlaceholder art={it.art} alt="" className="w-20 h-20 shrink-0" /><span className="text-[0.85rem] leading-snug">{it.title}</span></Link></li>
              ))}
            </ul>
          </section>
        )}
        <div className="mt-10 text-center"><Button to="/column" icon={null}>コラムの一覧へ</Button></div>
      </article>
    </>
  );
};
