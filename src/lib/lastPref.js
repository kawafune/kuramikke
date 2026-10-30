// 前回えらんだエリア（都道府県）を、この端末に覚えておく。次に探すときに、すぐ選べるようにするため。サーバーには送らない。
const KEY = 'kuramikke_last_pref';

export const getLastPref = () => {
  try { return localStorage.getItem(KEY) ?? ''; } catch { return ''; }
};

export const setLastPref = (pref) => {
  try { if (pref) localStorage.setItem(KEY, pref); } catch { /* 保存できなくても、使える */ }
};
