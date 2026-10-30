import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Map as MapIcon, LocateFixed } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import { AdBanner } from '../components/ui/AdBanner';
import { HospitalCard } from '../components/search/HospitalCard';
import { FacilityMap } from '../components/search/FacilityMap';
import { SearchTypeTabs } from '../components/search/SearchTypeTabs';
import { EmergencyNotice } from '../components/search/EmergencyNotice';
import { usePageTitle } from '../hooks/usePageTitle';
import { PREFECTURES } from '../data/nav';
import { todayStatus } from '../lib/today';
import { distanceKm } from '../lib/distance';
import { usePrefData } from '../hooks/useMedical';
import { DEPARTMENTS, FEATURE_LIST, KINDS, PREF_CODES, WEEKDAYS, DATA_SOURCE_NAME, asOfLabel, DATA_ASOF, searchFacilities } from '../data/medical';

const PAGE_SIZE = 10;
const field = 'w-full h-11 px-3 border border-gold rounded bg-white text-[0.9rem] focus:outline-none focus:border-gold-deep';

// 検索の条件は、URLの ?pref=東京&q=…&dept=…&kind=clinic&day=…&slot=…&f=night,holiday&page=2 に持つ（共有・戻るボタンが使える）
const readParams = (sp) => ({
  q: sp.get('q') ?? '',
  pref: sp.get('pref') ?? '',
  dept: sp.get('dept') ?? '',
  kind: sp.get('kind') ?? '',
  sort: sp.get('sort') ?? '',
  day: sp.get('day') ?? '',
  slot: sp.get('slot') ?? '',
  now: sp.get('now') === '1',
  features: (sp.get('f') ?? '').split(',').filter(Boolean),
  page: Math.max(1, Number(sp.get('page')) || 1),
});

