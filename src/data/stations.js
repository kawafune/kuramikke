// 駅の一覧。国土交通省「国土数値情報（鉄道データ N02）」を加工して作成（scripts/build_stations.py）。出典の表示が必要（CC BY 4.0）。
// 駅から探す：駅を選ぶと、その駅から指定の距離（直線）以内の、病院・診療所・介護施設を、近い順に出す。
import { PREF_CODES } from './medical';

export const STATION_SOURCE = '国土数値情報（鉄道データ）国土交通省';
export const PREF_NAME_BY_CODE = Object.fromEntries(Object.entries(PREF_CODES).map(([name, code]) => [code, name]));
export const RADIUS_OPTIONS = [1, 1.5, 2, 3]; // km（直線距離）
export const DEFAULT_RADIUS = 1.5;

let stationsPromise = null;
export const loadStations = () => {
  if (!stationsPromise) {
    stationsPromise = fetch('/data/stations.json')
      .then((r) => { if (!r.ok) throw new Error(`stations: ${r.status}`); return r.json(); })
      .catch((e) => { stationsPromise = null; throw e; });
  }
  return stationsPromise;
};

// URLに入れる形：「渋谷_35.65885_139.70171」（駅名＿緯度＿経度）。同じ名前の駅も、座標で区別できる
export const encodeStation = (s) => `${s.n}_${s.a}_${s.o}`;
export const parseStation = (v) => {
  if (!v) return null;
  const m = v.match(/^(.+)_(-?\d+(?:\.\d+)?)_(-?\d+(?:\.\d+)?)$/);
  return m ? { name: m[1], lat: Number(m[2]), lng: Number(m[3]) } : null;
};

// 入力した文字から、駅の候補を探す（前方一致を先に。「駅」は付けても付けなくてもよい）
export const findStations = (stations, input, limit = 8) => {
  const q = input.normalize('NFKC').trim().replace(/駅$/, '');
  if (!q) return [];
  const starts = [];
  const includes = [];
  for (const s of stations) {
    if (s.n.startsWith(q)) starts.push(s);
    else if (s.n.includes(q)) includes.push(s);
    if (starts.length >= limit) break;
  }
  return [...starts, ...includes].slice(0, limit);
};
