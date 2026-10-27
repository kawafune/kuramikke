import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, TrainFront, Building2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { NURSING_FEATURES, yen, monthlyRange } from '../../data/nursingHomes';

const Label = ({ children }) => (
  <span className="inline-block bg-gold-deep text-white font-round font-bold text-[0.75rem] px-3 py-1 mr-3 shrink-0 min-w-[5.5rem] text-center">{children}</span>
);

export const NursingFeatureIcons = ({ features, className = '' }) => (
  <ul className={`flex flex-wrap gap-x-4 gap-y-2 ${className}`}>
    {NURSING_FEATURES.filter((f) => features.includes(f.key)).map(({ key, label, Icon }) => (
      <li key={key} className="flex items-center gap-1.5 text-[0.8rem] font-round font-bold">
        <span className="w-7 h-7 rounded bg-[#2A7A73] text-white flex items-center justify-center"><Icon size={16} aria-hidden="true" /></span>
        {label}
      </li>
    ))}
  </ul>
);

// 検索結果の老人ホームのカード（病院のカードと同じ並び）
export const NursingHomeCard = ({ n }) => (
  <li>
    <article className="bg-white border border-gold p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[1.15rem] md:text-[1.3rem] border-l-[6px] border-gold pl-3">
            <Link to={`/nursing-homes/${n.id}`} className="hover:text-gold-deep">{n.name}</Link>
          </h3>
          <p className="mt-2 flex items-center gap-2 text-[0.85rem]"><Building2 size={16} className="text-accent-red shrink-0" aria-hidden="true" />{n.type}</p>
          <p className="flex items-center gap-2 text-[0.85rem]"><MapPin size={16} className="text-accent-red shrink-0" aria-hidden="true" />{n.address}</p>
        </div>
        <Button to={`/nursing-homes/${n.id}`} className="w-full sm:w-auto !px-5 sm:!px-8">詳しくはこちら</Button>
      </div>

      <p className="mt-4 flex items-center"><Label><Phone size={13} className="inline mr-1 -mt-0.5" aria-hidden="true" />電話番号</Label>
        <a href={`tel:${n.tel.replace(/-/g, '')}`} className="text-[1.3rem] font-bold tracking-wider">{n.tel}</a>
      </p>
      <p className="mt-2 flex items-start"><Label><TrainFront size={13} className="inline mr-1 -mt-0.5" aria-hidden="true" />最寄駅</Label>
        <span className="text-[0.85rem]">{n.stations.join('　')}</span>
      </p>

      <dl className="mt-4 grid sm:grid-cols-2 gap-px bg-line border border-line text-[0.9rem]">
        <div className="bg-white p-3"><dt className="text-[0.75rem] text-ink-sub">入居時の費用</dt><dd className="font-bold">{yen(n.entryFee)}</dd></div>
        <div className="bg-white p-3"><dt className="text-[0.75rem] text-ink-sub">月額の費用</dt><dd className="font-bold">{monthlyRange(n.monthlyFee)}</dd></div>
        <div className="bg-white p-3 sm:col-span-2"><dt className="text-[0.75rem] text-ink-sub">受け入れ</dt><dd>{n.accepts.join('・')}の方</dd></div>
      </dl>
      <NursingFeatureIcons features={n.features} className="mt-4" />
      <p className="mt-3 text-[0.75rem] text-ink-sub">費用は目安です。条件によって変わります。情報更新日：{n.updated}</p>
    </article>
  </li>
);
