import React, { useEffect, useRef } from 'react';

// 病院・老人ホームで共用する地図部品。本物の地図（Leaflet＋国土地理院の地図タイル）。
// 国土地理院の「淡色地図」：無料・キー不要。色を抑えた地図に、サイトの色味（クリーム）を少し重ねている（index.css の .kura-map）。出典の表示が必要（下の ATTRIBUTION）。アクセスが増えたら、タイルの提供元の変更を検討する。
//   items: [{ id, name, lat, lng }]、selectedId、onSelect(id)
const TILE_URL = 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png';
const ATTRIBUTION = '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer">地理院タイル</a>（国土地理院）';

// ピン（色は、選択中＝赤、ほか＝ゴールド）
const pinHtml = (selected) => {
  const size = selected ? 40 : 32;
  const fill = selected ? '#E44D32' : '#8A6D0B';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="#fff" stroke-width="1.4" aria-hidden="true" style="filter:drop-shadow(0 1px 1px rgba(0,0,0,.35))"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.6" fill="#fff" stroke="none"/></svg>`;
};

const valid = (i) => Number.isFinite(i.lat) && Number.isFinite(i.lng);

export const FacilityMap = ({ items, selectedId, onSelect, className = '' }) => {
  const elRef = useRef(null);
  const state = useRef(null); // { L, map, layer }
  const latest = useRef({ items, selectedId, onSelect });
  const fitted = useRef('');

  // 最新の入力で、ピンを描き直す（地図の準備ができていれば）
  const draw = () => {
    const s = state.current;
    if (!s) return;
    const { items: list, selectedId: sel, onSelect: pick } = latest.current;
    const pts = list.filter(valid);
    s.layer.clearLayers();
    pts.forEach((it) => {
      const selected = it.id === sel;
      const size = selected ? 40 : 32;
      const marker = s.L.marker([it.lat, it.lng], {
        icon: s.L.divIcon({ className: '', html: pinHtml(selected), iconSize: [size, size], iconAnchor: [size / 2, size] }),
        keyboard: true,
        title: it.name,
        zIndexOffset: selected ? 1000 : 0,
      });
      const tip = document.createElement('span');
      tip.textContent = it.name;
      marker.bindTooltip(tip, { direction: 'top', offset: [0, -size + 6] });
      if (pick) marker.on('click', () => pick(it.id));
      marker.addTo(s.layer);
    });
    // 表示する施設が変わったときだけ、範囲を合わせる（ピンを選ぶたびに、地図が動かないように）
    const key = pts.map((p) => p.id).join(',');
    if (key !== fitted.current && pts.length) {
      fitted.current = key;
      if (pts.length === 1) s.map.setView([pts[0].lat, pts[0].lng], 16);
      else s.map.fitBounds(s.L.latLngBounds(pts.map((p) => [p.lat, p.lng])), { padding: [32, 32], maxZoom: 16 });
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [mod] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]);
      if (cancelled || !elRef.current || state.current) return;
      const L = mod.default ?? mod;
      const map = L.map(elRef.current, { scrollWheelZoom: false, zoomControl: true }).setView([35.68, 139.76], 12);
      map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">Leaflet</a>');
      L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 18, minZoom: 5 }).addTo(map);
      state.current = { L, map, layer: L.layerGroup().addTo(map) };
      draw();
    })();
    return () => {
      cancelled = true;
      if (state.current) { state.current.map.remove(); state.current = null; fitted.current = ''; }
    };
  }, []);

  useEffect(() => {
    latest.current = { items, selectedId, onSelect };
    draw();
  }, [items, selectedId, onSelect]);

  return (
    <div className={`kura-map relative overflow-hidden border border-gold/50 rounded-2xl bg-cream-50 ${className}`}>
      <div ref={elRef} className="absolute inset-0" role="region" aria-label="地図" />
    </div>
  );
};
