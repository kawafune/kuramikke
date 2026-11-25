// 区ごとの一覧ページを作る地域（第1段階：東京の数区）。ここに足すと、一覧ページ・サイトマップ・事前生成のHTMLが、自動で増える。
// 段階：①数区で試す（いま） → ②東京23区 → ③全国。広げる前に、Search Console で、登録数の伸びを確認する（docs/todo.md）。
// slug は、URLに使う（/area/setagaya）。pref・city は、公的データの表記（public/data/medical/13.json など）と同じにする。
export const AREAS = [
  { slug: 'setagaya', pref: '東京', prefCode: '13', city: '世田谷区' },
  { slug: 'suginami', pref: '東京', prefCode: '13', city: '杉並区' },
  { slug: 'nakano', pref: '東京', prefCode: '13', city: '中野区' },
];

export const AREA_BY_SLUG = Object.fromEntries(AREAS.map((a) => [a.slug, a]));
export const areaOfCity = (pref, city) => AREAS.find((a) => a.pref === pref && a.city === city) ?? null;
