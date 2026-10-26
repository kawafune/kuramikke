import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Map as MapIcon } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import { AdBanner } from '../components/ui/AdBanner';
import { HospitalCard } from '../components/search/HospitalCard';
import { FacilityMap } from '../components/search/FacilityMap';
import { SearchTypeTabs } from '../components/search/SearchTypeTabs';
import { usePageTitle } from '../hooks/usePageTitle';
import { PREFECTURES } from '../data/nav';
import { DEPARTMENTS, FEATURE_LIST, WEEKDAYS, DATA_SOURCE, searchHospitals } from '../data/hospitals';

const PAGE_SIZE = 10;
const field = 'w-full h-11 px-3 border border-gold rounded bg-white text-[0.9rem] focus:outline-none focus:border-gold-deep';

// 検索の条件は、URLの ?q=…&pref=…&dept=…&day=…&slot=…&f=night,parking&page=2 に持つ（共有・戻るボタンが使える）
const readParams = (sp) => ({
  q: sp.get('q') ?? '',
  pref: sp.get('pref') ?? '',
  dept: sp.get('dept') ?? '',
  day: sp.get('day') ?? '',
  slot: sp.get('slot') ?? '',
  features: (sp.get('f') ?? '').split(',').filter(Boolean),
  page: Math.max(1, Number(sp.get('page')) || 1),
});

const toQuery = (p) => {
  const sp = new URLSearchParams();
  if (p.q) sp.set('q', p.q);
  if (p.pref) sp.set('pref', p.pref);
  if (p.dept) sp.set('dept', p.dept);
  if (p.day !== '') sp.set('day', p.day);
  if (p.slot !== '') sp.set('slot', p.slot);
  if (p.features.length) sp.set('f', p.features.join(','));
  if (p.page > 1) sp.set('page', String(p.page));
  return sp;
};

const SLOTS = ['午前', '午後'];

