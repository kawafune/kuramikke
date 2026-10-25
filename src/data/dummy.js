// 原案に載っていたダミーの内容（本番データに差し替えるまでの仮置き）
export const COLUMNS = [
  { id: 1, category: '終活', date: '2026.04.01', title: 'エンディングノートをつけてやり残さないという選択。' },
  { id: 2, category: 'Life', date: '2026.04.01', title: '1輪刺しで魅せる「花のある生活」。空間に彩を。' },
  { id: 3, category: '食', date: '2026.04.01', title: 'お弁当を持ってお花見を。プチピクニック' },
  { id: 4, category: 'お金', date: '2026.04.01', title: '記事タイトルが入ります。このコピーはダミーです。' },
  { id: 5, category: '趣味', date: '2026.04.01', title: '記事タイトルが入ります。このコピーはダミーです。' },
];

const TAG_SETS = [
  ['おすすめ', 'セミナー', '参加無料', 'お土産付'],
  ['おすすめ', '体験型', 'バスハイク', 'お土産付'],
  ['おすすめ', 'ドリンク付', '食事付', '人気企画'],
  ['おすすめ', 'セミナー', '参加無料', '人気企画'],
];

export const EVENTS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: 'コミュニティイベント名が入ります。',
  date: '04/01',
  place: '東京都渋谷区道玄坂',
  joined: 4,
  capacity: 30,
  tags: TAG_SETS[i % TAG_SETS.length],
}));
