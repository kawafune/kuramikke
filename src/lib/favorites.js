// お気に入りの病院。ログイン不要で、この端末のブラウザの中にだけ保存する（サーバーには送らない）。
// 端末を変える・ブラウザの履歴を消すと、消える。複数の端末で使いたい場合は、あとからログインを足す（docs/design/hospital-features-discussion.md）。
const KEY = 'kuramikke_favorites';
const MAX = 50;

let cache = null;
const listeners = new Set();

const read = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(0, MAX) : [];
  } catch {
    return []; // 保存できない環境（プライベートブラウズなど）でも、画面は動く
  }
};

export const getFavorites = () => (cache ??= read());

const notify = () => listeners.forEach((l) => l());

export const toggleFavorite = (id) => {
  const cur = getFavorites();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id].slice(-MAX);
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* 保存できなくても、この画面の間は有効 */ }
  notify();
};

// ほかのタブで変わったときも反映する
const onStorage = (e) => {
  if (e.key === KEY) { cache = null; notify(); }
};

export const subscribeFavorites = (listener) => {
  if (listeners.size === 0) window.addEventListener('storage', onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('storage', onStorage);
  };
};
