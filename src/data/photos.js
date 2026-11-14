// ページや記事に使う写真。キーは、「page:パス」「guide:スラッグ」「column:スラッグ」。
// 写真は src/assets/photos/ に置く（WebP・横1600px以内）。元の画像は、Google ドライブの img フォルダ（代表が用意した無料素材）。
import contact from '../assets/photos/contact.webp';
import disclaimer from '../assets/photos/disclaimer.webp';
import pageAbout from '../assets/photos/page-about.webp';
import pageCommunity from '../assets/photos/page-community.webp';
import pageColumn from '../assets/photos/page-column.webp';

const guide = import.meta.glob('../assets/photos/guide-*.webp', { eager: true, import: 'default' });
const column = import.meta.glob('../assets/photos/col-*.webp', { eager: true, import: 'default' });
const byName = (files, prefix, key) => Object.fromEntries(Object.entries(files).map(([path, url]) => [`${key}:${path.split('/').pop().replace(prefix, '').replace('.webp', '')}`, url]));

export const PHOTOS = {
  'page:/contact': contact,
  'page:/disclaimer': disclaimer,
  'page:/about': pageAbout,
  'page:/community': pageCommunity, // 絆を見つける のMV
  'page:/column': pageColumn, // コラムのMV（終活・病院・介護・暮らし・絆の、どのカテゴリでも同じ）
  ...byName(guide, 'guide-', 'guide'),
  ...byName(column, 'col-', 'column'),
};
