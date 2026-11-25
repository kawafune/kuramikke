// 区ごとの一覧ページを作る地域（第1段階：東京の数区）。ここに足すと、一覧ページ・サイトマップ・事前生成のHTMLが、自動で増える。
// 段階：①数区で試す（いま） → ②東京23区 → ③全国。広げる前に、Search Console で、登録数の伸びを確認する（docs/todo.md）。
// slug は、URLに使う（/area/setagaya）。pref・city は、公的データの表記（public/data/medical/13.json など）と同じにする。
export const AREAS = [
  // consult：その区の公式サイトの、高齢者の相談窓口（地域包括支援センター）の一覧ページ。区の公式サイトのURL（2026-11-25 に検索で確認）。
  // 区が組み替えるとリンク切れになるので、年1回、開いて確かめる（docs/todo.md）。
  { slug: 'setagaya', pref: '東京', prefCode: '13', city: '世田谷区',
    consult: { name: 'あんしんすこやかセンター（地域包括支援センター）', url: 'https://www.city.setagaya.lg.jp/02087/2429.html', note: '区内の各地域に置かれた、高齢者とご家族の身近な相談窓口です。担当する地域は、一覧で確かめられます。' } },
  { slug: 'suginami', pref: '東京', prefCode: '13', city: '杉並区',
    consult: { name: '高齢者総合相談窓口 ケア24（地域包括支援センター）', url: 'https://www.city.suginami.tokyo.jp/s039/1205.html', note: '区内20か所にある、高齢者の総合相談窓口です。担当する地域ごとの、連絡先を確かめられます。' } },
  { slug: 'nakano', pref: '東京', prefCode: '13', city: '中野区',
    consult: { name: '地域包括支援センター（担当区域一覧）', url: 'https://www.city.tokyo-nakano.lg.jp/kenko_hukushi/kourei/sodan/chikihokatsushien/tantokuiki.html', note: '住んでいる地域によって、担当のセンターが決まっています。担当区域の一覧で、確かめられます。' } },
];

export const AREA_BY_SLUG = Object.fromEntries(AREAS.map((a) => [a.slug, a]));
export const areaOfCity = (pref, city) => AREAS.find((a) => a.pref === pref && a.city === city) ?? null;
