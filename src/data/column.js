// コラム。カテゴリは「終活」「病院・介護」「暮らし・絆」の3つ（2026-10-29 に決定）。
// 「終活」の記事は、終活ガイド（data/shukatsuGuide.js）の記事を、そのまま並べる（二重に書かない）。
// 「病院・介護」「暮らし・絆」の記事は、このファイルに書く。
//
// published    : true にすると、パスワード無しの訪問者にも公開される（代表が確認してから true にする）
// expertReview : 'required'＝専門家の確認が済むまで、published を true にしても公開されない / 'done'＝確認済み / 'none'＝不要
// 本文の部品（blocks）は終活ガイドと同じ（data/shukatsuGuide.js の冒頭を参照）。【要確認】は、開発モードでだけ目立つ。
import { GUIDE_PAGES, isReadable } from './shukatsuGuide';

export const COLUMN_CATEGORIES = [
  { key: 'shukatsu', label: '終活', art: 'note' },
  { key: 'care', label: '病院・介護', art: 'seminar' },
  { key: 'life', label: '暮らし・絆', art: 'hobby' },
];
export const CATEGORY_LABEL = Object.fromEntries(COLUMN_CATEGORIES.map((c) => [c.key, c.label]));

export const COLUMN_ARTICLES = [
  {
    slug: 'family-doctor',
    category: 'care',
    title: 'かかりつけ医は、どう選ぶ？ 5つの目安',
    excerpt: '近さ、相談しやすさ、診療時間。長くおつきあいできる先生を見つけるためのヒントです。',
    date: '2026-10-30',
    art: 'seminar',
    published: false,
    expertReview: 'required',
    lead: 'ちょっとした体調の変化を、気軽に相談できる「かかりつけ医」。いざというときに、心強い味方になります。はじめて探すときの、5つの目安をご紹介します。',
    sections: [
      {
        h: '5つの目安',
        blocks: [
          { type: 'ol', items: [
            { title: '通いやすい場所にある', text: '体調が悪いときでも、無理なく行ける近さが大切です。自宅や、ご家族の家の近くで探してみましょう。' },
            { title: '話をよく聞いてくれる', text: '症状や心配ごとを、遠慮なく話せる雰囲気かどうか。初診のときに、感じてみてください。' },
            { title: '診療時間が、生活に合っている', text: '午前だけ、午後だけなど、病院によってちがいます。通院する曜日や時間に合うか、確かめておくと安心です。' },
            { title: '必要なときに、専門の病院を紹介してくれる', text: 'くわしい検査や治療が必要なときに、適切な病院へつないでくれる先生だと心強いです。' },
            { title: '往診・訪問診療に対応しているか（必要になりそうなら）', text: '通院がむずかしくなったときのために、あらかじめ聞いておくと安心です。【要確認：対応の有無は、各医療機関への確認が必要】' },
          ] },
        ],
      },
      {
        h: 'クラミッケでの探し方',
        blocks: [
          { type: 'p', text: '「病院・介護施設を探す」で、エリアと診療科目を選んで探せます。「いま受付中」や、「現在地から近い順」も使えます。診療時間は変わることがあるので、行く前に、お電話や公式サイトで確認してくださいね。' },
          { type: 'link', to: '/search', label: '病院・診療所を探す' },
        ],
      },
    ],
  },
  {
    slug: 'nursing-home-types',
    category: 'care',
    title: '老人ホームの種類と、ちがい。まずは全体像から',
    excerpt: '介護付き、住宅型、サービス付き高齢者向け住宅、グループホーム、特養、老健。名前は似ていますが、役割がちがいます。',
    date: '2026-10-30',
    art: 'hobby',
    published: false,
    expertReview: 'required',
    lead: '「老人ホーム」と一言でいっても、いろいろな種類があります。はじめて調べる方が迷わないよう、大まかなちがいをまとめました。【要専門家確認：制度の説明は、介護の専門家の確認が必要】',
    sections: [
      {
        h: '大まかな種類',
        blocks: [
          { type: 'cards', items: [
            { title: '介護付き有料老人ホーム', text: '施設のスタッフが、食事や入浴などの介護を行います。介護が必要になっても、住み続けやすい形です。' },
            { title: '住宅型有料老人ホーム', text: '生活のサポートがつく住まいです。介護が必要なときは、外部の介護サービスを、ご自身で契約して使います。' },
            { title: 'サービス付き高齢者向け住宅（サ高住）', text: 'バリアフリーの住まいで、安否の確認や、生活の相談がつきます。介護サービスは、別に契約する形が一般的です。' },
            { title: 'グループホーム', text: '認知症の方が、少人数で、家庭に近い雰囲気で暮らす施設です。' },
            { title: '特別養護老人ホーム（特養）', text: '介護の必要度が高い方のための、公的な施設です。入所できる方の条件があり、待機が必要なことも多いです。【要確認：入所の条件】' },
            { title: '介護老人保健施設（老健）', text: '病院から自宅へ戻るための、リハビリを中心にした施設です。長く住み続ける場所ではありません。【要確認】' },
          ] },
        ],
      },
      {
        h: '選ぶときに、見ておきたいこと',
        blocks: [
          { type: 'ul', items: [
            '費用（入居時の費用と、毎月の費用。介護保険の自己負担や、食費などは、別にかかります）',
            '介護や医療が必要になったときの、対応',
            'ご家族の家からの、通いやすさ',
            '見学して、雰囲気やスタッフの対応を確かめる',
          ] },
          { type: 'p', text: 'クラミッケでは、介護保険の指定を受けた施設（介護付き有料老人ホーム、グループホーム、特養、老健など）を探せます。費用は公的データに入っていないので、見学のときに、施設へご確認ください。' },
          { type: 'link', to: '/search/nursing', label: '老人ホームを探す' },
        ],
      },
    ],
  },
  {
    slug: 'hospital-admission',
    category: 'care',
    title: '家族が入院したとき、最初に確認したいこと',
    excerpt: 'あわてないために。持ち物、連絡先、病院の相談窓口、退院後のこと。',
    date: '2026-10-30',
    art: 'money',
    published: false,
    expertReview: 'required',
    lead: 'ご家族が急に入院すると、だれでもあわててしまいます。まず、落ち着いて確認したいことを、順番にまとめました。',
    sections: [
      {
        h: 'はじめの確認',
        blocks: [
          { type: 'ol', items: [
            { title: '病院からの説明を、一緒に聞く', text: '病名や、これからの予定、入院の目安を聞いて、メモに残します。聞き取れなかったことは、遠慮なく聞き返して大丈夫です。' },
            { title: '連絡先を、はっきりさせる', text: '病院が、だれに連絡するのか。ご家族の中で、窓口になる人を決めておくと、混乱しません。' },
            { title: '持ち物を確認する', text: '保険証、お薬手帳、着替え、日用品など。必要なものは、病院によってちがうので、病院に確認します。' },
            { title: '病院の「相談窓口」を聞く', text: '費用や、退院後の生活についての相談は、病院の相談窓口（医療相談室など）でできることが多いです。【要確認：名称や対応は病院ごとに異なる】' },
            { title: '退院後のことを、早めに考える', text: '自宅に戻るのか、リハビリの施設や、介護サービスが必要か。早めに相談を始めると、慌てずにすみます。' },
          ] },
        ],
      },
      {
        h: '遠くに住んでいるご家族のために',
        blocks: [
          { type: 'p', text: '遠方から駆けつけるときは、病院の場所や、面会の時間を、先に調べておくと安心です。クラミッケでも、病院の場所と、公式サイトを調べられます。' },
          { type: 'link', to: '/search', label: '病院・診療所を探す' },
        ],
      },
    ],
  },
  {
    slug: 'first-step-friends',
    category: 'life',
    title: '同じ趣味の仲間と出会う、はじめの一歩',
    excerpt: '一人ではじめにくいことも、仲間となら続けられる。気軽に参加できる場所の見つけ方。',
    date: '2026-10-30',
    art: 'sakura',
    published: false,
    expertReview: 'none',
    lead: '「新しいことを始めたいけれど、一人だと、なかなか…」そんな気持ちになることはありませんか。仲間と出会うための、はじめの一歩のヒントです。',
    sections: [
      {
        h: '気軽にはじめるコツ',
        blocks: [
          { type: 'ul', items: [
            'まずは「見学」や「体験」から。入会を決めなくても大丈夫です',
            '地域の公民館や、市区町村の案内を見てみる',
            '昔やっていたことや、好きだったことを、思い出してみる',
            '一人で行くのが不安なときは、家族や友人を誘ってみる',
          ] },
        ],
      },
      {
        h: 'クラミッケでも、準備しています',
        blocks: [
          { type: 'p', text: 'ボウリング、囲碁・将棋、座談会、地域のお祭りなど、同じ趣味や思いの仲間とつながれるイベントを、載せられる場所を準備しています。【要確認：公開時期】' },
        ],
      },
    ],
  },
];

export const COLUMN_BY_SLUG = Object.fromEntries(COLUMN_ARTICLES.map((a) => [a.slug, a]));

export const isArticlePublic = (a) => a.published && a.expertReview !== 'required';
export const isArticleReadable = (a, devMode) => devMode || isArticlePublic(a);

// 一覧に並べるもの（終活ガイドの記事も含む）。読めるものだけ。新しい順（日付の無い終活ガイドは、番号順で、先に並べる）
export const getColumnItems = (devMode) => {
  const guides = [...GUIDE_PAGES].sort((a, b) => a.no - b.no).filter((g) => isReadable(g, devMode)).map((g) => ({
    key: `guide-${g.slug}`, to: `/shukatsu/${g.slug}`, category: 'shukatsu', title: g.title, excerpt: g.short, date: '', art: 'note',
  }));
  const articles = COLUMN_ARTICLES.filter((a) => isArticleReadable(a, devMode)).map((a) => ({
    key: `column-${a.slug}`, to: `/column/${a.slug}`, category: a.category, title: a.title, excerpt: a.excerpt, date: a.date, art: a.art,
  }));
  return [...guides, ...articles];
};
