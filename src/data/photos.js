// ページや記事に使う写真。キーは、「page:パス」「guide:スラッグ」「column:スラッグ」。
// 写真は src/assets/photos/ に置く（WebP・横1280〜1600px）。出典：Unsplash／Pixabay（代表が用意した無料素材）【要確認：各素材のライセンス表記の要否】
import contact from '../assets/photos/contact.webp';
import disclaimer from '../assets/photos/disclaimer.webp';
import about from '../assets/photos/about.webp';

export const PHOTOS = {
  'page:/contact': contact,
  'page:/disclaimer': disclaimer,
  'guide:about': about,
};
