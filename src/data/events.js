// 「絆を見つける」のイベント。まずは、提携した事業者・団体が開くセミナーや交流会を、クラミッケが紹介する形で始める
// （クラミッケ自身がイベントを主催するのではない）。申込み・参加費の受け取り・当日の運営は、すべて主催者が行う。
// 将来、主催者が自分でイベントを登録できる管理画面を考えているが、それはスタッフが増えてから（2026-11 時点の方針）。
//
// posted       : クラミッケに掲載した日（YYYY-MM-DD）。一覧の並び順に使う
// published    : true にすると、パスワード無しの訪問者にも公開される（代表が確認してから true にする）
// category     : 'seminar'（セミナー・講座）/ 'gathering'（交流会・サークル）/ 'experience'（体験・お出かけ）
// format       : 'online'（オンライン）/ 'place'（会場）/ 'both'（どちらも）
import { PHOTOS } from './photos';

export const EVENT_CATEGORIES = [
  { key: 'seminar', label: 'セミナー・講座' },
  { key: 'gathering', label: '交流会・サークル' },
  { key: 'experience', label: '体験・お出かけ' },
];
export const EVENT_CATEGORY_LABEL = Object.fromEntries(EVENT_CATEGORIES.map((c) => [c.key, c.label]));

export const EVENTS = [
  {
    slug: 'sample-ending-note-seminar',
    category: 'seminar',
    title: '【見本】はじめてのエンディングノート講座',
    organizer: '〇〇行政書士事務所',
    organizerUrl: '',
    posted: '2026-11-13', // 掲載した日（一覧は、新しく掲載した順に並べる）
    date: '2026-12-10',
    dateLabel: '2026年12月10日（木）',
    time: '14:00〜15:30',
    format: 'online',
    place: 'オンライン（Zoom）',
    price: '参加無料',
    capacity: '先着30名',
    image: PHOTOS['guide:ending-note'],
    art: 'seminar',
    excerpt: 'エンディングノートの書き方を、行政書士の先生が、やさしく解説します。',
    published: false, // 実際の提携先が決まるまで、非公開（見本のデータ）
    sections: [
      { h: 'こんな内容です', blocks: [
        { type: 'ul', items: [
          'エンディングノートに書くこと、書かなくてよいこと',
          'ご家族に伝わりやすい書き方のコツ',
          '質問の時間（約20分）',
        ] },
      ] },
      { h: '開催概要', blocks: [
        { type: 'ul', items: [
          '対象：終活をはじめたい方、ご家族の方',
          '持ち物：筆記用具（お手元にエンディングノートがあれば）',
          '主催：〇〇行政書士事務所（クラミッケは、会場の提供や運営は行いません）',
        ] },
      ] },
    ],
  },
];

export const EVENT_BY_SLUG = Object.fromEntries(EVENTS.map((e) => [e.slug, e]));
export const isEventPublic = (e) => e.published;
export const isEventReadable = (e, devMode) => devMode || isEventPublic(e);
// 掲載した日（posted）の新しい順。同じ日なら、あとに書き足したものを先に（開催日は、各カードに表示される）
export const getEvents = (devMode) => EVENTS.map((e, i) => ({ e, i })).filter(({ e }) => isEventReadable(e, devMode))
  .sort((x, y) => y.e.posted.localeCompare(x.e.posted) || y.i - x.i).map(({ e }) => e);
