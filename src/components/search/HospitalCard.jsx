import React from 'react';
import { Link } from 'react-router-dom';
import { CirclePlus, MapPin, Phone, TrainFront } from 'lucide-react';
import { ScheduleTable } from './ScheduleTable';
import { FeatureIcons } from './FeatureIcons';
import { Button } from '../ui/Button';
import { FavoriteButton } from './FavoriteButton';

const Label = ({ children }) => (
  <span className="inline-block bg-gold-deep text-white font-round font-bold text-[0.75rem] px-3 py-1 mr-3 shrink-0 min-w-[5.5rem] text-center">{children}</span>
);

// 検索結果の病院カード（原案08）
export const HospitalCard = ({ h, selected = false, onSelect }) => (
  <li>
    <article
      className={`bg-white border p-5 md:p-6 ${selected ? 'border-accent-red-text border-2' : 'border-gold'}`}
      onClick={() => onSelect?.(h.id)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[1.15rem] md:text-[1.3rem] border-l-[6px] border-gold pl-3">
            <Link to={`/hospitals/${h.id}`} className="hover:text-gold-deep">{h.name}</Link>
          </h3>
          <p className="mt-2 flex items-center gap-2 text-[0.85rem]"><CirclePlus size={16} className="text-accent-red shrink-0" aria-hidden="true" />{h.departments.join(' / ')}</p>
          <p className="flex items-center gap-2 text-[0.85rem]"><MapPin size={16} className="text-accent-red shrink-0" aria-hidden="true" />{h.address}</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <FavoriteButton id={h.id} name={h.name} />
          <Button to={`/hospitals/${h.id}`}>詳しくはこちら</Button>
        </div>
      </div>

      <p className="mt-4 flex items-center"><Label><Phone size={13} className="inline mr-1 -mt-0.5" aria-hidden="true" />電話番号</Label>
        <a href={`tel:${h.tel.replace(/-/g, '')}`} className="text-[1.3rem] font-bold tracking-wider">{h.tel}</a>
      </p>
      <p className="mt-2 flex items-start"><Label><TrainFront size={13} className="inline mr-1 -mt-0.5" aria-hidden="true" />最寄駅</Label>
        <span className="text-[0.85rem]">{h.stations.join('　')}</span>
      </p>

      <div className="mt-4 flex flex-col lg:flex-row gap-4 lg:gap-8 lg:items-start">
        <div className="overflow-x-auto"><ScheduleTable schedule={h.schedule} /></div>
        <FeatureIcons features={h.features} />
      </div>
      <p className="mt-3 text-[0.8rem]">休診日：{h.holiday}</p>
      <p className="mt-1 text-[0.75rem] text-ink-sub">情報更新日：{h.updated}</p>
    </article>
  </li>
);
