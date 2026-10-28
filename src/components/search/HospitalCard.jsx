import React from 'react';
import { Link } from 'react-router-dom';
import { CirclePlus, ExternalLink, MapPin } from 'lucide-react';
import { ScheduleTable } from './ScheduleTable';
import { FeatureIcons } from './FeatureIcons';
import { Button } from '../ui/Button';
import { FavoriteButton } from './FavoriteButton';
import { TodayStatus } from './TodayStatus';
import { KIND_LABEL } from '../../data/medical';
import { mapsUrl } from '../../lib/maps';

const MAX_DEPARTMENTS = 6;

// 検索結果の医療機関カード（原案08）。公的データには電話番号が無いため、公式サイトとGoogleマップへの導線を出す
export const HospitalCard = ({ h, selected = false, onSelect }) => (
  <li>
    <article
      className={`bg-white border p-5 md:p-6 ${selected ? 'border-accent-red-text border-2' : 'border-gold'}`}
      onClick={() => onSelect?.(h.id)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1"><span className="inline-block bg-cream-200 text-[0.7rem] px-2 py-0.5">{KIND_LABEL[h.kind]}</span></p>
          <h3 className="text-[1.15rem] md:text-[1.3rem] border-l-[6px] border-gold pl-3">
            <Link to={`/hospitals/${h.id}`} className="hover:text-gold-deep">{h.name}</Link>
          </h3>
          <p className="mt-2 flex items-start gap-2 text-[0.85rem]"><CirclePlus size={16} className="text-accent-red shrink-0 mt-0.5" aria-hidden="true" />
            <span>{h.departments.slice(0, MAX_DEPARTMENTS).join(' / ')}{h.departments.length > MAX_DEPARTMENTS && ` ほか${h.departments.length - MAX_DEPARTMENTS}科`}</span>
          </p>
          <p className="flex items-start gap-2 text-[0.85rem]"><MapPin size={16} className="text-accent-red shrink-0 mt-0.5" aria-hidden="true" />{h.address}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <FavoriteButton id={h.id} name={h.name} />
          <Button to={`/hospitals/${h.id}`} className="!px-5 sm:!px-8">詳しくはこちら</Button>
        </div>
      </div>

      <div className="mt-4 flex flex-col lg:flex-row gap-4 lg:gap-8 lg:items-start">
        <div className="overflow-x-auto"><ScheduleTable schedule={h.schedule} /></div>
        <FeatureIcons features={h.features} />
      </div>
      <TodayStatus schedule={h.schedule} compact className="mt-4" />
      <p className="mt-3 text-[0.8rem]">休診日：{h.holiday}</p>

      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.85rem]">
        {h.url && <a href={h.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gold-deep underline underline-offset-4 min-h-[36px]">公式サイト<ExternalLink size={14} aria-hidden="true" /></a>}
        <a href={mapsUrl(h)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gold-deep underline underline-offset-4 min-h-[36px]">Googleマップ（電話番号も見られます）<ExternalLink size={14} aria-hidden="true" /></a>
      </p>
    </article>
  </li>
);
