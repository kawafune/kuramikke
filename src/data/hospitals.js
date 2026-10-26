import { Moon, CalendarDays, UserRound, CircleParking, CreditCard } from 'lucide-react';

// 病院の仮データ（実在しない名称）。公的データ（厚生労働省 医療情報ネット等）を取り込むときの項目に合わせてある。
// 取り込み後は同じ形のデータに差し替える。取得元と取得日は画面に必ず表示する。
// 写真・お知らせ・医師紹介・求人などは公的データに無い。施設からの掲載申込みで追加する部分（docs/shukatsu/data-plan の2段階方針）。
export const DEPARTMENTS = ['内科', '外科', '小児科', '整形外科', '眼科', '皮膚科', '耳鼻咽喉科', '産婦人科'];

export const DATA_SOURCE = { label: '仮データ（実在しません）', fetchedAt: '2026-10-25' };

export const WEEKDAYS = ['月', '火', '水', '木', '金', '土', '日', '祝'];

// 特徴アイコン（原案09）
export const FEATURE_LIST = [
  { key: 'night', label: '夜間診療可', Icon: Moon },
  { key: 'holiday', label: '休日診療可', Icon: CalendarDays },
  { key: 'female', label: '女医', Icon: UserRound },
  { key: 'parking', label: '駐車場', Icon: CircleParking },
  { key: 'card', label: 'カード可', Icon: CreditCard },
];
export const FEATURE_BY_KEY = Object.fromEntries(FEATURE_LIST.map((f) => [f.key, f]));

// schedule：行ごとの時間帯と、月〜祝の診療の有無（1＝診療）
const WEEKDAY_AM_PM = [
  { time: '09:30〜12:30', days: [1, 1, 1, 0, 1, 1, 0, 0] },
  { time: '15:00〜18:00', days: [1, 1, 1, 0, 1, 0, 0, 0] },
];
const ALL_WEEK = [
  { time: '09:00〜13:00', days: [1, 1, 1, 1, 1, 1, 1, 0] },
  { time: '14:00〜19:00', days: [1, 1, 1, 1, 1, 0, 0, 0] },
];
const NO_WED = [
  { time: '10:00〜13:00', days: [1, 1, 0, 1, 1, 1, 0, 0] },
  { time: '15:00〜19:00', days: [1, 1, 0, 1, 1, 0, 0, 0] },
];

