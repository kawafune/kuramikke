import { Stethoscope, HeartHandshake, Brain, BedDouble } from 'lucide-react';

// 老人ホームの仮データ（実在しない名称）。公的データ（介護サービス情報公表システム等）を取り込むときの項目に合わせてある。
// 費用・受け入れ条件・看取りの可否などは、公的データに無いものが多い。施設からの掲載申込みで追加する部分（docs/shukatsu/data-plan の2段階方針）。
export const NURSING_DATA_SOURCE = { label: '仮データ（実在しません）', fetchedAt: '2026-10-28' };

export const NURSING_TYPES = ['介護付き有料老人ホーム', '住宅型有料老人ホーム', 'サービス付き高齢者向け住宅', 'グループホーム'];

// 受け入れ（自立の方／要支援の方／要介護の方）
export const ACCEPTS = ['自立', '要支援', '要介護'];

export const NURSING_FEATURES = [
  { key: 'medical', label: '医療対応', Icon: Stethoscope },
  { key: 'endOfLife', label: '看取り対応', Icon: HeartHandshake },
  { key: 'dementia', label: '認知症対応', Icon: Brain },
  { key: 'trial', label: '体験入居', Icon: BedDouble },
];

// 費用の絞り込み（月額の上限・万円）
export const FEE_LIMITS = [10, 15, 20, 25, 30];

