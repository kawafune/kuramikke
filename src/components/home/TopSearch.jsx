import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { PREFECTURES } from '../../data/nav';
import { getLastPref } from '../../lib/lastPref';
import { useCities } from '../../hooks/useCities';
import { StationPicker } from '../search/StationPicker';
import { encodeStation, PREF_NAME_BY_CODE, RADIUS_OPTIONS, DEFAULT_RADIUS } from '../../data/stations';

const field = 'w-full h-12 px-3 border border-gold/70 rounded-lg bg-white text-[0.95rem] focus:outline-none focus:border-gold-deep';

// 「病院・介護施設を探す」の検索窓。探す対象（病院・診療所／老人ホーム）を選んで、エリアとキーワードを入れる
export const TopSearch = () => {
  const navigate = useNavigate();
  const [target, setTarget] = useState('hospital');
  const [pref, setPref] = useState(getLastPref); // 前回のエリアを、最初から選んでおく
  const [city, setCity] = useState('');
  const [q, setQ] = useState('');
  const [by, setBy] = useState('area'); // area＝エリアから / station＝駅名から
  const [station, setStation] = useState(null);
  const [radius, setRadius] = useState(String(DEFAULT_RADIUS));
  const cities = useCities(target, pref);

  const submit = (e) => {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (by === 'station') {
      if (!station) return;
      sp.set('pref', PREF_NAME_BY_CODE[station.p]);
      sp.set('st', encodeStation(station));
      sp.set('r', radius);
      navigate(`${target === 'hospital' ? '/search/results' : '/search/nursing'}?${sp.toString()}`);
      return;
    }
    if (pref) sp.set('pref', pref);
    if (pref && city) sp.set('city', city);
    if (q.trim()) sp.set('q', q.trim());
    navigate(`${target === 'hospital' ? '/search/results' : '/search/nursing'}?${sp.toString()}`);
  };

  return (
    <form onSubmit={submit} className="max-w-[860px] mx-auto mb-10 bg-cream-50 border border-gold/60 rounded-2xl p-4 md:p-6">
      <fieldset className="flex flex-wrap justify-center gap-x-6 gap-y-1 mb-4">
        <legend className="sr-only">探すもの</legend>
        {[['hospital', '病院・診療所'], ['nursing', '老人ホーム・介護施設']].map(([v, label]) => (
          <label key={v} className="inline-flex items-center gap-2 min-h-[40px] cursor-pointer font-round font-bold text-[0.95rem]">
            <input type="radio" name="top-search-target" value={v} checked={target === v} onChange={() => setTarget(v)} className="w-5 h-5 accent-[#8A6D0B]" />
            {label}
          </label>
        ))}
      </fieldset>
      <fieldset className="flex flex-wrap justify-center gap-x-6 gap-y-1 mb-4 text-[0.9rem]">
        <legend className="sr-only">探し方</legend>
        {[['area', 'エリアから'], ['station', '駅名から']].map(([v, label]) => (
          <label key={v} className="inline-flex items-center gap-2 min-h-[36px] cursor-pointer">
            <input type="radio" name="top-search-by" value={v} checked={by === v} onChange={() => setBy(v)} className="w-4 h-4 accent-[#8A6D0B]" />
            {label}
          </label>
        ))}
      </fieldset>
      {by === 'station' ? (
        <div className="grid gap-3 md:grid-cols-[1fr_9rem_auto] md:items-end">
          <StationPicker onPick={setStation} />
          <label className="text-[0.8rem]">距離（直線）
            <select value={radius} onChange={(e) => setRadius(e.target.value)} className={`${field} mt-1`}>
              {RADIUS_OPTIONS.map((km) => <option key={km} value={km}>{km}km以内</option>)}
            </select>
          </label>
          <Button type="submit" icon={null} className="w-full md:w-auto" disabled={!station}>探す</Button>
        </div>
      ) : (
      <div className={`grid gap-3 md:items-end ${cities.length ? 'md:grid-cols-[9rem_11rem_1fr_auto]' : 'md:grid-cols-[10rem_1fr_auto]'}`}>
        <label className="text-[0.8rem]">エリア
          <select value={pref} onChange={(e) => { setPref(e.target.value); setCity(''); }} className={`${field} mt-1`}>
            <option value="">選んでください</option>
            {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        {cities.length > 0 && (
          <label className="text-[0.8rem]">市区町村
            <select value={city} onChange={(e) => setCity(e.target.value)} className={`${field} mt-1`}>
              <option value="">すべて</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        )}
        <label className="text-[0.8rem]">{target === 'hospital' ? '診療科目・名前・地名' : '施設名・地名・運営法人'}
          <span className="relative block mt-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-sub" aria-hidden="true" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={target === 'hospital' ? '例：内科、渋谷' : '例：世田谷'} className={`${field} pl-10`} />
          </span>
        </label>
        <Button type="submit" icon={null} className="w-full md:w-auto">探す</Button>
      </div>
      )}
    </form>
  );
};
