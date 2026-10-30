// 公開前のチェック（ソースの文字を読んで、残っている印や設定を一覧にする）。
// 使い方：node scripts/launch_check.mjs
// リンク切れ・表示の確認は、scripts/check_links.cjs（ブラウザで巡回）を使う。
import { readFileSync, readdirSync } from 'node:fs';

const read = (p) => readFileSync(p, 'utf-8');
const count = (text, re) => (text.match(re) ?? []).length;

const files = [
  'src/data/shukatsuGuide.js', 'src/data/column.js', 'src/data/businessPages.js',
  'src/components/home/ListingBanner.jsx', 'src/components/search/EmergencyNotice.jsx', 'src/components/shukatsu/ListingSection.jsx',
];
console.log('■ 残っている印（【要確認】など。公開前に、解消が必要）');
let total = 0;
for (const f of files) {
  const t = read(f);
  const a = count(t, /【要確認/g), b = count(t, /【要人間確認/g), c = count(t, /【要専門家確認/g);
  total += a + b + c;
  console.log(`  ${f}：要確認 ${a} / 要人間確認 ${b} / 要専門家確認 ${c}`);
}
console.log(`  合計：${total}件\n`);

console.log('■ ページの公開状態（published: true の数／全体）');
for (const f of ['src/data/shukatsuGuide.js', 'src/data/column.js', 'src/data/businessPages.js']) {
  const t = read(f);
  console.log(`  ${f}：公開 ${count(t, /published: true/g)} ／ 全体 ${count(t, /published: (true|false)/g)}（専門家の確認待ち expertReview: 'required' ${count(t, /expertReview: 'required'/g)}）`);
}

const site = read('src/config/site.js');
console.log('\n■ 公開の設定（src/config/site.js）');
console.log('  ' + site.split('\n').filter((l) => /HOME =|SEARCH:|COLUMN:|COMMUNITY:|SHUKATSU:|TOP:/.test(l)).map((l) => l.trim()).join('\n  '));

console.log('\n■ 広告（src/data/ads.js）');
console.log(`  登録数：${count(read('src/data/ads.js').replace(/\/\/.*$/gm, ''), /placement:/g)}`);

console.log('\n■ 仮の内容が残っていないか');
for (const f of readdirSync('src/pages').map((x) => `src/pages/${x}`).concat(readdirSync('src/components/home').map((x) => `src/components/home/${x}`))) {
  if (!/\.jsx?$/.test(f)) continue;
  const n = count(read(f), /ダミー|仮のデータ|仮データ/g);
  if (n) console.log(`  ${f}：${n}箇所`);
}
console.log('\n■ 手で確認すること（docs/launch-checklist.md）\n  Vercelの環境変数 VITE_CONTACT_EMAIL ／ 独自ドメイン ／ 専門家の確認 ／ 計測の設定');
