import React from 'react';
import { Link } from 'react-router-dom';
import { CircleArrowRight } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SectionTitle } from '../components/ui/SectionTitle';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSite } from '../context/siteContext';
import { GUIDE_PAGES, isReadable } from '../data/shukatsuGuide';
import { BUSINESS_PAGES, LEGAL_PAGES } from '../data/businessPages';

const Item = ({ to, children, ready, child }) => {
  const cls = `inline-flex items-center gap-2 min-h-[36px] ${child ? 'text-[0.9rem] pl-6' : 'font-round font-bold text-[1rem]'}`;
  return ready ? (
    <Link to={to} className={`${cls} text-gold-deep hover:underline underline-offset-4`}>
      {!child && <CircleArrowRight size={18} aria-hidden="true" />}{children}
    </Link>
  ) : (
    <span aria-disabled="true" className={`${cls} text-gold-deep opacity-45`}>
      {!child && <CircleArrowRight size={18} aria-hidden="true" />}{children}（準備中）
    </span>
  );
};

// サイトマップ。一般の訪問者には、公開しているページだけを出す。開発モードでは、準備中のページも「準備中」として出す。
export const SitemapPage = () => {
  usePageTitle('サイトマップ');
  const { devMode, isAvailable } = useSite();
  const pageReady = (p) => p.published;

  // groups：{ title, to, ready, children: [{ label, to, ready }] }
  const pages = [...BUSINESS_PAGES, ...LEGAL_PAGES];
  const byPath = Object.fromEntries(pages.map((p) => [p.path, p]));
  const groups = [
    { title: '病院・介護施設を探す', to: '/search', ready: isAvailable('SEARCH'), children: [
      { label: '病院・診療所を探す', to: '/search', ready: isAvailable('SEARCH') },
      { label: '老人ホーム・介護施設を探す', to: '/search/nursing', ready: isAvailable('SEARCH') },
      { label: 'お気に入り', to: '/search/favorites', ready: isAvailable('SEARCH') },
    ] },
    { title: '終活サポート', to: '/shukatsu', ready: isAvailable('SHUKATSU'), children: GUIDE_PAGES.filter((g) => g.status === 'ready').map((g) => ({ label: g.title, to: `/shukatsu/${g.slug}`, ready: isReadable(g, false) })) },
    { title: 'コラムを読む', to: '/column', ready: isAvailable('COLUMN'), children: [] },
    { title: '絆を見つける', to: '/community', ready: isAvailable('COMMUNITY'), children: [] },
    { title: '掲載のご案内（病院・施設・事業者の方へ）', to: '/business', ready: pageReady(byPath['/business']), children: [{ label: '掲載事業者の審査基準', to: '/business/standards', ready: pageReady(byPath['/business/standards']) }] },
    ...['/privacy', '/terms', '/disclaimer', '/company', '/contact'].map((path) => ({ title: byPath[path].title, to: path, ready: pageReady(byPath[path]), children: [] })),
  ];

  const shown = groups
    .map((g) => ({ ...g, children: devMode ? g.children : g.children.filter((c) => c.ready) }))
    .filter((g) => devMode || g.ready);

  return (
    <>
      <Breadcrumb items={[{ label: 'サイトマップ' }]} />
      <div className="max-w-content mx-auto px-4 py-10 md:py-14">
        <SectionTitle as="h1">サイトマップ</SectionTitle>
        <div className="border border-gold p-6 md:p-10">
          <p className="mb-6"><Item to="/" ready>TOPページ</Item></p>
          <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((g) => (
              <li key={g.to}>
                <Item to={g.to} ready={g.ready}>{g.title}</Item>
                {g.children.length > 0 && (
                  <ul>{g.children.map((c) => <li key={c.to}><Item to={c.to} ready={c.ready} child>{c.label}</Item></li>)}</ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