// entryFee・monthlyFee は円。monthlyFee は [最低, 最高]
export const NURSING_HOMES = [
  { id: 'n1', name: 'サンプル ひだまりの家', prefecture: '東京', address: '東京都世田谷区経堂1-0-0', tel: '03-0000-1001', type: '介護付き有料老人ホーム', entryFee: 0, monthlyFee: [210000, 280000], accepts: ['要支援', '要介護'], features: ['medical', 'endOfLife', 'trial'], capacity: 60, opened: 2012, stations: ['経堂駅（徒歩6分）'], updated: '2026-10-28', lat: 35.6485, lng: 139.6360 },
  { id: 'n2', name: 'サンプル さくら苑', prefecture: '東京', address: '東京都杉並区高円寺南2-0-0', tel: '03-0000-1002', type: '住宅型有料老人ホーム', entryFee: 3000000, monthlyFee: [160000, 210000], accepts: ['自立', '要支援', '要介護'], features: ['medical', 'trial'], capacity: 42, opened: 2016, stations: ['高円寺駅（徒歩8分）'], updated: '2026-10-28', lat: 35.7055, lng: 139.6495 },
  { id: 'n3', name: 'サンプル あおぞらハイツ', prefecture: '東京', address: '東京都練馬区石神井町3-0-0', tel: '03-0000-1003', type: 'サービス付き高齢者向け住宅', entryFee: 0, monthlyFee: [120000, 170000], accepts: ['自立', '要支援', '要介護'], features: ['trial'], capacity: 50, opened: 2018, stations: ['石神井公園駅（徒歩10分）'], updated: '2026-10-28', lat: 35.7425, lng: 139.6000 },
  { id: 'n4', name: 'サンプル こもれびグループホーム', prefecture: '東京', address: '東京都町田市原町田4-0-0', tel: '042-000-1004', type: 'グループホーム', entryFee: 500000, monthlyFee: [150000, 190000], accepts: ['要支援', '要介護'], features: ['dementia', 'endOfLife'], capacity: 18, opened: 2010, stations: ['町田駅（徒歩12分）'], updated: '2026-10-28', lat: 35.5420, lng: 139.4450 },
  { id: 'n5', name: 'サンプル 桜台ケアホーム', prefecture: '神奈川', address: '神奈川県横浜市青葉区美しが丘5-0-0', tel: '045-000-1005', type: '介護付き有料老人ホーム', entryFee: 12000000, monthlyFee: [250000, 340000], accepts: ['要支援', '要介護'], features: ['medical', 'endOfLife', 'dementia', 'trial'], capacity: 80, opened: 2008, stations: ['美しが丘駅（徒歩5分）'], updated: '2026-10-28', lat: 35.5690, lng: 139.5560 },
  { id: 'n6', name: 'サンプル なでしこの里', prefecture: '大阪', address: '大阪府大阪市住吉区長居6-0-0', tel: '06-0000-1006', type: '住宅型有料老人ホーム', entryFee: 0, monthlyFee: [140000, 190000], accepts: ['自立', '要支援', '要介護'], features: ['medical', 'endOfLife'], capacity: 36, opened: 2014, stations: ['長居駅（徒歩7分）'], updated: '2026-10-28', lat: 34.6130, lng: 135.5120 },
  { id: 'n7', name: 'サンプル 浪速グループホーム', prefecture: '大阪', address: '大阪府大阪市浪速区日本橋7-0-0', tel: '06-0000-1007', type: 'グループホーム', entryFee: 300000, monthlyFee: [130000, 170000], accepts: ['要支援', '要介護'], features: ['dementia'], capacity: 9, opened: 2011, stations: ['日本橋駅（徒歩4分）'], updated: '2026-10-28', lat: 34.6670, lng: 135.5070 },
  { id: 'n8', name: 'サンプル みなと苑', prefecture: '福岡', address: '福岡県福岡市早良区百道浜8-0-0', tel: '092-000-1008', type: '介護付き有料老人ホーム', entryFee: 4500000, monthlyFee: [190000, 260000], accepts: ['要支援', '要介護'], features: ['medical', 'endOfLife', 'trial'], capacity: 54, opened: 2015, stations: ['西新駅（徒歩9分）'], updated: '2026-10-28', lat: 33.5940, lng: 130.3570 },
  { id: 'n9', name: 'サンプル 名駅サニーハウス', prefecture: '愛知', address: '愛知県名古屋市西区那古野9-0-0', tel: '052-000-1009', type: 'サービス付き高齢者向け住宅', entryFee: 0, monthlyFee: [110000, 160000], accepts: ['自立', '要支援'], features: ['trial'], capacity: 40, opened: 2019, stations: ['名古屋駅（徒歩11分）'], updated: '2026-10-28', lat: 35.1800, lng: 136.8900 },
  { id: 'n10', name: 'サンプル 北のやすらぎ', prefecture: '北海道', address: '北海道札幌市北区北24条10-0-0', tel: '011-000-1010', type: '介護付き有料老人ホーム', entryFee: 0, monthlyFee: [150000, 200000], accepts: ['要支援', '要介護'], features: ['medical', 'dementia', 'endOfLife'], capacity: 70, opened: 2013, stations: ['北24条駅（徒歩3分）'], updated: '2026-10-28', lat: 43.0940, lng: 141.3410 },
];

export const NURSING_BY_ID = Object.fromEntries(NURSING_HOMES.map((n) => [n.id, n]));

export const yen = (n) => (n === 0 ? 'なし' : n >= 10000 ? `${(n / 10000).toLocaleString()}万円` : `${n.toLocaleString()}円`);
export const monthlyRange = ([a, b]) => `${yen(a)}〜${yen(b)}`;

// 検索。params：{ q, pref, type, fee（月額の上限・万円）, accept, features: [key] }
export const searchNursingHomes = ({ q = '', pref = '', type = '', fee = '', accept = '', features = [] } = {}) => {
  const word = q.trim();
  return NURSING_HOMES.filter((n) => {
    if (word && !`${n.name}${n.address}${n.type}${n.stations.join('')}`.includes(word)) return false;
    if (pref && n.prefecture !== pref) return false;
    if (type && n.type !== type) return false;
    if (fee !== '' && n.monthlyFee[0] > Number(fee) * 10000) return false;
    if (accept && !n.accepts.includes(accept)) return false;
    if (features.some((f) => !n.features.includes(f))) return false;
    return true;
  });
};
