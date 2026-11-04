import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Map as MapIcon, LocateFixed, SlidersHorizontal } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import { AdBanner } from '../components/ui/AdBanner';
import { NursingHomeCard } from '../components/search/NursingHomeCard';
import { FacilityMap } from '../components/search/FacilityMap';
import { SearchTypeTabs } from '../components/search/SearchTypeTabs';
import { usePageTitle } from '../hooks/usePageTitle';
import { PREFECTURES } from '../data/nav';
import { useKaigoPrefData } from '../hooks/useMedical';
import { distanceKm } from '../lib/distance';
import { getLastPref, setLastPref } from '../lib/lastPref';
import { citiesOf } from '../lib/cities';
import { StationPicker } from '../components/search/StationPicker';
import { encodeStation, parseStation, PREF_NAME_BY_CODE, RADIUS_OPTIONS, DEFAULT_RADIUS, STATION_SOURCE } from '../data/stations';
import { KAIGO_TYPES, CAPACITY_OPTIONS, PREF_CODES, KAIGO_SOURCE_NAME, searchKaigo } from '../data/kaigo';

const PAGE_SIZE = 10;
const field = 'w-full h-11 px-3 border border-gold rounded bg-white text-[0.9rem] focus:outline-none focus:border-gold-deep';

// 条件は、URLの ?pref=東京&q=…&type=331&size=small&page=2 に持つ
const readParams = (sp) => ({
  q: sp.get('q') ?? '',
  pref: sp.get('pref') ?? '',
  type: sp.get('type') ?? '',
  city: sp.get('city') ?? '',
  st: sp.get('st') ?? '',
  r: sp.get('r') ?? '',
  size: sp.get('size') ?? '',
  sort: sp.get('sort') ?? '',
  page: Math.max(1, Number(sp.get('page')) || 1),
});

const toQuery = (p) => {
  const sp = new URLSearchParams();
  ['q', 'pref', 'city', 'type', 'size', 'sort'].forEach((k) => p[k] && sp.set(k, p[k]));
  if (p.st) sp.set('st', p.st);
  if (p.st && p.r) sp.set('r', p.r);
  if (p.page > 1) sp.set('page', String(p.page));
  return sp;
};

// 条件の入力欄。URLが変わるたびに作り直して（key）、入力中の内容を、いまの検索条件にそろえる
const RefineForm = ({ params, items, onSubmit }) => {
  const [draft, setDraft] = useState(params);
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit({ q: draft.q, st: draft.st, r: draft.st ? draft.r : '', pref: draft.pref, city: draft.pref === params.pref ? draft.city : '', type: draft.type, size: draft.size }); }}
      className="bg-cream-50 p-4 md:p-6 mb-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5"
    >
      <div className="md:col-span-2 lg:col-span-5 border border-dashed border-gold p-3 bg-white">
        <p className="font-round font-bold text-gold-deep text-[0.85rem] mb-2">駅から探す（直線距離）</p>
        <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
          <StationPicker onPick={(s) => setDraft({ ...draft, st: encodeStation(s), pref: PREF_NAME_BY_CODE[s.p], city: '' })} />
          <label className="text-[0.8rem]">距離
            <select value={draft.r || String(DEFAULT_RADIUS)} onChange={(e) => setDraft({ ...draft, r: e.target.value })} className={`${field} mt-1`}>
              {RADIUS_OPTIONS.map((km) => <option key={km} value={km}>{km}km以内</option>)}
            </select>
          </label>
        </div>
        <p className="mt-1 text-[0.75rem] text-ink-sub">駅名を入力して、候補から選び、下のボタン（再検索）を押してください。{draft.st && draft.st !== params.st && <strong className="text-gold-deep">（{parseStation(draft.st)?.name}駅を選びました）</strong>}</p>
      </div>
      <label className="md:col-span-2 lg:col-span-5 text-[0.8rem]">キーワード（施設名・地名・運営法人）
        <input value={draft.q} onChange={(e) => setDraft({ ...draft, q: e.target.value })} placeholder="例：世田谷" className={`${field} mt-1`} />
      </label>
      <label className="text-[0.8rem]">エリア
        <select value={draft.pref} onChange={(e) => setDraft({ ...draft, pref: e.target.value })} className={`${field} mt-1`}>
          <option value="">選んでください</option>
          {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </label>
      {draft.pref && draft.pref === params.pref && (
        <label className="text-[0.8rem]">市区町村
          <select value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} className={`${field} mt-1`} disabled={!items}>
            <option value="">すべて</option>
            {citiesOf(items).map((c) => <option key={c.name} value={c.name}>{c.name}（{c.n}）</option>)}
          </select>
        </label>
      )}
      <label className="text-[0.8rem]">施設の種類
        <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} className={`${field} mt-1`}>
          <option value="">すべて</option>
          {KAIGO_TYPES.map((t) => <option key={t.code} value={t.code}>{t.label}</option>)}
        </select>
      </label>
      <label className="text-[0.8rem]">定員
        <select value={draft.size} onChange={(e) => setDraft({ ...draft, size: e.target.value })} className={`${field} mt-1`}>
          <option value="">指定なし</option>
          {CAPACITY_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
      </label>
      <div className="flex items-end"><Button type="submit" icon={null} className="w-full">この条件で探す</Button></div>
    </form>
  );
};

