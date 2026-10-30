import React from 'react';
import { ADS } from '../../data/ads';
import { useSite } from '../../context/siteContext';

// 広告枠（収益源）。data/ads.js に登録された広告があれば、「広告」と明記して出す。
// 登録が無いときは、開発モードでだけ灰色の枠を出す（公開表示では、何も出さない）。
export const AdBanner = ({ className = '', placement = 'any' }) => {
  const { devMode } = useSite();
  const ad = ADS.find((a) => a.placement === placement || a.placement === 'any');

  if (!ad) {
    if (!devMode) return null;
    return (
      <div className={`flex items-center justify-center bg-line text-white font-round tracking-[0.15em] text-[0.85rem] ${className}`} aria-label="広告">
        広告バナーエリア（{placement}）
      </div>
    );
  }
  return (
    <aside aria-label="広告" className="text-center">
      <p className="text-[0.7rem] text-ink-sub text-left mb-1">広告{ad.sponsor && `：${ad.sponsor}`}</p>
      <a href={ad.href} target="_blank" rel="sponsored nofollow noopener noreferrer" className="inline-block max-w-full">
        <img src={ad.imageSrc} alt={ad.alt} className="max-w-full h-auto mx-auto" loading="lazy" />
      </a>
      {ad.pixel && <img src={ad.pixel} alt="" width="1" height="1" className="inline-block" />}
      {ad.note && <p className="mt-1 text-[0.75rem] text-ink-sub">{ad.note}</p>}
    </aside>
  );
};
