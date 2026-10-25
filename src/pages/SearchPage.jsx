import React, { useMemo, useState } from 'react';
import { Phone, Clock, Search } from 'lucide-react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import { FacilityMap } from '../components/search/FacilityMap';
import { PREFECTURES } from '../data/nav';
import { HOSPITALS, DEPARTMENTS, DATA_SOURCE } from '../data/hospitals';

const TABS = [
  { id: 'hospital', label: '病院を探す' },
  { id: 'nursing', label: '老人ホームを探す' },
];

const field = 'w-full h-11 px-3 border border-[#B5B5B5] rounded bg-white text-[0.9rem] focus:outline-none focus:border-gold-deep';

const HospitalCard = ({ h, selected, onSelect }) => (
  <li>
    <article
      className={`bg-white p-4 border ${selected ? 'border-accent-red border-2' : 'border-gold-line'}`}
      onClick={() => onSelect(h.id)}
    >
      <h3 className="text-[1rem] mb-1">
        <button className="text-left hover:text-gold-deep" onClick={() => onSelect(h.id)}>{h.name}</button>
      </h3>
      <p className="text-[0.85rem]">{h.address}</p>
      <ul className="flex flex-wrap gap-1.5 my-2">
        {h.departments.map((d) => <li key={d} className="bg-cream-200 text-[0.75rem] px-2 py-0.5">{d}</li>)}
      </ul>
      <p className="flex items-center gap-1.5 text-[0.8rem]"><Phone size={15} className="text-gold-deep" aria-hidden="true" />{h.tel}</p>
      <p className="flex items-center gap-1.5 text-[0.8rem]"><Clock size={15} className="text-gold-deep" aria-hidden="true" />{h.hours}（休診日：{h.holiday}）</p>
    </article>
  </li>
);

// 病院検索（老人ホーム検索は同じ画面・同じ地図部品で、次の段階で追加する）
export const SearchPage = () => {
  const [tab, setTab] = useState('hospital');
  const [keyword, setKeyword] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const results = useMemo(() => HOSPITALS.filter((h) => (
    (!keyword || `${h.name}${h.address}`.includes(keyword.trim())) &&
    (!prefecture || h.prefecture === prefecture) &&
    (!department || h.departments.includes(department))
  )), [keyword, prefecture, department]);

  return (
    <div className="max-w-content mx-auto px-4 py-10 md:py-14">
      <SectionTitle as="h1">病院・介護施設を探す</SectionTitle>

      <div role="tablist" className="flex mb-6 border-b-2 border-gold">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 md:flex-none md:px-10 min-h-[48px] font-round font-bold text-[0.9rem] ${tab === t.id ? 'bg-gold-deep text-white' : 'bg-cream-100 text-gold-deep'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'nursing' ? (
        <p className="text-center py-16">老人ホーム検索は、ただいま準備中です。まずは病院検索からはじめます。</p>
      ) : (
        <>
          <form onSubmit={(e) => e.preventDefault()} className="bg-cream-50 p-4 md:p-6 mb-6 grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
            <label className="block text-[0.8rem]">キーワード
              <span className="relative block mt-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-sub" aria-hidden="true" />
                <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="病院名・住所" className={`${field} pl-10`} />
              </span>
            </label>
            <label className="block text-[0.8rem]">エリア
              <select value={prefecture} onChange={(e) => setPrefecture(e.target.value)} className={`${field} mt-1`}>
                <option value="">すべて</option>
                {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label className="block text-[0.8rem]">診療科目
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className={`${field} mt-1`}>
                <option value="">すべて</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
          </form>

          <p className="mb-3 text-[0.9rem]" aria-live="polite">
            <span className="text-accent-red-text text-[1.3rem] mr-1">{results.length}</span>件の病院が見つかりました
          </p>

          <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
            {/* スマホは地図を上に、PCは右に */}
            <FacilityMap items={results} selectedId={selectedId} onSelect={setSelectedId} className="h-[260px] lg:h-[480px] lg:sticky lg:top-[170px] lg:self-start lg:order-2" />
            <ul className="grid gap-3 lg:order-1 content-start">
              {results.map((h) => <HospitalCard key={h.id} h={h} selected={h.id === selectedId} onSelect={setSelectedId} />)}
              {results.length === 0 && (
                <li className="bg-white border border-gold-line p-6 text-center">
                  条件に合う病院がありません。<br />
                  <span className="text-[0.8rem]">（いまの仮データは東京のみです）</span>
                  <div className="mt-4"><Button onClick={() => { setKeyword(''); setPrefecture(''); setDepartment(''); }}>条件をリセット</Button></div>
                </li>
              )}
            </ul>
          </div>

          <p className="mt-6 text-[0.75rem] text-ink-sub">出典：{DATA_SOURCE.label}（{DATA_SOURCE.fetchedAt} 時点）。診察の前に、必ず各医療機関へご確認ください。</p>
        </>
      )}
    </div>
  );
};