// 老人ホームを探す（検索と結果を1ページにまとめている）
export const NursingSearchPage = () => {
  usePageTitle('老人ホームを探す');
  const [sp, setSp] = useSearchParams();
  const params = readParams(sp);
  const [showMap, setShowMap] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const code = PREF_CODES[params.pref] ?? '';
  const { items, loading, error } = useKaigoPrefData(code);
  const results = items ? searchKaigo(items, params) : [];
  const [loc, setLoc] = useState(null); // 現在地。この端末の中だけで使う
  const [geo, setGeo] = useState('idle');
  // 駅から探す：駅から指定の距離（直線）以内に絞って、近い順に並べる
  const station = parseStation(params.st);
  const radius = Number(params.r) || DEFAULT_RADIUS;
  const near = !station && params.sort === 'near' && loc !== null;
  const center = station ?? (near ? loc : null);
  const distances = new Map();
  if (center) {
    results.forEach((n) => { if (n.lat !== null) distances.set(n.id, distanceKm(center, n)); });
    results.sort((x, y) => (distances.get(x.id) ?? Infinity) - (distances.get(y.id) ?? Infinity));
    if (station) {
      for (let i = results.length - 1; i >= 0; i -= 1) if (!((distances.get(results[i].id) ?? Infinity) <= radius)) results.splice(i, 1);
    }
  }
  const total = results.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(params.page, pages);
  const shown = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const from = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(total, page * PAGE_SIZE);

  const update = (next) => setSp(toQuery({ ...params, page: 1, ...('pref' in next && next.pref !== params.pref ? { city: '' } : {}), ...next }));
  useEffect(() => { setLastPref(params.pref); }, [params.pref]);
  const lastPref = getLastPref();
  const askLocation = () => {
    if (!navigator.geolocation) { setGeo('error'); return; }
    setGeo('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeo('idle'); update({ sort: 'near' }); },
      (err) => setGeo(err.code === 1 ? 'denied' : 'error'),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 },
    );
  };
  const pageLink = (n) => `?${toQuery({ ...params, page: n }).toString()}`;

  const chips = [
    params.q && { key: 'q', label: `「${params.q}」`, clear: { q: '' } },
    params.pref && { key: 'pref', label: params.pref, clear: { pref: '' } },
    station && { key: 'st', label: `${station.name}駅から${radius}km以内`, clear: { st: '', r: '' } },
    params.city && { key: 'city', label: params.city, clear: { city: '' } },
    params.type && { key: 'type', label: KAIGO_TYPES.find((t) => t.code === params.type)?.label ?? params.type, clear: { type: '' } },
    params.size && { key: 'size', label: CAPACITY_OPTIONS.find((o) => o.key === params.size)?.label ?? params.size, clear: { size: '' } },
  ].filter(Boolean);

  return (
    <>
      <Breadcrumb items={[{ label: '病院・介護施設を探す', to: '/search' }, { label: '老人ホームを探す' }]} />
      <div className="max-w-content mx-auto px-4 py-10 md:py-14">
        <SectionTitle as="h1">病院・介護施設を探す</SectionTitle>
        <SearchTypeTabs active="nursing" />

        <p className="text-center font-round font-bold text-[1.05rem] md:text-[1.2rem] mb-8" aria-live="polite">
          <span className="mr-3">老人ホーム・介護施設</span>
          {!params.pref ? 'エリアを選んでください' : loading ? '読み込んでいます…' : <>全<span className="text-accent-red-text text-[1.6rem] md:text-[1.9rem] mx-0.5">{total}</span>件／{from}〜{to}件を表示中</>}
        </p>

        <div className="md:hidden mb-4 text-center">
          <button onClick={() => setPanelOpen((v) => !v)} aria-expanded={panelOpen || !params.pref} className="inline-flex items-center gap-2 min-h-[44px] px-5 border border-gold-deep text-gold-deep font-round font-bold">
            <SlidersHorizontal size={18} aria-hidden="true" />{panelOpen || !params.pref ? '条件の入力欄を閉じる' : '条件を変える'}
          </button>
        </div>
        <div className={panelOpen || !params.pref ? 'block' : 'hidden md:block'}>
        {/* 再検索 */}
        <RefineForm key={sp.toString()} params={params} items={items} onSubmit={update} />
        </div>

        {/* 選択中の条件 */}
        <div className="flex flex-col sm:flex-row border border-accent-red-text mb-6">
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

        <p className="mb-6 bg-cream-50 p-4 text-[0.85rem] leading-relaxed">
          ここに載っているのは、介護保険の指定を受けた施設（介護付き有料老人ホーム、軽費老人ホーム、サービス付き高齢者向け住宅（介護付き）、グループホーム、特別養護老人ホーム、介護老人保健施設）です。
          <strong>住宅型有料老人ホームなどは、順次追加します。</strong>費用や空き状況は、公的データにないため、施設へご確認ください。
        </p>

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
        {showMap && <FacilityMap items={shown.filter((n) => n.lat !== null)} className="h-[300px] md:h-[380px] mb-8" />}

        <AdBanner placement="search" className="h-[60px] md:h-[75px] mb-8" />

        {!params.pref ? (
          <div className="bg-white border border-gold p-6 md:p-8">
            <p className="mb-4 text-center font-round font-bold">まず、エリア（都道府県）を選んでください</p>
            {lastPref && (
              <p className="mb-4 text-center"><button onClick={() => update({ pref: lastPref })} className="min-h-[44px] px-5 bg-gold-deep text-white font-round font-bold">前回のエリア「{lastPref}」で探す</button></p>
            )}
            <ul className="flex flex-wrap justify-center gap-2">
              {PREFECTURES.map((p) => (
                <li key={p}><button onClick={() => update({ pref: p })} className="min-h-[44px] px-4 bg-cream-100 hover:bg-cream-200 border border-gold text-[0.9rem]">{p}</button></li>
              ))}
            </ul>
          </div>
        ) : loading ? (
          <p className="text-center py-10" role="status">データを読み込んでいます…</p>
        ) : error ? (
          <p className="text-center py-10">データを読み込めませんでした。通信を確認して、もう一度お試しください。</p>
        ) : total === 0 ? (
          <div className="bg-white border border-gold p-8 text-center">
            <p className="mb-2">条件に合う施設が、見つかりませんでした。</p>
            <p className="text-[0.85rem] mb-5">条件を減らして、もう一度お試しください。</p>
            <Button to={`/search/nursing?pref=${encodeURIComponent(params.pref)}`} icon={null}>条件をすべて外す</Button>
          </div>
        ) : (
          <ul className="grid gap-5">{shown.map((n) => <NursingHomeCard key={n.id} n={n} distanceKm={distances.get(n.id)} distanceFrom={station ? `${station.name}駅` : '現在地'} />)}</ul>
        )}

        {pages > 1 && (
          <nav aria-label="ページ送り" className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {page > 1 && <Link to={pageLink(page - 1)} className="inline-flex items-center gap-1 min-h-[40px] px-4 bg-gold-deep text-white font-round font-bold"><ChevronLeft size={16} aria-hidden="true" />前へ</Link>}
            <span className="px-3 text-[0.9rem]">{page} / {pages} ページ</span>
            {page < pages && <Link to={pageLink(page + 1)} className="inline-flex items-center gap-1 min-h-[40px] px-4 bg-gold-deep text-white font-round font-bold">次へ<ChevronRight size={16} aria-hidden="true" /></Link>}
          </nav>
        )}

        <p className="mt-8 text-[0.75rem] text-ink-sub">出典：{KAIGO_SOURCE_NAME}（2026年6月末時点）。{station && <>駅のデータは、{STATION_SOURCE}を加工して作成しています。駅からの距離は、直線距離の目安です。</>}報告された内容がそのまま載っており、古い情報や誤りを含む場合があります。見学や契約の前に、必ず各施設へご確認ください。</p>
      </div>
    </>
  );
};
