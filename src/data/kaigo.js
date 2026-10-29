// 老人ホームなどの介護施設の実データ。厚生労働省「介護サービス情報公表システム」のオープンデータを、
// scripts/import_kaigo.py で、都道府県ごとのJSON（public/data/kaigo/NN.json）にしたものを読み込む。
// 費用（入居一時金・月額）や空き状況は、このデータには入っていない。住宅型有料老人ホーム・一般のサ高住も入っていない。
import { PREF_CODES } from './medical';

export { PREF_CODES };

// サービスコード → 画面に出す施設の種類（介護保険の「特定施設入居者生活介護」などの指定を受けた施設）
export const KAIGO_TYPES = [
  { code: '331', label: '介護付き有料老人ホーム' },
  { code: '334', label: 'サービス付き高齢者向け住宅（介護付き）' },
  { code: '332', label: '軽費老人ホーム（ケアハウス）' },
  { code: '320', label: 'グループホーム（認知症の方向け）' },
  { code: '510', label: '特別養護老人ホーム（特養）' },
  { code: '520', label: '介護老人保健施設（老健）' },
];
export const KAIGO_TYPE_LABEL = Object.fromEntries(KAIGO_TYPES.map((t) => [t.code, t.label]));

// 定員の絞り込み
export const CAPACITY_OPTIONS = [
  { key: 'small', label: '小規模（30名まで）', test: (c) => c !== null && c <= 30 },
  { key: 'large', label: '大規模（31名以上）', test: (c) => c !== null && c > 30 },
];

let indexPromise = null;
const prefPromises = new Map();

const fetchJson = (url) => fetch(url).then((r) => {
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.json();
});

export const loadKaigoIndex = () => {
  if (!indexPromise) indexPromise = fetchJson('/data/kaigo/index.json').catch((e) => { indexPromise = null; throw e; });
  return indexPromise;
};

export const loadKaigoPref = (code) => {
  if (!prefPromises.has(code)) {
    prefPromises.set(code, fetchJson(`/data/kaigo/${code}.json`).catch((e) => { prefPromises.delete(code); throw e; }));
  }
  return prefPromises.get(code);
};

// IDは「事業所番号（10桁）－サービスコード」。先頭2桁が、都道府県コード
export const kaigoPrefCodeOfId = (id) => id.slice(0, 2);

export const KAIGO_SOURCE_NAME = '厚生労働省 介護サービス情報公表システム オープンデータ';

const norm = (s) => s.normalize('NFKC');

// 検索。params：{ q, type（サービスコード）, size（small/large）}。items は、1県分
export const searchKaigo = (items, { q = '', type = '', size = '' } = {}) => {
  const words = norm(q).split(/\s+/).filter(Boolean);
  const sizeRule = CAPACITY_OPTIONS.find((o) => o.key === size);
  return items.filter((f) => {
    if (type && f.service !== type) return false;
    if (sizeRule && !sizeRule.test(f.capacity)) return false;
    if (words.length) {
      const text = `${f.name}${f.kana}${f.address}${f.corp ?? ''}`;
      if (!words.every((w) => text.includes(w))) return false;
    }
    return true;
  });
};
