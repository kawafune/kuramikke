import React, { useEffect, useRef } from 'react';

// 病院・老人ホームで共用する地図部品。
// ふだんは「ベクトル地図」（MapLibre＋国土地理院の最適化ベクトルタイル）。文字はゴシック体、色はサイトに合わせたスタイル（public/map/kura-style.json）。
// ベクトル地図が使えない端末や、読み込みに失敗したときは、「画像の地図」（Leaflet＋国土地理院の淡色地図）に切り替える。
// どちらも無料・キー不要。出典（国土地理院）の表示が必要。アクセスが増えたら、地図の提供元の変更を検討する。
//
// props：
//   items: [{ id, name, lat, lng }]、selectedId、onSelect(id)
//   autoFit（初期値 true）：表示する施設が変わったら、全部が入るように地図を合わせる
//   view: { lat, lng, zoom, key }：key が変わったら、その場所へ動かす（「マップから探す」で、県や現在地へ動かすとき）
//   onMove({ north, south, east, west })：地図を動かしたあとに呼ぶ（表示範囲の施設を出すため）
//   cooperative（初期値 true）：ページのスクロールを妨げないよう、スクロール拡大は Ctrl＋スクロール、スマホは2本指で動かす
const STYLE_URL = '/map/kura-style.json';
const RASTER_URL = 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png';
const RASTER_ATTRIBUTION = '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer">地理院タイル</a>（国土地理院）';
const DEFAULT_VIEW = { lat: 35.68, lng: 139.76, zoom: 12 };

// ピン（色は、選択中＝赤、ほか＝ゴールド）
const pinSvg = (selected) => {
  const size = selected ? 40 : 32;
  const fill = selected ? '#E44D32' : '#8A6D0B';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="#fff" stroke-width="1.4" aria-hidden="true" style="display:block;filter:drop-shadow(0 1px 1px rgba(0,0,0,.35))"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.6" fill="#fff" stroke="none"/></svg>`;
};

const valid = (i) => Number.isFinite(i.lat) && Number.isFinite(i.lng);

// ---- ベクトル地図（MapLibre） ----
let pmtilesReady = null;
const createVectorMap = async (el, { cooperative, view }) => {
  const [mod, pm] = await Promise.all([import('maplibre-gl'), import('pmtiles'), import('maplibre-gl/dist/maplibre-gl.css')]);
  const maplibregl = mod.default ?? mod;
  if (!pmtilesReady) {
    const protocol = new pm.Protocol();
    maplibregl.addProtocol('pmtiles', protocol.tile);
    pmtilesReady = true;
  }
  const map = new maplibregl.Map({
    container: el,
    style: STYLE_URL,
    center: [view.lng, view.lat],
    zoom: view.zoom - 1, // ベクトル地図は、同じ数字でも1段階大きく見えるため
    minZoom: 4,
    maxZoom: 17.5,
    attributionControl: { compact: false },
    cooperativeGestures: cooperative,
    locale: {
      'CooperativeGesturesHandler.WindowsHelpText': 'Ctrl キーを押しながらスクロールすると、拡大・縮小できます',
      'CooperativeGesturesHandler.MacHelpText': '⌘ キーを押しながらスクロールすると、拡大・縮小できます',
      'CooperativeGesturesHandler.MobileHelpText': '2本の指で、地図を動かせます',
      'NavigationControl.ZoomIn': '拡大',
      'NavigationControl.ZoomOut': '縮小',
    },
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
  // スタイルの読み込みに失敗したら（10秒以内に読めない場合も）、画像の地図に切り替える
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), 10000);
    let ok = false;
    map.once('style.load', () => { ok = true; clearTimeout(timer); resolve(); });
    // スタイル（設定ファイル）そのものの失敗だけを見る。地図の一部の読み込み失敗では、切り替えない
    map.on('error', (e) => { if (!ok && !e.sourceId) { clearTimeout(timer); reject(e.error ?? e); } });
  }).catch((e) => { map.remove(); throw e; });

  let markers = [];
  return {
    setMarkers(pts, sel, pick) {
      markers.forEach((m) => m.remove());
      markers = pts.map((it) => {
        const selected = it.id === sel;
        const node = document.createElement('button');
        node.type = 'button';
        node.className = 'kura-pin';
        node.style.zIndex = selected ? '2' : '1';
        node.innerHTML = pinSvg(selected);
        node.title = it.name;
        if (pick) node.addEventListener('click', (ev) => { ev.stopPropagation(); pick(it.id); });
        const marker = new maplibregl.Marker({ element: node, anchor: 'bottom' }).setLngLat([it.lng, it.lat]).addTo(map);
        node.setAttribute('aria-label', `${it.name}を選ぶ`); // MapLibre が付ける英語の名前を、上書きする
        return marker;
      });
    },
    fitTo(pts) {
      if (pts.length === 1) map.jumpTo({ center: [pts[0].lng, pts[0].lat], zoom: 15 });
      else {
        const b = new maplibregl.LngLatBounds();
        pts.forEach((p) => b.extend([p.lng, p.lat]));
        map.fitBounds(b, { padding: 40, maxZoom: 15, duration: 0 });
      }
    },
    moveTo(v) { map.flyTo({ center: [v.lng, v.lat], zoom: v.zoom - 1, duration: 600 }); },
    onMove(cb) {
      const fire = () => { const b = map.getBounds(); cb({ north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() }); };
      map.on('moveend', fire);
      fire();
    },
    remove() { map.remove(); },
  };
};

