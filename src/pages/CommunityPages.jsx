import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, MapPin, Wifi, Users } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHero } from '../components/ui/PageHero';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import { RichText } from '../components/ui/RichText';
import { EventCard } from '../components/ui/EventCard';
import { GuideBlocks } from '../components/shukatsu/GuideBlocks';
import { AdBanner } from '../components/ui/AdBanner';
import { ComingSoonPage } from './ComingSoonPage';
import { NotFoundPage } from './NotFoundPage';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSite } from '../context/siteContext';
import { EVENT_CATEGORIES, EVENT_CATEGORY_LABEL, EVENT_BY_SLUG, getEvents, isEventReadable } from '../data/events';

// クラミッケの立ち位置の注記（一覧・詳細の両方で表示）
const Notice = () => (
  <p className="text-[0.8rem] text-ink-sub bg-cream-50 border border-gold/40 rounded-xl p-4">
    ここでご紹介するセミナー・交流会は、提携する事業者・団体が開くものです。お申し込みや参加費のお支払いは、各主催者のページで行われます。クラミッケは、会場の提供や、当日の運営は行いません。
  </p>
);

// 「絆を見つける」の入口。いまは、まだ公開前（devMode のときだけ見える）
export const CommunityTopPage = () => {
  usePageTitle('絆を見つける');
  const { devMode, isAvailable } = useSite();
  if (!devMode && !isAvailable('COMMUNITY')) return <ComingSoonPage title="絆を見つける" />;

  const events = getEvents(devMode);
  return (
    <>
      <Breadcrumb items={[{ label: '絆を見つける' }]} />
      <PageHero title={<>絆を<br />見つける</>} />

      <section className="max-w-[760px] mx-auto px-4 py-10 md:py-14 text-center">
        <SectionTitle>同じ趣味や思いの仲間と、気軽につながる</SectionTitle>
        <p className="mb-6">終活やこれからの暮らしに役立つセミナーや、同じ気持ちの方と話せる交流会をご紹介します。気になるものがあれば、お気軽にのぞいてみてください。</p>
        <Notice />
      </section>

      <div className="max-w-content mx-auto px-4 pb-12 md:pb-16">
        {events.length === 0 ? (
          <p className="py-10 text-center text-ink-sub">ただいま、ご紹介できるイベントを準備しています。</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((ev) => <li key={ev.slug}><EventCard event={ev} /></li>)}
          </ul>
        )}
      </div>

      <div className="max-w-content mx-auto px-4 pb-12"><AdBanner placement="community" className="h-[60px] md:h-[75px]" /></div>
    </>
  );
};

// イベントの詳細ページ
export const CommunityEventPage = () => {
  const { slug } = useParams();
  const { devMode, isAvailable } = useSite();
  const ev = EVENT_BY_SLUG[slug];
  usePageTitle(ev?.title);
  if (!devMode && !isAvailable('COMMUNITY')) return <ComingSoonPage title="絆を見つける" />;
  if (!ev) return <NotFoundPage />;
  if (!isEventReadable(ev, devMode)) return <ComingSoonPage title="絆を見つける" />;

  return (
    <>
      <Breadcrumb items={[{ label: '絆を見つける', to: '/community' }, { label: ev.title }]} />
      <article className="max-w-[760px] mx-auto px-4 py-10 md:py-14">
        <p className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-block bg-cream-200 text-[0.75rem] px-2 py-0.5">{EVENT_CATEGORY_LABEL[ev.category]}</span>
          <span className="inline-flex items-center gap-1 text-[0.8rem] text-[#2A7A73] font-bold">
            {ev.format === 'online' ? <><Wifi size={14} aria-hidden="true" />オンライン開催</> : <><MapPin size={14} aria-hidden="true" />会場開催</>}
          </span>
        </p>
        <h1 className="text-[1.3rem] md:text-[1.6rem] leading-snug mb-6">{ev.title}</h1>

        <dl className="mb-8 border border-gold-line divide-y divide-gold-line text-[0.9rem]">
          <div className="flex gap-3 p-3"><dt className="shrink-0 w-24 flex items-center gap-1.5 text-ink-sub"><CalendarDays size={16} aria-hidden="true" />日時</dt><dd>{ev.dateLabel} {ev.time}</dd></div>
          <div className="flex gap-3 p-3"><dt className="shrink-0 w-24 flex items-center gap-1.5 text-ink-sub"><MapPin size={16} aria-hidden="true" />場所</dt><dd>{ev.place}</dd></div>
          <div className="flex gap-3 p-3"><dt className="shrink-0 w-24 flex items-center gap-1.5 text-ink-sub">参加費</dt><dd>{ev.price}</dd></div>
          {ev.capacity && <div className="flex gap-3 p-3"><dt className="shrink-0 w-24 flex items-center gap-1.5 text-ink-sub"><Users size={16} aria-hidden="true" />定員</dt><dd>{ev.capacity}</dd></div>}
          <div className="flex gap-3 p-3"><dt className="shrink-0 w-24 text-ink-sub">主催</dt><dd>{ev.organizer}</dd></div>
        </dl>

        <p className="mb-8"><RichText text={ev.excerpt} /></p>

        {ev.sections?.map((s) => (
          <section key={s.h} className="mb-8">
            <h2 className="text-[1.05rem] border-l-[6px] border-gold pl-3 mb-4 text-ink">{s.h}</h2>
            <GuideBlocks blocks={s.blocks} />
          </section>
        ))}

        <div className="mb-10"><Notice /></div>

        {ev.organizerUrl ? (
          <p className="text-center mb-10"><Button href={ev.organizerUrl} target="_blank" rel="noopener noreferrer" icon="external">主催者のページで申し込む</Button></p>
        ) : (
          <p className="text-center mb-10 text-[0.85rem] bg-cream-50 p-4">お申し込み先は、ただいま準備中です。</p>
        )}

        <div className="text-center"><Link to="/community" className="text-gold-deep underline underline-offset-4">絆を見つける の一覧へ</Link></div>
      </article>
    </>
  );
};
