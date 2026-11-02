// sitemap.xml を作る（public/sitemap.xml）。公開しているページだけを載せる。ビルドのたびに自動で実行される（package.json の prebuild）。
// 公開の判定：published: true で、専門家の確認待ち（expertReview: 'required'）でないもの。サイトの設定は src/config/site.js の READY。
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = (process.env.VITE_SITE_URL || 'https://kura-mikke.com').replace(/\/$/, '');
const read = (p) => readFileSync(p, 'utf-8');

// オブジェクトごとに分けて、slug/path と published・expertReview を読む
const chunks = (text, key) => text.split(new RegExp(`\\n  \\{\\n    ${key}:`)).slice(1).map((c) => `${key}:${c}`);
const isPublic = (c) => /published: true/.test(c) && !/expertReview: 'required'/.test(c);
const pick = (c, key) => c.match(new RegExp(`${key}: '([^']+)'`))?.[1];

const urls = ['/'];
const site = read('src/config/site.js');
const ready = (k) => new RegExp(`${k}:\\s*true`).test(site);

if (ready('SHUKATSU')) urls.push('/shukatsu');
chunks(read('src/data/shukatsuGuide.js'), 'slug').filter(isPublic).forEach((c) => urls.push(`/shukatsu/${pick(c, 'slug')}`));
if (ready('SEARCH')) urls.push('/search', '/search/nursing');
if (ready('COLUMN')) {
  urls.push('/column');
  chunks(read('src/data/column.js'), 'slug').filter(isPublic).forEach((c) => urls.push(`/column/${pick(c, 'slug')}`));
}
chunks(read('src/data/businessPages.js'), 'path').filter(isPublic).forEach((c) => urls.push(pick(c, 'path')));
urls.push('/sitemap');

const unique = [...new Set(urls)];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique.map((u) => `  <url><loc>${BASE}${u}</loc></url>`).join('\n')}\n</urlset>\n`;
writeFileSync('public/sitemap.xml', xml);
console.log(`sitemap.xml：${unique.length}ページ（${BASE}）`);
