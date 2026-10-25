import React from 'react';

// 広告枠（収益源）。中身が決まるまではグレーの枠だけ出す
export const AdBanner = ({ className = '' }) => (
  <div
    className={`flex items-center justify-center bg-line text-white font-round tracking-[0.15em] text-[0.85rem] ${className}`}
    aria-label="広告"
  >
    広告バナーエリア
  </div>
);
