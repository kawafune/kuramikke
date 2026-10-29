import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Building2, Users, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { KAIGO_TYPE_LABEL } from '../../data/kaigo';
import { mapsUrl } from '../../lib/maps';
import { formatKm } from '../../lib/distance';

const Label = ({ children }) => (
  <span className="inline-block bg-gold-deep text-white font-round font-bold text-[0.75rem] px-3 py-1 mr-3 shrink-0 min-w-[5.5rem] text-center">{children}</span>
);

// 検索結果の介護施設のカード（病院のカードと同じ並び）。公的データに入っている項目だけを出す
export const NursingHomeCard = ({ n, distanceKm }) => (
  <li>
    <article className="bg-white border border-gold p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 flex flex-wrap items-center gap-2">
            <span className="inline-block bg-cream-200 text-[0.7rem] px-2 py-0.5">{KAIGO_TYPE_LABEL[n.service]}</span>
            {distanceKm !== undefined && <span className="inline-block bg-[#2A7A73] text-white text-[0.75rem] font-bold px-2 py-0.5">現在地から{formatKm(distanceKm)}</span>}
          </p>
          <h3 className="text-[1.15rem] md:text-[1.3rem] border-l-[6px] border-gold pl-3">
            <Link to={`/nursing-homes/${n.id}`} className="hover:text-gold-deep">{n.name}</Link>
          </h3>
          <p className="mt-2 flex items-start gap-2 text-[0.85rem]"><MapPin size={16} className="text-accent-red shrink-0 mt-0.5" aria-hidden="true" />{n.address}</p>
          {n.corp && <p className="flex items-start gap-2 text-[0.85rem]"><Building2 size={16} className="text-accent-red shrink-0 mt-0.5" aria-hidden="true" />運営：{n.corp}</p>}
          {n.capacity && <p className="flex items-start gap-2 text-[0.85rem]"><Users size={16} className="text-accent-red shrink-0 mt-0.5" aria-hidden="true" />定員：{n.capacity}名</p>}
        </div>
        <Button to={`/nursing-homes/${n.id}`} className="w-full sm:w-auto !px-5 sm:!px-8">詳しくはこちら</Button>
      </div>

      {n.tel && (
        <p className="mt-4 flex items-center"><Label><Phone size={13} className="inline mr-1 -mt-0.5" aria-hidden="true" />電話番号</Label>
          <a href={`tel:${n.tel.replace(/-/g, '')}`} className="text-[1.3rem] font-bold tracking-wider">{n.tel}</a>
        </p>
      )}
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.85rem]">
        {n.url && <a href={n.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gold-deep underline underline-offset-4 min-h-[36px]">公式サイト<ExternalLink size={14} aria-hidden="true" /></a>}
        <a href={mapsUrl(n)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gold-deep underline underline-offset-4 min-h-[36px]">Googleマップ<ExternalLink size={14} aria-hidden="true" /></a>
      </p>
      <p className="mt-1 text-[0.75rem] text-ink-sub">費用や空き状況は、公的データにありません。見学のときに、施設へご確認ください。</p>
    </article>
  </li>
);
