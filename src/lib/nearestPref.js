// 緯度・経度から、いちばん近い都道府県（名前）を返す。県の中心は、医療機関の位置の中央値（data/prefCenters.js）。
import { PREF_CENTERS } from '../data/prefCenters';
import { PREF_NAME_BY_CODE } from '../data/stations';
import { distanceKm } from './distance';

export const nearestPref = (lat, lng) => {
  let best = null;
  Object.entries(PREF_CENTERS).forEach(([code, [la, ln]]) => {
    const d = distanceKm({ lat, lng }, { lat: la, lng: ln });
    if (!best || d < best.d) best = { code, d };
  });
  return best ? PREF_NAME_BY_CODE[best.code] : '';
};
