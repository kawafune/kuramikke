import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHero } from '../components/ui/PageHero';
import { SectionTitle } from '../components/ui/SectionTitle';
import { RichText } from '../components/ui/RichText';
import { AdBanner } from '../components/ui/AdBanner';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSite } from '../context/siteContext';
import { GUIDE_PAGES, PROMISES } from '../data/shukatsuGuide';

const StatusChip = ({ children, tone = 'soon' }) => (
  <span className={`absolute top-0 right-0 text-[0.7rem] leading-none px-2 py-1.5 ${tone === 'draft' ? 'bg-accent-red-text text-white' : 'bg-cream-200 text-ink'}`}>{children}</span>
);

const GuideCard = ({ page }) => {
  const { devMode } = useSite();
  const readable = page.status === 'ready' && (page.published || devMode);
  const body = (
    <>
      <span className="font-round text-gold-deep text-[0.8rem]">{String(page.no).padStart(2, '0')}</span>
      <strong className="block font-round text-[1.05rem] mb-1">{page.title}</strong>
      <span className="block text-[0.85rem] leading-relaxed">{page.short}</span>
    </>
  );
  if (readable) {
    return (
      <li className="relative">
        <Link to={`/shukatsu/${page.slug}`} className="block h-full border border-gold bg-white p-5 pt-6 hover:bg-cream-50">{body}</Link>
        {!page.published && <StatusChip tone="draft">下書き</StatusChip>}
      </li>
    );
  }
  return (
    <li className="relative">
      <div aria-disabled="true" className="h-full border border-line bg-white/70 p-5 pt-6 opacity-70">{body}</div>
      <StatusChip>準備中</StatusChip>
    </li>
  );
};

// 終活サポートの入口（ハブ）。設定（config/site.js）の HOME が 'shukatsu' のあいだは、サイトのTOPにもなる
export const ShukatsuTopPage = () => {
  usePageTitle('終活サポート');
  const { devMode, isAvailable } = useSite();
  return (
    <>
      <Breadcrumb items={[{ label: '終活サポート' }]} />
      <PageHero title={<>終活<br />サポート</>} />

      <section className="max-w-[820px] mx-auto px-4 py-12 md:py-16 text-center">
        <SectionTitle>はじめてでも、迷わないために</SectionTitle>
        <p className="mb-4">終活は、これからを自分らしく過ごすための準備です。</p>
        <p className="mb-4">クラミッケは、見送りそのものを行うのではなく、迷っているときに最初に読む「やさしい入口」として、<br className="hidden md:block" />信頼できる専門家や事業者を、やさしい言葉でご紹介します。</p>
        <p className="text-[0.85rem] text-ink-sub">どのページから読んでも大丈夫です。</p>
      </section>

      <section className="bg-cream-50 py-12 md:py-16 px-4">
        <div className="max-w-content mx-auto">
          <SectionTitle>知りたいことから選ぶ</SectionTitle>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...GUIDE_PAGES].sort((a, b) => a.no - b.no).map((p) => <GuideCard key={p.slug} page={p} />)}
          </ul>
          {devMode && (
            <p className="mt-6 text-[0.8rem] bg-white border border-dashed border-accent-red-text p-3">
              <RichText text="【要確認】開発モードの表示です。「下書き」のページは、代表が確認して公開を決めるまで、一般の訪問者には「準備中」と表示されます。" />
            </p>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-content mx-auto">
          <SectionTitle>クラミッケのお約束</SectionTitle>
          <ul className="grid gap-4 sm:grid-cols-2">
            {PROMISES.map((p) => (
              <li key={p.title} className="flex gap-3 border border-gold-line p-5">
                <ShieldCheck className="shrink-0 text-gold-deep mt-1" size={24} aria-hidden="true" />
                <span>
                  <strong className="block font-round mb-1">{p.title}</strong>
                  <span className="text-[0.9rem]"><RichText text={p.text} /></span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream-50 py-12 px-4 text-center">
        <SectionTitle>終活セミナー・イベント</SectionTitle>
        <p className="mb-6">同じ気持ちの人と話せる、セミナーやイベントをご紹介します。</p>
        {isAvailable('COMMUNITY')
          ? <Link to="/community" className="inline-block bg-gold-deep text-white font-round font-bold px-8 py-3 shadow-[0_3px_0_theme(colors.gold.shadow)]">イベントを探す</Link>
          : <p className="inline-block bg-cream-200 text-[0.85rem] px-4 py-2">準備中です</p>}
      </section>

      <div className="max-w-content mx-auto px-4 py-10"><AdBanner className="h-[60px] md:h-[75px]" /></div>
    </>
  );
};
