import React from 'react';
import { MapPin } from 'lucide-react';

// 病院・老人ホームで共用する地図部品。いまは仮の地図（イメージ）。
// 本物の地図（「ちぃくり」のマップ機能など）に差し替えるときも、props は変えない：
//   items: [{ id, name, lat, lng }]、selectedId、onSelect(id)
const bounds = (items) => {
  const lats = items.map((i) => i.lat);
  const lngs = items.map((i) => i.lng);
  const pad = 0.002;
  return { minLat: Math.min(...lats) - pad, maxLat: Math.max(...lats) + pad, minLng: Math.min(...lngs) - pad, maxLng: Math.max(...lngs) + pad };
};

export const FacilityMap = ({ items, selectedId, onSelect, className = '' }) => {
  const b = items.length ? bounds(items) : null;
  const pos = (i) => ({
    left: `${((i.lng - b.minLng) / (b.maxLng - b.minLng || 1)) * 84 + 8}%`,
    top: `${(1 - (i.lat - b.minLat) / (b.maxLat - b.minLat || 1)) * 76 + 10}%`,
  });

  return (
    <div className={`relative overflow-hidden border border-gold bg-[#EEF3E6] ${className}`}>
      {/* 地図のイメージ（道路・川・公園） */}
      <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <rect width="400" height="300" fill="#EEF3E6" />
        <path d="M0 230 Q120 190 220 235 T400 205 L400 300 L0 300Z" fill="#CFE6EE" />
        <rect x="255" y="40" width="95" height="70" rx="10" fill="#CFE3B5" />
        <g stroke="#FFFFFF" strokeWidth="9" fill="none">
          <path d="M-10 120 L410 95" /><path d="M150 -10 L190 310" /><path d="M300 -10 L270 310" />
        </g>
        <g stroke="#FFFFFF" strokeWidth="4" fill="none">
          <path d="M-10 60 L410 50" /><path d="M-10 180 L410 165" /><path d="M60 -10 L80 310" /><path d="M360 -10 L350 310" />
        </g>
      </svg>

      {items.map((item) => {
        const selected = item.id === selectedId;
        return (
          <button
            key={item.id}
            onClick={() => onSelect?.(item.id)}
            style={pos(item)}
            aria-label={`${item.name}を選ぶ`}
            aria-pressed={selected}
            className={`absolute -translate-x-1/2 -translate-y-full w-11 h-11 flex items-end justify-center ${selected ? 'z-10' : ''}`}
          >
            <MapPin
              size={selected ? 38 : 30}
              strokeWidth={1.8}
              className={selected ? 'text-accent-red fill-accent-red/30' : 'text-gold-deep fill-gold/40'}
            />
          </button>
        );
      })}

      <p className="absolute left-2 bottom-2 bg-white/90 text-[0.7rem] px-2 py-0.5">地図はイメージです（仮）</p>
    </div>
  );
};
