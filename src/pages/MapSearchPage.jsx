import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LocateFixed, MapPin } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SectionTitle } from '../components/ui/SectionTitle';
import { FacilityMap } from '../components/search/FacilityMap';
import { HospitalCard } from '../components/search/HospitalCard';
import { NursingHomeCard } from '../components/search/NursingHomeCard';
import { usePageTitle } from '../hooks/usePageTitle';
import { usePrefData, useKaigoPrefData } from '../hooks/useMedical';
import { PREFECTURES } from '../data/nav';
import { PREF_CODES, KIND_LABEL, DATA_SOURCE_NAME } from '../data/medical';
import { KAIGO_TYPE_LABEL, KAIGO_SOURCE_NAME } from '../data/kaigo';
import { PREF_CENTERS } from '../data/prefCenters';
import { PREF_NAME_BY_CODE } from '../data/stations';
import { getLastPref, setLastPref } from '../lib/lastPref';
import { distanceKm, formatKm } from '../lib/distance';

// 「マップから探す」。県（または現在地）を選ぶと、その地図が開き、表示している範囲の病院・施設が、ピンで出る。
// ピンを押すと、地図の下に、その施設のカードが出る。?t=kaigo で、老人ホーム・介護施設。現在地は、この端末の中だけで使う。
const MAX_PINS = 120; // これより多いときは、地図の中心に近い順に、この数だけピンを出す（地図が重くならないように）
const LIST_SIZE = 20;

const nearestPref = (lat, lng) => {
  let best = null;
  Object.entries(PREF_CENTERS).forEach(([code, [la, ln]]) => {
    const d = distanceKm({ lat, lng }, { lat: la, lng: ln });
    if (!best || d < best.d) best = { code, d };
  });
  return best ? PREF_NAME_BY_CODE[best.code] : '';
};

const viewOfPref = (pref) => {
  const c = PREF_CENTERS[PREF_CODES[pref]];
  return c ? { lat: c[0], lng: c[1], zoom: 13, key: `pref:${pref}` } : { lat: 36.5, lng: 138, zoom: 6, key: 'japan' };
};

const Toggle = ({ on, children, ...props }) => (
  <Link {...props} aria-current={on ? 'page' : undefined} className={`flex-1 text-center min-h-[48px] grid place-items-center rounded-full font-round font-bold border-2 border-gold-deep transition-colors ${on ? 'bg-gold-deep text-white' : 'bg-white text-gold-deep hover:bg-cream-50'}`}>{children}</Link>
);

