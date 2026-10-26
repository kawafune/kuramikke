import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, User } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHero } from '../components/ui/PageHero';
import { SectionTitle } from '../components/ui/SectionTitle';
import { RichText } from '../components/ui/RichText';
import { AdBanner } from '../components/ui/AdBanner';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSite } from '../context/siteContext';
import { GUIDE_BY_SLUG, ENTRANCES, PROMISES, isReadable } from '../data/shukatsuGuide';

// 入口の色分け：ご家族のために＝赤 / ご自身のために＝青緑（白い文字で、読みやすさの基準 4.5:1 を満たす色）
const TONE = {
  family: { Icon: Users, bg: 'bg-accent-red-text', text: 'text-accent-red-text', border: 'border-accent-red-text', soft: 'bg-[#FFF1EE]' },
  self: { Icon: User, bg: 'bg-[#2A7A73]', text: 'text-[#2A7A73]', border: 'border-[#2A7A73]', soft: 'bg-[#EAF5F3]' },
};

const StatusChip = ({ children, tone = 'soon' }) => (
  <span className={`absolute top-0 right-0 text-[0.7rem] leading-none px-2 py-1.5 ${tone === 'draft' ? 'bg-accent-red-text text-white' : 'bg-cream-200 text-ink'}`}>{children}</span>
);

const GuideCard = ({ page, tone }) => {
  const { devMode } = useSite();
  const readable = isReadable(page, devMode);
  const body = (
    <>
      <strong className="block font-round text-[1.05rem] mb-1">{page.title}</strong>
      <span className="block text-[0.85rem] leading-relaxed">{page.short}</span>
    </>
  );
  if (readable) {
    const draft = !page.published || page.expertReview === 'required';
    return (
      <li className="relative">
        <Link to={`/shukatsu/${page.slug}`} className={`block h-full border border-gold-line border-l-[6px] ${tone.border} bg-white p-5 pt-7 hover:bg-cream-50`}>{body}</Link>
        {draft && <StatusChip tone="draft">{page.expertReview === 'required' ? '専門家の確認待ち' : '下書き'}</StatusChip>}
      </li>
    );
  }
  return (
    <li className="relative">
      <div aria-disabled="true" className="h-full border border-line border-l-[6px] bg-white/70 p-5 pt-7 opacity-70">{body}</div>
      <StatusChip>準備中</StatusChip>
    </li>
  );
};

