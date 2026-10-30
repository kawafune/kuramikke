import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLink, CalendarPlus } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { AdBanner } from '../components/ui/AdBanner';
import { Button } from '../components/ui/Button';
import { ScheduleTable } from '../components/search/ScheduleTable';
import { FeatureIcons } from '../components/search/FeatureIcons';
import { FacilityMap } from '../components/search/FacilityMap';
import { EmergencyNotice } from '../components/search/EmergencyNotice';
import { FavoriteButton } from '../components/search/FavoriteButton';
import { TodayStatus } from '../components/search/TodayStatus';
import { CalendarAdd } from '../components/search/CalendarAdd';
import { NotFoundPage } from './NotFoundPage';
import { usePageTitle } from '../hooks/usePageTitle';
import { usePrefData } from '../hooks/useMedical';
import { prefCodeOfId, KIND_LABEL, DATA_SOURCE_NAME, asOfLabel } from '../data/medical';
import { mapsUrl } from '../lib/maps';

const Row = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row gap-1 sm:gap-8 py-4 border-b border-line last:border-b-0">
    <dt className="sm:w-[9rem] shrink-0 font-round font-bold text-[0.9rem]">{label}</dt>
    <dd className="flex-1 min-w-0 text-[0.95rem]">{children}</dd>
  </div>
);

// 病院の詳細（原案09）。公的データでわかる範囲を表示する。
// 写真・お知らせ・医師紹介・求人などは、施設からの掲載申込みで追加する部分（いまは出さない）。
export const HospitalDetailPage = () => {
  const { id } = useParams();
  const { items, loading, error } = usePrefData(prefCodeOfId(id));
  const h = items?.find((x) => x.id === id);
  usePageTitle(h?.name);
  if (loading) return <p className="max-w-content mx-auto px-4 py-20 text-center" role="status">読み込んでいます…</p>;
  if (error) return <p className="max-w-content mx-auto px-4 py-20 text-center">データを読み込めませんでした。通信を確認して、もう一度お試しください。</p>;
  if (!h) return <NotFoundPage />;

  return (
    <>
      <Breadcrumb items={[{ label: '病院・介護施設を探す', to: '/search' }, { label: '病院を探す', to: '/search' }, { label: '検索結果', to: `/search/results?pref=${encodeURIComponent(h.pref)}` }, { label: h.name }]} />
      <div className="max-w-[900px] mx-auto px-4 py-10 md:py-14">
        <EmergencyNotice compact />
        <article className="relative border border-gold bg-white p-5 md:p-10 mt-6">
          <span className="absolute -top-px -left-px bg-gold-deep text-white text-[0.75rem] font-bold px-4 py-1">公的データをもとに掲載</span>

          <h1 className="mt-6 text-[1.4rem] md:text-[1.7rem] border-l-[6px] border-gold pl-3">{h.name}</h1>
          <p className="mt-3 text-[0.9rem]">{KIND_LABEL[h.kind]}／{h.address}</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            {h.url && <Button href={h.url} target="_blank" rel="noopener noreferrer" variant="cta" icon="external" className="sm:min-w-[14rem]">公式サイトを見る</Button>}
            <Button href={mapsUrl(h)} target="_blank" rel="noopener noreferrer" variant="external" icon="external">Googleマップで見る</Button>
            <FavoriteButton id={h.id} name={h.name} />
          </div>
          <p className="mt-2 text-[0.8rem] text-ink-sub">電話番号は、公式サイトか、Googleマップのページでご確認ください。</p>
          <TodayStatus schedule={h.schedule} className="mt-5" />
          <a href="#calendar-title" className="mt-3 inline-flex items-center gap-2 min-h-[44px] text-[0.9rem] font-bold text-gold-deep underline underline-offset-4">
            <CalendarPlus size={18} aria-hidden="true" />予約した日時を、カレンダーに入れる
          </a>
          <FeatureIcons features={h.features} className="mt-5" />

          <dl className="mt-8 border-t border-line">
            <Row label="診療科目">
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {h.departments.map((d) => (
                  <li key={d}><Link to={`/search/results?pref=${encodeURIComponent(h.pref)}&dept=${encodeURIComponent(d)}`} className="text-gold-deep underline underline-offset-4">{d}</Link></li>
                ))}
              </ul>
            </Row>
            <Row label="診療時間">
              <div className="overflow-x-auto"><ScheduleTable schedule={h.schedule} /></div>
              <p className="mt-3 bg-cream-50 p-3 text-[0.85rem]"><strong className="text-accent-red-text">休診日について</strong><br />{h.holiday}</p>
              <p className="mt-2 text-[0.75rem] text-ink-sub">診療時間は変わることがあります。受診の前に、医療機関へご確認ください。</p>
            </Row>
            {h.kind === 'hospital' && h.beds ? <Row label="病床数">{h.beds}床</Row> : null}
            <Row label="所在地">
              {h.address}<br />
              <a href={mapsUrl(h)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1 text-gold-deep underline underline-offset-4">Googleマップで見る<ExternalLink size={14} aria-hidden="true" /></a>
            </Row>
          </dl>

          {h.lat !== null && (
            <>
              <h2 className="mt-10 mb-3 text-[1.1rem] bg-gold-deep text-white px-4 py-2">地図</h2>
              <FacilityMap items={[h]} selectedId={h.id} className="h-[280px] md:h-[340px]" />
            </>
          )}

          <p className="mt-6 text-[0.75rem] text-ink-sub">出典：{DATA_SOURCE_NAME}（{asOfLabel(h.updated)}時点）。情報は変わることがあります。受診の前に、医療機関へご確認ください。</p>
        </article>

        <CalendarAdd hospital={h} />

        <aside className="mt-8 border border-dashed border-gold p-5 bg-cream-50 text-[0.9rem]">
          <p className="font-round font-bold mb-1">この医療機関の方へ</p>
          <p>写真、お知らせ、医師の紹介などを追加して、掲載することもできます。掲載のご案内は、準備中です。</p>
        </aside>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button to="/search/results" icon={null}>検索結果にもどる</Button>
          <Button to="/search" icon={null} variant="external">病院を探しなおす</Button>
        </div>
        <AdBanner placement="search" className="h-[60px] md:h-[75px] mt-8" />
      </div>
    </>
  );
};