// ---- 画像の地図（Leaflet。予備） ----
const createRasterMap = async (el, { cooperative, view }) => {
  const [mod] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]);
  const L = mod.default ?? mod;
  const map = L.map(el, { scrollWheelZoom: !cooperative, zoomControl: true }).setView([view.lat, view.lng], view.zoom);
  map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">Leaflet</a>');
  L.tileLayer(RASTER_URL, { attribution: RASTER_ATTRIBUTION, maxZoom: 18, minZoom: 5 }).addTo(map);
  el.classList.add('kura-map-raster');
  const layer = L.layerGroup().addTo(map);
  return {
    setMarkers(pts, sel, pick) {
      layer.clearLayers();
      pts.forEach((it) => {
        const selected = it.id === sel;
        const size = selected ? 40 : 32;
        const marker = L.marker([it.lat, it.lng], {
          icon: L.divIcon({ className: '', html: pinSvg(selected), iconSize: [size, size], iconAnchor: [size / 2, size] }),
          keyboard: true, title: it.name, zIndexOffset: selected ? 1000 : 0,
        });
        if (pick) marker.on('click', () => pick(it.id));
        marker.addTo(layer);
      });
    },
    fitTo(pts) {
      if (pts.length === 1) map.setView([pts[0].lat, pts[0].lng], 16);
      else map.fitBounds(L.latLngBounds(pts.map((p) => [p.lat, p.lng])), { padding: [32, 32], maxZoom: 16 });
    },
    moveTo(v) { map.flyTo([v.lat, v.lng], v.zoom, { duration: 0.6 }); },
    onMove(cb) {
      const fire = () => { const b = map.getBounds(); cb({ north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() }); };
      map.on('moveend', fire);
      fire();
    },
    remove() { map.remove(); },
  };
};

export const FacilityMap = ({ items, selectedId, onSelect, className = '', autoFit = true, view, onMove, cooperative = true }) => {
  const elRef = useRef(null);
  const api = useRef(null);
  const latest = useRef({ items, selectedId, onSelect, autoFit, onMove });
  const fitted = useRef('');
  const viewKey = useRef(view?.key);

  // 最新の入力で、ピンを描き直す（地図の準備ができていれば）
  const draw = () => {
    const m = api.current;
    if (!m) return;
    const { items: list, selectedId: sel, onSelect: pick, autoFit: fit } = latest.current;
    const pts = list.filter(valid);
    m.setMarkers(pts, sel, pick);
    // 表示する施設が変わったときだけ、範囲を合わせる（ピンを選ぶたびに、地図が動かないように）
    const key = pts.map((p) => p.id).join(',');
    if (fit && key !== fitted.current && pts.length) {
      fitted.current = key;
      m.fitTo(pts);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const el = elRef.current;
    const opts = { cooperative, view: view ?? DEFAULT_VIEW };
    (async () => {
      let m;
      try {
        m = await createVectorMap(el, opts);
      } catch (e) {
        console.warn('[map] ベクトル地図を使えないため、画像の地図に切り替えます', e);
        if (cancelled) return;
        el.innerHTML = '';
        m = await createRasterMap(el, opts);
      }
      if (cancelled) { m.remove(); return; }
      api.current = m;
      m.onMove((b) => latest.current.onMove?.(b));
      draw();
    })();
    return () => {
      cancelled = true;
      if (api.current) { api.current.remove(); api.current = null; fitted.current = ''; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 地図は1回だけ作る（入力の変化は、下の2つで反映する）

  useEffect(() => {
    latest.current = { items, selectedId, onSelect, autoFit, onMove };
    draw();
  }, [items, selectedId, onSelect, autoFit, onMove]);

  useEffect(() => {
    if (!view || view.key === viewKey.current) return;
    viewKey.current = view.key;
    api.current?.moveTo(view);
  }, [view]);

  return (
    <div className={`kura-map relative overflow-hidden border border-gold/50 rounded-2xl bg-cream-50 ${className}`}>
      <div ref={elRef} className="w-full h-full" role="region" aria-label="地図" />
    </div>
  );
};
