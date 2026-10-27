// 日本の祝日（国民の祝日）を、計算で求める。外部のデータは使わない。
// 対象は2022年以降（2020・2021年の東京オリンピックによる特例日は含まない）。
// 法律が変わったときは、ここを直す。年末年始（12/29〜1/3）は祝日ではないが、休む病院が多いので別に判定する。
const pad = (n) => String(n).padStart(2, '0');
const key = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
const utc = (y, m, d) => new Date(Date.UTC(y, m - 1, d));
const keyOf = (dt) => key(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());

// 第n月曜日の日
const nthMonday = (y, m, n) => 1 + ((8 - utc(y, m, 1).getUTCDay()) % 7) + 7 * (n - 1);

const equinox = (y, base) => Math.floor(base + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4));

const cache = new Map();

const holidaysOfYear = (y) => {
  if (cache.has(y)) return cache.get(y);
  const map = new Map();
  const add = (m, d, name) => map.set(key(y, m, d), name);
  add(1, 1, '元日');
  add(1, nthMonday(y, 1, 2), '成人の日');
  add(2, 11, '建国記念の日');
  add(2, 23, '天皇誕生日');
  add(3, equinox(y, 20.8431), '春分の日');
  add(4, 29, '昭和の日');
  add(5, 3, '憲法記念日');
  add(5, 4, 'みどりの日');
  add(5, 5, 'こどもの日');
  add(7, nthMonday(y, 7, 3), '海の日');
  add(8, 11, '山の日');
  add(9, nthMonday(y, 9, 3), '敬老の日');
  add(9, equinox(y, 23.2488), '秋分の日');
  add(10, nthMonday(y, 10, 2), 'スポーツの日');
  add(11, 3, '文化の日');
  add(11, 23, '勤労感謝の日');

  // 国民の休日：祝日にはさまれた平日（日曜でないもの）
  for (let d = utc(y, 1, 2); d.getUTCFullYear() === y; d = new Date(d.getTime() + 86400000)) {
    const prev = keyOf(new Date(d.getTime() - 86400000));
    const next = keyOf(new Date(d.getTime() + 86400000));
    const k = keyOf(d);
    if (!map.has(k) && d.getUTCDay() !== 0 && map.has(prev) && map.has(next)) map.set(k, '国民の休日');
  }
  // 振替休日：祝日が日曜なら、次の祝日でない日（連続する場合は、その先）
  for (const k of [...map.keys()]) {
    const [yy, mm, dd] = k.split('-').map(Number);
    if (utc(yy, mm, dd).getUTCDay() !== 0) continue;
    let d = new Date(utc(yy, mm, dd).getTime() + 86400000);
    while (map.has(keyOf(d))) d = new Date(d.getTime() + 86400000);
    if (d.getUTCFullYear() === y) map.set(keyOf(d), '振替休日');
  }
  cache.set(y, map);
  return map;
};

// '2026-05-06' → '振替休日'（祝日でなければ null）
export const holidayName = (dateStr) => {
  const y = Number(dateStr.slice(0, 4));
  return holidaysOfYear(y).get(dateStr) ?? null;
};

// 年末年始（12/29〜1/3）か。病院は休むところが多い
export const isNewYearBreak = (dateStr) => {
  const md = dateStr.slice(5);
  return md >= '12-29' || md <= '01-03';
};