// 検索結果（原案08）
export const SearchResultsPage = () => {
  usePageTitle('検索結果｜病院を探す');
  const [sp, setSp] = useSearchParams();
  const params = readParams(sp);
  const [showMap, setShowMap] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState(params);

  const results = searchHospitals(params); // 件数が少ないので、毎回計算してよい（取り込み後に多くなったら、サーバー側の検索にする）
  const total = results.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(params.page, pages);
  const shown = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const from = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(total, page * PAGE_SIZE);

  const update = (next) => setSp(toQuery({ ...params, page: 1, ...next }));

  // 選択中の条件（×で外せる）
  const chips = [
    params.q && { key: 'q', label: `「${params.q}」`, clear: { q: '' } },
    params.pref && { key: 'pref', label: params.pref, clear: { pref: '' } },
    params.dept && { key: 'dept', label: params.dept, clear: { dept: '' } },
    params.day !== '' && { key: 'day', label: `${WEEKDAYS[Number(params.day)]}曜日`, clear: { day: '', slot: '' } },
    params.slot !== '' && { key: 'slot', label: SLOTS[Number(params.slot)], clear: { slot: '' } },
    ...params.features.map((f) => ({ key: f, label: FEATURE_LIST.find((x) => x.key === f)?.label ?? f, clear: { features: params.features.filter((x) => x !== f) } })),
  ].filter(Boolean);

  const toggleFeature = (key) => update({ features: params.features.includes(key) ? params.features.filter((x) => x !== key) : [...params.features, key] });
  const pageLink = (n) => `?${toQuery({ ...params, page: n }).toString()}`;

  return (
    <>
      <Breadcrumb items={[{ label: '病院・介護施設を探す', to: '/search' }, { label: '検索結果' }]} />
      <div className="max-w-content mx-auto px-4 py-10 md:py-14">
        <SectionTitle as="h1">病院・介護施設を探す</SectionTitle>
        <SearchTypeTabs active="hospital" />

        <p className="text-center font-round font-bold text-[1.05rem] md:text-[1.2rem] mb-8" aria-live="polite">
          <span className="mr-3">検索結果一覧</span>全<span className="text-accent-red-text text-[1.6rem] md:text-[1.9rem] mx-0.5">{total}</span>件／{from}〜{to}件を表示中
        </p>

        {/* 選択中の条件 */}
        <div className="flex flex-col sm:flex-row border border-accent-red-text mb-3">
          <p className="bg-accent-red-text text-white font-round font-bold px-5 py-3 sm:w-[11rem] shrink-0 text-center">選択中の条件</p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
            {chips.length === 0 && <li className="text-[0.85rem] text-ink-sub">条件は、選ばれていません（すべての病院）</li>}
            {chips.map((c) => (
              <li key={c.key}>
                <button onClick={() => update(c.clear)} className="inline-flex items-center gap-1.5 bg-cream-100 border border-gold px-3 py-1 text-[0.85rem]" aria-label={`${c.label}の条件を外す`}>
                  {c.label}<X size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 条件を追加する */}
        <div className="flex flex-col sm:flex-row border border-[#2A7A73] mb-8">
          <p className="bg-[#2A7A73] text-white font-round font-bold px-5 py-3 sm:w-[11rem] shrink-0 text-center">条件を追加する</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3">
            {FEATURE_LIST.map(({ key, label }) => (
              <li key={key}>
                <label className="inline-flex items-center gap-2 min-h-[36px] cursor-pointer text-[0.9rem]">
                  <input type="checkbox" checked={params.features.includes(key)} onChange={() => toggleFeature(key)} className="w-5 h-5 accent-[#2A7A73]" />
                  {label}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* 再検索 */}
        <form
          onSubmit={(e) => { e.preventDefault(); update({ q: draft.q, pref: draft.pref, dept: draft.dept, day: draft.day, slot: draft.slot }); }}
          className="bg-cream-50 p-4 md:p-6 mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-5"
        >
          <label className="md:col-span-2 lg:col-span-2 text-[0.8rem]">キーワード（院名・地名・駅名）
            <input value={draft.q} onChange={(e) => setDraft({ ...draft, q: e.target.value })} placeholder="エリアを絞り込む" className={`${field} mt-1`} />
          </label>
          <label className="text-[0.8rem]">エリア
            <select value={draft.pref} onChange={(e) => setDraft({ ...draft, pref: e.target.value })} className={`${field} mt-1`}>
              <option value="">すべて</option>
              {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="text-[0.8rem]">診療科目
            <select value={draft.dept} onChange={(e) => setDraft({ ...draft, dept: e.target.value })} className={`${field} mt-1`}>
              <option value="">すべて</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[0.8rem]">曜日
              <select value={draft.day} onChange={(e) => setDraft({ ...draft, day: e.target.value })} className={`${field} mt-1`}>
                <option value="">指定なし</option>
                {WEEKDAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
              </select>
            </label>
            <label className="text-[0.8rem]">時間
              <select value={draft.slot} onChange={(e) => setDraft({ ...draft, slot: e.target.value })} className={`${field} mt-1`}>
                <option value="">指定なし</option>
                {SLOTS.map((s, i) => <option key={s} value={i}>{s}</option>)}
              </select>
            </label>
          </div>
          <div className="md:col-span-2 lg:col-span-5 text-center"><Button type="submit" icon={null}>この条件で再検索する</Button></div>
        </form>

        <div className="mb-6 text-center">
          <button onClick={() => setShowMap((v) => !v)} aria-expanded={showMap} className="inline-flex items-center gap-2 min-h-[44px] px-5 border border-gold-deep text-gold-deep font-round font-bold">
            <MapIcon size={18} aria-hidden="true" />{showMap ? '地図を閉じる' : '地図で見る'}
          </button>
        </div>
        {showMap && (
          <FacilityMap items={shown} selectedId={selectedId} onSelect={setSelectedId} className="h-[300px] md:h-[380px] mb-8" />
        )}

        <AdBanner className="h-[60px] md:h-[75px] mb-8" />

        {total === 0 ? (
          <div className="bg-white border border-gold p-8 text-center">
            <p className="mb-2">条件に合う病院が、見つかりませんでした。</p>
            <p className="text-[0.85rem] mb-5">条件を減らして、もう一度お試しください。（いまの仮データは、東京・大阪・福岡・愛知・北海道のみです）</p>
            <Button to="/search/results" icon={null}>条件をすべて外す</Button>
          </div>
        ) : (
          <ul className="grid gap-5">
            {shown.map((h) => <HospitalCard key={h.id} h={h} selected={h.id === selectedId} onSelect={setSelectedId} />)}
          </ul>
        )}

        {/* ページ送り */}
        {pages > 1 && (
          <nav aria-label="ページ送り" className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {page > 1 && <Link to={pageLink(page - 1)} className="inline-flex items-center gap-1 min-h-[40px] px-4 bg-gold-deep text-white font-round font-bold"><ChevronLeft size={16} aria-hidden="true" />前へ</Link>}
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link key={n} to={pageLink(n)} aria-current={n === page ? 'page' : undefined} className={`w-10 h-10 flex items-center justify-center ${n === page ? 'bg-gold-deep text-white' : 'bg-cream-100 hover:bg-cream-200'}`}>{n}</Link>
            ))}
            {page < pages && <Link to={pageLink(page + 1)} className="inline-flex items-center gap-1 min-h-[40px] px-4 bg-gold-deep text-white font-round font-bold">次へ<ChevronRight size={16} aria-hidden="true" /></Link>}
          </nav>
        )}

        <p className="mt-8 text-[0.75rem] text-ink-sub">出典：{DATA_SOURCE.label}（{DATA_SOURCE.fetchedAt} 時点）。受診の前に、必ず各医療機関へご確認ください。</p>
      </div>
    </>
  );
};