export const MapSearchPage = () => {
  const [sp] = useSearchParams();
  const kaigo = sp.get('t') === 'kaigo';
  usePageTitle(kaigo ? 'マップから探す（老人ホーム・介護施設）' : 'マップから探す（病院・診療所）');

  const [pref, setPref] = useState(() => (PREF_CODES[getLastPref()] ? getLastPref() : ''));
  const [view, setView] = useState(() => (pref ? viewOfPref(pref) : { lat: 36.5, lng: 138, zoom: 6, key: 'japan' }));
  const [bounds, setBounds] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  const [here, setHere] = useState(null);
  const [geo, setGeo] = useState('idle');

  const code = PREF_CODES[pref] ?? '';
  const med = usePrefData(kaigo ? '' : code);
  const care = useKaigoPrefData(kaigo ? code : '');
  const data = kaigo ? care : med;
  const all = useMemo(() => (data.items ?? []).filter((f) => Number.isFinite(f.lat) && Number.isFinite(f.lng)), [data.items]);

  const inView = useMemo(() => {
    if (!bounds) return [];
    return all.filter((f) => f.lat <= bounds.north && f.lat >= bounds.south && f.lng <= bounds.east && f.lng >= bounds.west);
  }, [all, bounds]);
  const tooMany = inView.length > MAX_PINS;
  // 地図の中心（現在地を使ったときは、現在地）から近い順
  const sorted = useMemo(() => {
    if (!bounds) return [];
    const from = here ?? { lat: (bounds.north + bounds.south) / 2, lng: (bounds.east + bounds.west) / 2 };
    return inView.map((f) => ({ f, d: distanceKm(from, f) })).sort((a, b) => a.d - b.d);
  }, [inView, bounds, here]);
  const pins = useMemo(() => sorted.slice(0, MAX_PINS).map(({ f }) => f), [sorted]);
  const list = sorted.slice(0, LIST_SIZE);
  const selected = all.find((f) => f.id === selectedId);

  const choosePref = (p) => {
    setPref(p);
    setSelectedId('');
    if (p) { setLastPref(p); setView(viewOfPref(p)); }
  };

  const locate = () => {
    if (!navigator.geolocation) { setGeo('error'); return; }
    setGeo('loading');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const p = nearestPref(coords.latitude, coords.longitude);
        setHere({ lat: coords.latitude, lng: coords.longitude });
        setGeo('ok');
        setPref(p);
        setLastPref(p);
        setSelectedId('');
        setView({ lat: coords.latitude, lng: coords.longitude, zoom: 15, key: `here:${Date.now()}` });
      },
      (err) => setGeo(err.code === 1 ? 'denied' : 'error'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  };

  const onMove = useCallback((b) => setBounds(b), []);
  // 施設を選んだら、カードが見えるところまでスクロールする
  const cardRef = useRef(null);
  useEffect(() => { if (selectedId) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [selectedId]);
  const label = kaigo ? '老人ホーム・介護施設' : '病院・診療所';

  return (
    <>
      <Breadcrumb items={[{ label: '病院・介護施設を探す', to: '/search' }, { label: 'マップから探す' }]} />
      <div className="max-w-content mx-auto px-4 py-8 md:py-12">
        <SectionTitle as="h1">マップから探す</SectionTitle>

        <div className="flex gap-3 max-w-[560px] mx-auto mb-6">
          <Toggle to="/search/map" on={!kaigo}>病院・診療所</Toggle>
          <Toggle to="/search/map?t=kaigo" on={kaigo}>老人ホーム・介護施設</Toggle>
        </div>

        <div className="flex flex-wrap items-end justify-center gap-3 mb-4">
          <label className="text-[0.8rem]">都道府県
            <select value={pref} onChange={(e) => choosePref(e.target.value)} className="block mt-1 h-12 px-3 min-w-[11rem] border border-gold/70 rounded-lg bg-white text-[0.95rem]">
              <option value="">選んでください</option>
              {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <button type="button" onClick={locate} disabled={geo === 'loading'} className="inline-flex items-center gap-2 h-12 px-5 rounded-full border-2 border-[#2A7A73] text-[#2A7A73] font-round font-bold hover:bg-[#EAF5F3]">
            <LocateFixed size={18} aria-hidden="true" />{geo === 'loading' ? '現在地を調べています…' : '現在地の周りを見る'}
          </button>
        </div>
        <p className="text-center text-[0.75rem] text-ink-sub mb-2">現在地は、この端末の中だけで使い、クラミッケには送りません。</p>
        {geo === 'denied' && <p role="alert" className="text-center mb-2 text-[0.85rem] text-accent-red-text font-bold">現在地の利用が許可されていません。ブラウザの設定で、位置情報を許可してください。</p>}
        {geo === 'error' && <p role="alert" className="text-center mb-2 text-[0.85rem] text-accent-red-text font-bold">現在地を調べられませんでした。都道府県を選んでください。</p>}

        <div className="relative mt-4">
          <FacilityMap items={pins} selectedId={selectedId} onSelect={setSelectedId} autoFit={false} view={view} onMove={onMove} cooperative={false} className="h-[420px] md:h-[520px]" />
          <p aria-live="polite" className="absolute left-1/2 -translate-x-1/2 bottom-8 z-10 bg-white/95 rounded-full shadow px-4 py-2 text-[0.85rem] font-bold whitespace-nowrap">
            {!pref ? '都道府県を選ぶか、現在地の周りを見てください'
              : data.loading ? '読み込んでいます…'
                : data.error ? '読み込めませんでした。時間をおいて、お試しください'
                  : tooMany ? `この範囲に${inView.length}件（近い${MAX_PINS}件を表示中）`
                    : `この範囲の${label}：${inView.length}件`}
          </p>
        </div>

        {selected && (
          <section ref={cardRef} aria-label="選んだ施設" className="mt-6 scroll-mt-24">
            <ul>{kaigo ? <NursingHomeCard n={selected} distanceKm={here ? distanceKm(here, selected) : undefined} /> : <HospitalCard h={selected} selected distanceKm={here ? distanceKm(here, selected) : undefined} />}</ul>
          </section>
        )}

        {list.length > 0 && (
          <section aria-labelledby="map-list" className="mt-8">
            <h2 id="map-list" className="text-[1rem] text-gold-deep mb-3">{here ? '現在地から近い順' : '地図の中心から近い順'}（最大{LIST_SIZE}件）</h2>
            <ul className="grid gap-2 md:grid-cols-2">
              {list.map(({ f, d }) => (
                <li key={f.id}>
                  <button type="button" onClick={() => setSelectedId(f.id)} aria-pressed={f.id === selectedId}
                    className={`w-full text-left flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${f.id === selectedId ? 'border-accent-red-text bg-[#FFF1EE]' : 'border-gold/40 bg-white hover:bg-cream-50'}`}>
                    <MapPin size={18} className={`shrink-0 mt-0.5 ${f.id === selectedId ? 'text-accent-red' : 'text-gold-deep'}`} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block font-bold leading-snug">{f.name}</span>
                      <span className="block text-[0.75rem] text-ink-sub">{kaigo ? KAIGO_TYPE_LABEL[f.service] : KIND_LABEL[f.kind]}・{f.address}{here && `・${formatKm(d)}`}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-8 text-[0.75rem] text-ink-sub">出典：{kaigo ? KAIGO_SOURCE_NAME : DATA_SOURCE_NAME}。位置は、公的データの緯度・経度にもとづく目安です。地図：国土地理院。</p>
      </div>
    </>
  );
};
