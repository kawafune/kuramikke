// サイト全体の切り替えはここだけで行う

// トップページに何を出すか。'shukatsu'＝終活ガイド / 'portal'＝病院・施設・出逢いのポータル型（現在のTOP）
// 検索側が整ったら 'portal' に切り替える。開発モードでは、TOP（/）はいつもポータル型。終活ガイドのTOPは /shukatsu で見られる。
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

// 事業者からのお問い合わせ・お申込みを受けるメールアドレス。空のあいだは、ページに「準備中」と表示される。
// いずれは、お問い合わせフォーム → AI＋人間での対応に移す。
// 営業メールを避けるため、公開のリポジトリにはアドレスを書かず、環境変数 VITE_CONTACT_EMAIL から読む。
//   本番：Vercel の Settings → Environment Variables に VITE_CONTACT_EMAIL を登録する
//   手元：.env.local に書く（.gitignore で除外済み）。書き方は .env.example
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? '';

export const AUTH_KEY = 'kuramikke_auth'; // 開発モードの保存キー（従来のログインと同じ）