export const HOSPITALS = [
  { id: 'h1', name: 'サンプル内科クリニック', prefecture: '東京', address: '東京都渋谷区道玄坂1-0-0', tel: '03-0000-0001', departments: ['内科', '小児科'], stations: ['渋谷駅（徒歩5分）', '神泉駅（徒歩7分）'], schedule: WEEKDAY_AM_PM, holiday: '木・日・祝', features: ['parking', 'card'], updated: '2026-10-25', lat: 35.6595, lng: 139.6995 },
  { id: 'h2', name: 'ひだまり総合病院', prefecture: '東京', address: '東京都渋谷区宇田川町2-0-0', tel: '03-0000-0002', departments: ['内科', '外科', '整形外科'], stations: ['渋谷駅（徒歩8分）'], schedule: ALL_WEEK, holiday: '日・祝', features: ['night', 'holiday', 'parking', 'card'], updated: '2026-10-25', lat: 35.6615, lng: 139.6975 },
  { id: 'h3', name: 'みどり眼科', prefecture: '東京', address: '東京都渋谷区神南1-0-0', tel: '03-0000-0003', departments: ['眼科'], stations: ['渋谷駅（徒歩10分）'], schedule: NO_WED, holiday: '水・日・祝', features: ['female', 'card'], updated: '2026-10-25', lat: 35.6640, lng: 139.7010 },
  { id: 'h4', name: 'さくら皮膚科クリニック', prefecture: '東京', address: '東京都渋谷区桜丘町3-0-0', tel: '03-0000-0004', departments: ['皮膚科'], stations: ['渋谷駅（徒歩3分）'], schedule: WEEKDAY_AM_PM, holiday: '木・日・祝', features: ['female', 'card'], updated: '2026-10-25', lat: 35.6560, lng: 139.7020 },
  { id: 'h5', name: 'あおぞら整形外科', prefecture: '東京', address: '東京都渋谷区円山町4-0-0', tel: '03-0000-0005', departments: ['整形外科', '外科'], stations: ['神泉駅（徒歩4分）'], schedule: ALL_WEEK, holiday: '日・祝', features: ['holiday', 'parking'], updated: '2026-10-25', lat: 35.6575, lng: 139.6945 },
  { id: 'h6', name: 'こもれび小児科', prefecture: '東京', address: '東京都渋谷区松濤5-0-0', tel: '03-0000-0006', departments: ['小児科', '内科'], stations: ['神泉駅（徒歩9分）'], schedule: WEEKDAY_AM_PM, holiday: '土午後・日・祝', features: ['parking'], updated: '2026-10-25', lat: 35.6660, lng: 139.6905 },
  { id: 'h7', name: 'つばさ耳鼻咽喉科', prefecture: '東京', address: '東京都渋谷区道玄坂2-0-0', tel: '03-0000-0007', departments: ['耳鼻咽喉科'], stations: ['渋谷駅（徒歩6分）'], schedule: NO_WED, holiday: '水・日・祝', features: ['card'], updated: '2026-10-25', lat: 35.6585, lng: 139.6965 },
  { id: 'h8', name: 'ことり女性クリニック', prefecture: '東京', address: '東京都渋谷区南平台町6-0-0', tel: '03-0000-0008', departments: ['産婦人科', '内科'], stations: ['渋谷駅（徒歩11分）'], schedule: WEEKDAY_AM_PM, holiday: '木・日・祝', features: ['female', 'card'], updated: '2026-10-25', lat: 35.6535, lng: 139.6985 },
  { id: 'h9', name: 'サンプル中央病院', prefecture: '大阪', address: '大阪府大阪市北区梅田1-0-0', tel: '06-0000-0009', departments: ['内科', '外科', '整形外科'], stations: ['大阪駅（徒歩6分）'], schedule: ALL_WEEK, holiday: '日・祝', features: ['night', 'holiday', 'card'], updated: '2026-10-25', lat: 34.7025, lng: 135.4959 },
  { id: 'h10', name: 'ひまわり内科医院', prefecture: '福岡', address: '福岡県福岡市博多区博多駅前1-0-0', tel: '092-000-0010', departments: ['内科'], stations: ['博多駅（徒歩4分）'], schedule: WEEKDAY_AM_PM, holiday: '木・日・祝', features: ['parking', 'card'], updated: '2026-10-25', lat: 33.5902, lng: 130.4207 },
  { id: 'h11', name: 'あさひ眼科クリニック', prefecture: '愛知', address: '愛知県名古屋市中村区名駅1-0-0', tel: '052-000-0011', departments: ['眼科'], stations: ['名古屋駅（徒歩5分）'], schedule: NO_WED, holiday: '水・日・祝', features: ['female'], updated: '2026-10-25', lat: 35.1709, lng: 136.8815 },
  { id: 'h12', name: 'ほっかい整形外科', prefecture: '北海道', address: '北海道札幌市中央区北1条西1-0-0', tel: '011-000-0012', departments: ['整形外科'], stations: ['札幌駅（徒歩7分）'], schedule: ALL_WEEK, holiday: '日・祝', features: ['parking'], updated: '2026-10-25', lat: 43.0687, lng: 141.3508 },
];

export const HOSPITAL_BY_ID = Object.fromEntries(HOSPITALS.map((h) => [h.id, h]));

// 検索。params：{ q, pref, dept, day（0〜7 ＝ 月〜祝）, slot（0＝午前 / 1＝午後）, features: [key] }
export const searchHospitals = ({ q = '', pref = '', dept = '', day = '', slot = '', features = [] } = {}) => {
  const word = q.trim();
  return HOSPITALS.filter((h) => {
    if (word && !`${h.name}${h.address}${h.departments.join('')}${h.stations.join('')}`.includes(word)) return false;
    if (pref && h.prefecture !== pref) return false;
    if (dept && !h.departments.includes(dept)) return false;
    if (features.some((f) => !h.features.includes(f))) return false;
    if (day !== '') {
      const d = Number(day);
      const rows = slot === '' ? h.schedule : [h.schedule[Number(slot)]];
      if (!rows.some((r) => r && r.days[d])) return false;
    }
    return true;
  });
};
