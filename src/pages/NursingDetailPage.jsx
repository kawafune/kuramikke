import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLink, Phone } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { AdBanner } from '../components/ui/AdBanner';
import { Button } from '../components/ui/Button';
import { FacilityMap } from '../components/search/FacilityMap';
import { NursingFeatureIcons } from '../components/search/NursingHomeCard';
import { NotFoundPage } from './NotFoundPage';
import { usePageTitle } from '../hooks/usePageTitle';
import { NURSING_BY_ID, NURSING_DATA_SOURCE, yen, monthlyRange } from '../data/nursingHomes';

const Row = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row gap-1 sm:gap-8 py-4 border-b border-line last:border-b-0">
    <dt className="sm:w-[9rem] shrink-0 font-round font-bold text-[0.9rem]">{label}</dt>
    <dd className="flex-1 min-w-0 text-[0.95rem]">{children}</dd>
  </div>
);

// 老人ホームの詳細。公的データでわかる範囲＋費用など。写真・見学の案内などは、施設からの掲載申込みで追加する部分
export const NursingDetailPage = () => {
  const { id } = useParams();
  const n = NURSING_BY_ID[id];
  usePageTitle(n?.name);
  if (!n) return <NotFoundPage />;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n.address)}`;

  return (
    <>
      <Breadcrumb items={[{ label: '病院・介護施設を探す', to: '/search' }, { label: '老人ホームを探す', to: '/search/nursing' }, { label: n.name }]} />
      <div className="max-w-[900px] mx-auto px-4 py-10 md:py-14">
        <article className="relative border border-gold bg-white p-5 md:p-10">
          <span className="absolute -top-px -left-px bg-gold-deep text-white text-[0.75rem] font-bold px-4 py-1">公的データをもとに掲載</span>
          <h1 className="mt-6 text-[1.4rem] md:text-[1.7rem] border-l-[6px] border-gold pl-3">{n.name}</h1>
          <p className="mt-3 text-[0.9rem]">{n.type}／{n.address}</p>
          <p className="mt-3 flex items-center gap-2">
            <Phone size={22} className="text-gold-deep" aria-hidden="true" />
            <a href={`tel:${n.tel.replace(/-/g, '')}`} className="text-[1.6rem] font-bold tracking-wider">{n.tel}</a>
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Button href={`tel:${n.tel.replace(/-/g, '')}`} variant="cta" icon={null} className="sm:min-w-[14rem]"><Phone size={18} aria-hidden="true" />お電話する</Button>
          </div>
          <p className="mt-3 bg-cream-50 p-3 text-[0.85rem]">見学や体験入居は、お電話でお申し込みください。クラミッケでは、見学の予約は受け付けていません。</p>
          <NursingFeatureIcons features={n.features} className="mt-5" />

          <dl className="mt-8 border-t border-line">
            <Row label="入居時の費用">{yen(n.entryFee)}</Row>
            <Row label="月額の費用">{monthlyRange(n.monthlyFee)}<p className="mt-1 text-[0.75rem] text-ink-sub">目安です。部屋のタイプや、介護の必要度によって変わります。管理費・食費などの内訳は、施設へご確認ください。</p></Row>
            <Row label="受け入れ">{n.accepts.join('・')}の方</Row>
            <Row label="定員・開設">{n.capacity}名（{n.opened}年開設）</Row>
            <Row label="最寄り駅"><ul>{n.stations.map((s) => <li key={s}>・{s}</li>)}</ul></Row>
            <Row label="所在地">
              {n.address}<br />
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1 text-gold-deep underline underline-offset-4">Googleマップで見る<ExternalLink size={14} aria-hidden="true" /></a>
            </Row>
          </dl>

          <h2 className="mt-10 mb-3 text-[1.1rem] bg-gold-deep text-white px-4 py-2">地図</h2>
          <FacilityMap items={[n]} selectedId={n.id} className="h-[280px] md:h-[340px]" />
          <p className="mt-6 text-[0.75rem] text-ink-sub">出典：{NURSING_DATA_SOURCE.label}。情報更新日：{n.updated}。契約の前に、重要事項説明書で、費用や条件をご確認ください。</p>
        </article>

        <aside className="mt-8 border border-dashed border-gold p-5 bg-cream-50 text-[0.9rem]">
          <p className="font-round font-bold mb-1">この施設の方へ</p>
          <p>写真、見学の案内、スタッフの紹介などを追加して、掲載することもできます。<Link to="/business" className="text-gold-deep underline underline-offset-4">掲載のご案内</Link>は、準備中です。</p>
        </aside>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button to="/search/nursing" icon={null}>検索結果にもどる</Button>
          <Button to="/search" icon={null} variant="external">病院を探す</Button>
        </div>
        <AdBanner className="h-[60px] md:h-[75px] mt-8" />
      </div>
    </>
  );
};
