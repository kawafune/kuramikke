// ページや記事に使う写真。キーは、「page:パス」「guide:スラッグ」「column:スラッグ」。
// 写真は src/assets/photos/ に置く（WebP・横1600px以内）。元の画像は、Google ドライブの img フォルダ（代表が用意した無料素材）。
import contact from '../assets/photos/contact.webp';
import disclaimer from '../assets/photos/disclaimer.webp';
import pageAbout from '../assets/photos/page-about.webp';

const guide = import.meta.glob('../assets/photos/guide-*.webp', { eager: true, import: 'default' });
const column = import.meta.glob('../assets/photos/col-*.webp', { eager: true, import: 'default' });
const byName = (files, prefix, key) => Object.fromEntries(Object.entries(files).map(([path, url]) => [`${key}:${path.split('/').pop().replace(prefix, '').replace('.webp', '')}`, url]));

export const PHOTOS = {
  'page:/contact': contact,
  'page:/disclaimer': disclaimer,
  'page:/about': pageAbout,
  ...byName(guide, 'guide-', 'guide'),
  ...byName(column, 'col-', 'column'),
};
