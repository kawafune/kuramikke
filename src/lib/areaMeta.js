// 区ごとの一覧ページ・施設ページの、題名（title）・説明文（description）・並び順・ページ分け。
// 画面（React）と、事前生成のHTML（scripts/prerender_static.mjs）の両方で使う。外部の部品に頼らない、純粋な関数だけを置く。
export const PAGE_SIZE = 50;

export const KINDS = {
  hospitals: { label: '病院・診療所', sourceLabel: '病院・診療所' },
  nursing: { label: '老人ホーム・介護施設', sourceLabel: '老人ホーム・介護施設' },
};

export const SOURCE_TEXT = {
  hospitals: '厚生労働省「医療情報ネット（ナビイ）」のオープンデータ（2025年6月1日時点）',
  nursing: '厚生労働省「介護サービス情報公表システム」のオープンデータ（2026年6月末時点）',
};

export const pageCount = (total) => Math.max(1, Math.ceil(total / PAGE_SIZE));
export const slicePage = (items, page) => items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
export const sortByKana = (items) => [...items].sort((a, b) => (a.kana ?? a.name).localeCompare(b.kana ?? b.name, 'ja') || a.id.localeCompare(b.id));

// 一覧ページのURL（1ページ目は、ページ番号なし）
export const listPath = (slug, kind, page = 1) => `/area/${slug}/${kind}${page > 1 ? `/${page}` : ''}`;

export const hubMeta = (city, counts) => ({
  title: `${city}の病院・診療所・老人ホーム・介護施設を探す`,
  description: `${city}の病院・診療所${counts.hospitals.toLocaleString()}件、老人ホーム・介護施設${counts.nursing.toLocaleString()}件の一覧。住所・診療科・診療時間などを、厚生労働省の公的データにもとづいて掲載しています。`,
});

export const listMeta = (city, kind, total, page) => {
  const label = KINDS[kind].label;
  const pageText = page > 1 ? `（${page}ページ目）` : '';
  const what = kind === 'hospitals' ? '診療科・住所から探して、診療時間・休診日・今日の診療状況を確認できます。' : '施設の種類・住所・運営法人・定員などを、一覧で確認できます。';
  return {
    title: page > 1 ? `${city}の${label}一覧${pageText}` : `${city}の${label}一覧（${total.toLocaleString()}件）`,
    description: `${city}の${label}${total.toLocaleString()}件の一覧${pageText}。${what}公的データにもとづく情報です。`,
  };
};

export const hospitalMeta = (h) => ({
  title: `${h.name}（${h.city}）｜診療科・診療時間・休診日`,
  description: `${h.name}（${h.address}）の診療科（${h.departments.slice(0, 5).join('・')}${h.departments.length > 5 ? 'ほか' : ''}）、診療時間、休診日の情報。公的データにもとづいて掲載しています。受診の前に、医療機関へご確認ください。`,
});

export const nursingMeta = (n, typeLabel) => ({
  title: `${n.name}（${n.city}）｜${typeLabel}`,
  description: `${n.name}（${n.address}）の${typeLabel}。所在地・電話番号・運営法人などの情報を、公的データにもとづいて掲載しています。費用などは、施設へご確認ください。`,
});
