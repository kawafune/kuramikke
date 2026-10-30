// 広告の設定。アフィリエイト（ASPの広告）や、掲載事業者のバナーを、ここに登録する。
// 登録した広告だけが、公開表示に出る（登録が無い枠は、公開表示では何も出さない。開発モードでは、灰色の枠を出す）。
// ルール：docs/shukatsu/ad-rules.md（「広告」と明記する／ページの最後に置く／急がせる表現は使わない／審査基準にそった案件だけ）
//
// 項目：
//   id        : 管理用の名前
//   placement : 置く場所（AdBanner の placement と同じ名前）。'any' は、どの枠にも出る
//   href      : 広告のリンク先（ASPが発行するURL）
//   imageSrc  : バナー画像のURL。alt：画像の説明
//   pixel     : ASPの計測用の1pxの画像URL（ある場合）
//   note      : 広告の下に出す短い注記（任意。例：「各専門の事業者からご連絡があります。」）
//   sponsor   : 広告主の名前（任意。「広告：○○」と表示する）
//
// 場所の名前：home-top / home-mid / home-bottom / search（検索の結果・詳細）/ guide（終活ガイド）
export const ADS = [
  // 例：
  // { id: 'sample', placement: 'search', href: 'https://example.com/', imageSrc: 'https://example.com/banner.png', alt: '○○のご案内', pixel: '', note: '', sponsor: '○○株式会社' },
];