// 2つの入口。PCは2列で、どちらも開いた状態。スマホはタブで切り替える（初めは「ご家族のために」を開く）
const EntrancePicker = () => {
  const [active, setActive] = useState('family');
  return (
    <div className="max-w-content mx-auto">
      <div role="tablist" aria-label="入口を選ぶ" className="grid grid-cols-2 gap-2 mb-4 lg:hidden">
        {ENTRANCES.map((e) => {
          const t = TONE[e.id];
          const on = active === e.id;
          return (
            <button
              key={e.id}
              role="tab"
              id={`tab-${e.id}`}
              aria-selected={on}
              aria-controls={`panel-${e.id}`}
              onClick={() => setActive(e.id)}
              className={`min-h-[76px] px-2 py-3 flex flex-col items-center justify-center gap-1 border-2 ${t.border} font-round font-bold ${on ? `${t.bg} text-white` : `bg-white ${t.text}`}`}
            >
              <t.Icon size={22} aria-hidden="true" />
              <span className="text-[0.95rem] leading-tight">{e.title}</span>
              <span className={`text-[0.7rem] leading-tight ${on ? 'text-white' : 'text-ink'}`}>{e.sub}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {ENTRANCES.map((e) => {
          const t = TONE[e.id];
          return (
            <div
              key={e.id}
              role="tabpanel"
              id={`panel-${e.id}`}
              aria-labelledby={`tab-${e.id}`}
              className={`${active === e.id ? 'block' : 'hidden'} lg:block`}
            >
              {/* PC：見出しの札 */}
              <div className={`hidden lg:block border-t-8 ${t.border} ${t.soft} p-5 mb-4 text-center`}>
                <t.Icon className={`mx-auto mb-1 ${t.text}`} size={32} aria-hidden="true" />
                <h2 className={`text-[1.3rem] ${t.text}`}>{e.title}</h2>
                <p className={`font-round font-bold text-[0.9rem] mb-2 ${t.text}`}>{e.sub}</p>
                <p className="text-[0.85rem]">{e.text}</p>
              </div>
              {/* スマホ：タブの下の説明 */}
              <p className={`lg:hidden text-[0.9rem] mb-4 p-4 ${t.soft}`}>{e.text}</p>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {e.slugs.map((slug) => <GuideCard key={slug} page={GUIDE_BY_SLUG[slug]} tone={t} />)}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 終活サポートの入口（ハブ）。設定（config/site.js）の HOME が 'shukatsu' のあいだは、サイトのTOPにもなる。
// 入口は2つ：「ご家族のために（いま必要になった）」「ご自身のために（これから備えたい）」。
export const ShukatsuTopPage = () => {
  usePageTitle('終活サポート');
  const { devMode, isAvailable } = useSite();
  return (
    <>
      <Breadcrumb items={[{ label: '終活サポート' }]} />
      <PageHero title={<>終活<br />サポート</>} />

      <section className="max-w-[820px] mx-auto px-4 py-12 md:py-16 text-center">
        <SectionTitle>はじめてでも、迷わないために</SectionTitle>
        <p className="mb-4">終活は、これからを自分らしく過ごすための準備です。むずかしく考えなくて大丈夫。</p>
        <p className="mb-4">クラミッケは、お見送りそのものを行うのではなく、迷ったときに、最初に読んでいただく「やさしい入口」でありたいと考えています。<br className="hidden md:block" />信頼できる専門家や事業者の方を、やさしい言葉でご紹介します。</p>
        <p className="text-[0.85rem] text-ink-sub">どのページから読んでも大丈夫ですよ。</p>
      </section>

      {/* 2つの入口 */}
      <section className="bg-cream-50 py-12 md:py-16 px-4" aria-label="入口を選ぶ">
        <EntrancePicker />
        {devMode && (
          <p className="max-w-content mx-auto mt-6 text-[0.8rem] bg-white border border-dashed border-accent-red-text p-3">
            <RichText text="【要確認】開発モードの表示です。「下書き」のページは、代表が確認して公開を決めるまで、一般の訪問者には「準備中」と表示されます。" />
          </p>
        )}
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
          <p className="mt-6 text-center text-[0.85rem]">
            <Link to="/business/standards" className="text-gold-deep underline underline-offset-4">掲載事業者の審査基準を見る</Link>
          </p>
        </div>
      </section>

      <section className="bg-cream-50 py-12 px-4 text-center">
        <SectionTitle>終活セミナー・イベント</SectionTitle>
        <p className="mb-6">同じ気持ちの方とお話しできる、セミナーやイベントをご紹介します。</p>
        {isAvailable('COMMUNITY')
          ? <Link to="/community" className="inline-block bg-gold-deep text-white font-round font-bold px-8 py-3 shadow-[0_3px_0_theme(colors.gold.shadow)]">イベントを探す</Link>
          : <p className="inline-block bg-cream-200 text-[0.85rem] px-4 py-2">準備中です</p>}
      </section>

      {/* 事業者向けの入口（控えめに） */}
      <section className="py-10 px-4 text-center">
        <p className="text-[0.9rem] mb-2">終活にかかわる、専門家・事業者のみなさまへ</p>
        <Link to="/business" className="font-round font-bold text-gold-deep underline underline-offset-4">掲載のご案内を見る</Link>
      </section>

      <div className="max-w-content mx-auto px-4 pb-10"><AdBanner className="h-[60px] md:h-[75px]" /></div>
    </>
  );
};
