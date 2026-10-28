// 医療機関（病院・診療所）の実データ。厚生労働省「医療情報ネット（ナビイ）」のオープンデータを、
// scripts/import_medical.py で、都道府県ごとのJSON（public/data/medical/NN.json）にしたものを読み込む。
// 見る県のファイルだけを、そのときに読み込む（全国で約48MB。1県は、圧縮されて数百KB〜1MB台）。
import { Moon, CalendarDays } from 'lucide-react';

export const PREF_CODES = {
  北海道: '01', 青森: '02', 岩手: '03', 宮城: '04', 秋田: '05', 山形: '06', 福島: '07', 茨城: '08', 栃木: '09', 群馬: '10',
  埼玉: '11', 千葉: '12', 東京: '13', 神奈川: '14', 新潟: '15', 富山: '16', 石川: '17', 福井: '18', 山梨: '19', 長野: '20',
  岐阜: '21', 静岡: '22', 愛知: '23', 三重: '24', 滋賀: '25', 京都: '26', 大阪: '27', 兵庫: '28', 奈良: '29', 和歌山: '30',
  鳥取: '31', 島根: '32', 岡山: '33', 広島: '34', 山口: '35', 徳島: '36', 香川: '37', 愛媛: '38', 高知: '39', 福岡: '40',
  佐賀: '41', 長崎: '42', 熊本: '43', 大分: '44', 宮崎: '45', 鹿児島: '46', 沖縄: '47',
};

export const WEEKDAYS = ['月', '火', '水', '木', '金', '土', '日', '祝'];

// 診療科目の選択肢（全部で約1,100種あるため、多いものだけ。ほかはキーワードで探せる）
export const DEPARTMENTS = [
  '内科', '小児科', '整形外科', '外科', '皮膚科', '眼科', '耳鼻いんこう科', '泌尿器科', '産婦人科', '精神科', '心療内科',
  '消化器内科', '循環器内科', '呼吸器内科', '糖尿病内科', '脳神経外科', 'リハビリテーション科', '放射線科', '形成外科', 'アレルギー科',
];

export const KINDS = [{ key: 'hospital', label: '病院' }, { key: 'clinic', label: '診療所（クリニック）' }];
export const KIND_LABEL = { hospital: '病院', clinic: '診療所' };

// 特徴アイコン。公的データから、計算で分かるものだけ（駐車場・カード・女医などは、データに無い）
export const FEATURE_LIST = [
  { key: 'night', label: '夜間も受付（19時以降）', Icon: Moon },
  { key: 'holiday', label: '日曜・祝日も受付', Icon: CalendarDays },
];
export const FEATURE_BY_KEY = Object.fromEntries(FEATURE_LIST.map((f) => [f.key, f]));

const toMin = (hhmm) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

// 休診日の文（毎週の診療日の列から作る。値は「診療あり＝1」と推定【要確認】）
const holidayText = (f) => {
  const names = ['月', '火', '水', '木', '金', '土', '日'];
  const closed = names.filter((_, i) => f.openDays[i] === 0);
  const parts = [];
  if (closed.length) parts.push(`毎週 ${closed.join('・')}曜日`);
  if (f.holidayOpen === 0) parts.push('祝日');
  if (f.otherClosed) parts.push(f.otherClosed.replace(/，/g, '、'));
  return parts.length ? parts.join('／') : '公式サイトでご確認ください';
};

const derive = (f, asOf) => {
  const features = [];
  if (f.schedule.some((r) => toMin(r.time.slice(6)) >= 19 * 60 && r.days.some(Boolean))) features.push('night');
  if (f.schedule.some((r) => r.days[6] || r.days[7])) features.push('holiday');
  return { ...f, holiday: holidayText(f), features, updated: asOf };
};

// ---- 読み込み（同じ県は、1回だけ取得して使い回す）
let indexPromise = null;
const prefPromises = new Map();

const fetchJson = (url) => fetch(url).then((r) => {
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.json();
});

export const loadIndex = () => {
  if (!indexPromise) indexPromise = fetchJson('/data/medical/index.json').catch((e) => { indexPromise = null; throw e; });
  return indexPromise;
};

export const loadPref = (code) => {
  if (!prefPromises.has(code)) {
    prefPromises.set(code, Promise.all([loadIndex(), fetchJson(`/data/medical/${code}.json`)])
      .then(([index, items]) => items.map((f) => derive(f, index.asOf)))
      .catch((e) => { prefPromises.delete(code); throw e; }));
  }
  return prefPromises.get(code);
};

// IDの先頭2桁が、都道府県コード
export const prefCodeOfId = (id) => id.slice(0, 2);

export const asOfLabel = (asOf) => {
  const [y, m, d] = asOf.split('-').map(Number);
  return `${y}年${m}月${d}日`;
};
// データの基準日（public/data/medical/index.json の asOf と同じ。取り込み直したら、両方を直す）
export const DATA_ASOF = '2025-06-01';
export const DATA_SOURCE_NAME = '厚生労働省 医療情報ネット（ナビイ） オープンデータ';

// 検索。params：{ q, dept, kind, day（0〜7）, slot（0＝午前 / 1＝午後）, features: [key] }。items は、1県分
const norm = (s) => s.normalize('NFKC');
export const searchFacilities = (items, { q = '', dept = '', kind = '', day = '', slot = '', features = [] } = {}) => {
  const words = norm(q).split(/\s+/).filter(Boolean);
  return items.filter((f) => {
    if (kind && f.kind !== kind) return false;
    if (dept && !f.departments.includes(dept)) return false;
    if (features.some((k) => !f.features.includes(k))) return false;
    if (words.length) {
      const text = `${f.name}${f.kana}${f.address}${f.departments.join('')}`;
      if (!words.every((w) => text.includes(w))) return false;
    }
    if (day !== '') {
      const d = Number(day);
      // 午前＝12時より前に始まる時間帯 / 午後＝13時より後に終わる時間帯
      const inSlot = (r) => (Number(slot) === 0 ? toMin(r.time.slice(0, 5)) < 12 * 60 : toMin(r.time.slice(6)) > 13 * 60);
      const rows = slot === '' ? f.schedule : f.schedule.filter(inSlot);
      if (!rows.some((r) => r.days[d])) return false;
    }
    return true;
  });
};
