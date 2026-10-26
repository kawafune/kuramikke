// サイト全体の切り替えはここだけで行う

// トップページに何を出すか。'shukatsu'＝終活ガイド / 'portal'＝病院・施設・出逢いのポータル型（現在のTOP）
// 検索側が整ったら 'portal' に切り替える。どちらのTOPも、開発モードでは /portal と /shukatsu で常に見られる。
export const HOME = 'shukatsu';

// 一般の訪問者に公開している機能（false は「準備中」。開発モードのパスワードを入れた人だけが見られる）
export const READY = {
  TOP: true,
  SHUKATSU: true,
  SEARCH: false,
  COLUMN: false,
  COMMUNITY: false,
};

// メニューの項目 → URL
export const TARGET_PATH = {
  TOP: '/',
  SEARCH: '/search',
  COLUMN: '/column',
  COMMUNITY: '/community',
  SHUKATSU: '/shukatsu',
};

export const AUTH_KEY = 'kuramikke_auth'; // 開発モードの保存キー（従来のログインと同じ）
