// 2点（緯度・経度）の距離を、km で返す（ハーバーサイン式）。現在地は、この端末の中だけで使い、サーバーには送らない
const toRad = (d) => (d * Math.PI) / 180;

export const distanceKm = (a, b) => {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
};

export const formatKm = (km) => (km < 1 ? `約${Math.max(1, Math.round(km * 10) * 100)}m` : `約${km.toFixed(1)}km`);