const toQuery = (p) => {
  const sp = new URLSearchParams();
  if (p.q) sp.set('q', p.q);
  if (p.pref) sp.set('pref', p.pref);
  if (p.dept) sp.set('dept', p.dept);
  if (p.kind) sp.set('kind', p.kind);
  if (p.sort) sp.set('sort', p.sort);
  if (p.day !== '') sp.set('day', p.day);
  if (p.slot !== '') sp.set('slot', p.slot);
  if (p.now) sp.set('now', '1');
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
  const [loc, setLoc] = useState(null); // 現在地。この端末の中だけで使う（URLにも、サーバーにも出さない）
  const [geo, setGeo] = useState('idle'); // idle / loading / denied / error

  const code = PREF_CODES[params.pref] ?? '';
  const { items, loading, error } = usePrefData(code);
  // 1県は数万件になることがあるが、条件で絞るだけなので、毎回計算してよい
  const nowDate = new Date();
  const results = items
    ? searchFacilities(items, params).filter((h) => !params.now || todayStatus(h.schedule, nowDate).kind === 'open')
    : [];
  // 近い順：現在地がわかっているときだけ。座標が無い施設は、最後に並べる
  const near = params.sort === 'near' && loc !== null;
  const distances = new Map();
  if (near) {
    results.forEach((h) => { if (h.lat !== null) distances.set(h.id, distanceKm(loc, h)); });
    results.sort((a, b) => (distances.get(a.id) ?? Infinity) - (distances.get(b.id) ?? Infinity));
  }
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
    params.kind && { key: 'kind', label: KINDS.find((k) => k.key === params.kind)?.label ?? params.kind, clear: { kind: '' } },
    params.dept && { key: 'dept', label: params.dept, clear: { dept: '' } },
    params.day !== '' && { key: 'day', label: `${WEEKDAYS[Number(params.day)]}曜日`, clear: { day: '', slot: '' } },
    params.slot !== '' && { key: 'slot', label: SLOTS[Number(params.slot)], clear: { slot: '' } },
    params.now && { key: 'now', label: 'いま受付中', clear: { now: false } },
    ...params.features.map((f) => ({ key: f, label: FEATURE_LIST.find((x) => x.key === f)?.label ?? f, clear: { features: params.features.filter((x) => x !== f) } })),
  ].filter(Boolean);

  const askLocation = () => {
    if (!navigator.geolocation) { setGeo('error'); return; }
    setGeo('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeo('idle'); update({ sort: 'near' }); },
      (err) => setGeo(err.code === 1 ? 'denied' : 'error'),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 },
    );
  };
  const toggleFeature = (key) => update({ features: params.features.includes(key) ? params.features.filter((x) => x !== key) : [...params.features, key] });
  const pageLink = (n) => `?${toQuery({ ...params, page: n }).toString()}`;

  return (
    <>
      <Breadcrumb items={[{ label: '病院・介護施設を探す', to: '/search' }, { label: '病院を探す', to: '/search' }, { label: '検索結果' }]} />
      <div className="max-w-content mx-auto px-4 py-10 md:py-14">
        <SectionTitle as="h1">病院・介護施設を探す</SectionTitle>
        <SearchTypeTabs active="hospital" />
        <EmergencyNotice compact />
        <div className="h-8" />

        <p className="text-center font-round font-bold text-[1.05rem] md:text-[1.2rem] mb-8" aria-live="polite">
          <span className="mr-3">検索結果一覧</span>
          {loading ? '読み込んでいます…' : <>全<span className="text-accent-red-text text-[1.6rem] md:text-[1.9rem] mx-0.5">{total}</span>件／{from}〜{to}件を表示中</>}
        </p>

        {/* 選択中の条件 */}
        <div className="flex flex-col sm:flex-row border border-accent-red-text mb-3">
          <p className="bg-accent-red-text text-white font-round font-bold px-5 py-3 sm:w-[11rem] shrink-0 text-center">選択中の条件</p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
            {chips.length === 0 && <li className="text-[0.85rem] text-ink-sub">条件は、選ばれていません</li>}
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
            <li>
              <label className="inline-flex items-center gap-2 min-h-[36px] cursor-pointer text-[0.9rem]">
                <input type="checkbox" checked={params.now} onChange={() => update({ now: !params.now })} className="w-5 h-5 accent-[#2A7A73]" />
                いま受付中
                <span className="text-[0.65rem] bg-cream-200 text-ink px-1.5 py-0.5">開発中</span>
              </label>
              {params.now && <p className="text-[0.75rem] text-ink-sub ml-7">※ 目安です。臨時の休診などは反映できないため、お出かけ前にお電話でご確認ください。</p>}
            </li>
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
          onSubmit={(e) => { e.preventDefault(); update({ q: draft.q, pref: draft.pref, kind: draft.kind, dept: draft.dept, day: draft.day, slot: draft.slot }); }}
          className="bg-cream-50 p-4 md:p-6 mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-6"
        >
          <label className="md:col-span-2 lg:col-span-2 text-[0.8rem]">キーワード（名前・地名・診療科）
            <input value={draft.q} onChange={(e) => setDraft({ ...draft, q: e.target.value })} placeholder="例：渋谷　内科" className={`${field} mt-1`} />
          </label>
          <label className="text-[0.8rem]">エリア
            <select value={draft.pref} onChange={(e) => setDraft({ ...draft, pref: e.target.value })} className={`${field} mt-1`}>
              <option value="">選んでください</option>
              {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="text-[0.8rem]">種類
            <select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value })} className={`${field} mt-1`}>
              <option value="">病院・診療所</option>
              {KINDS.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}
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
          <div className="md:col-span-2 lg:col-span-6 text-center"><Button type="submit" icon={null}>この条件で再検索する</Button></div>
        </form>

        <div className="mb-4 text-center">
          {near ? (
            <button onClick={() => update({ sort: '' })} className="inline-flex items-center gap-2 min-h-[44px] px-5 bg-[#2A7A73] text-white font-round font-bold">
              <LocateFixed size={18} aria-hidden="true" />近い順に並べています（もとに戻す）
            </button>
          ) : (
            <button onClick={askLocation} disabled={geo === 'loading'} className="inline-flex items-center gap-2 min-h-[44px] px-5 border border-[#2A7A73] text-[#2A7A73] font-round font-bold">
              <LocateFixed size={18} aria-hidden="true" />{geo === 'loading' ? '現在地を調べています…' : '現在地から近い順に並べる'}
            </button>
          )}
          <p className="mt-2 text-[0.75rem] text-ink-sub">現在地は、この端末の中だけで使い、クラミッケには送りません。</p>
          {geo === 'denied' && <p role="alert" className="mt-2 text-[0.85rem] text-accent-red-text font-bold">現在地の利用が許可されていません。ブラウザの設定で、位置情報を許可してください。</p>}
          {geo === 'error' && <p role="alert" className="mt-2 text-[0.85rem] text-accent-red-text font-bold">現在地を調べられませんでした。しばらくしてから、もう一度お試しください。</p>}
        </div>
        <div className="mb-6 text-center">
          <button onClick={() => setShowMap((v) => !v)} aria-expanded={showMap} className="inline-flex items-center gap-2 min-h-[44px] px-5 border border-gold-deep text-gold-deep font-round font-bold">
            <MapIcon size={18} aria-hidden="true" />{showMap ? '地図を閉じる' : '地図で見る'}
          </button>
        </div>
        {showMap && (
          <FacilityMap items={shown.filter((h) => h.lat !== null)} selectedId={selectedId} onSelect={setSelectedId} className="h-[300px] md:h-[380px] mb-8" />
        )}

        <AdBanner placement="search" className="h-[60px] md:h-[75px] mb-8" />

        {!params.pref ? (
          <div className="bg-white border border-gold p-6 md:p-8">
            <p className="mb-4 text-center font-round font-bold">まず、エリア（都道府県）を選んでください</p>
            <ul className="flex flex-wrap justify-center gap-2">
              {PREFECTURES.map((p) => (
                <li key={p}><button onClick={() => update({ pref: p })} className="min-h-[44px] px-4 bg-cream-100 hover:bg-cream-200 border border-gold text-[0.9rem]">{p}</button></li>
              ))}
            </ul>
          </div>
        ) : loading ? (
          <p className="text-center py-10" role="status">データを読み込んでいます…（初回は少し時間がかかります）</p>
        ) : error ? (
          <p className="text-center py-10">データを読み込めませんでした。通信を確認して、もう一度お試しください。</p>
        ) : total === 0 ? (
          <div className="bg-white border border-gold p-8 text-center">
            <p className="mb-2">条件に合う病院・診療所が、見つかりませんでした。</p>
            <p className="text-[0.85rem] mb-5">条件を減らして、もう一度お試しください。</p>
            <Button to={`/search/results?pref=${encodeURIComponent(params.pref)}`} icon={null}>条件をすべて外す</Button>
          </div>
        ) : (
          <ul className="grid gap-5">
            {shown.map((h) => <HospitalCard key={h.id} h={h} selected={h.id === selectedId} onSelect={setSelectedId} distanceKm={distances.get(h.id)} />)}
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

        <p className="mt-8 text-[0.75rem] text-ink-sub">出典：{DATA_SOURCE_NAME}（{asOfLabel(DATA_ASOF)}時点）。報告された内容がそのまま載っており、古い情報や誤りを含む場合があります。受診の前に、必ず各医療機関へご確認ください。</p>
      </div>
    </>
  );
};
