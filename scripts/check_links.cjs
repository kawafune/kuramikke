// サイト内のリンクを巡回して、表示できないページや、画面のエラーを探す（Playwrightを使う）。
// 使い方：
//   npm run build && npx vite preview --port 4173 &   （別の画面で起動しておく）
//   node scripts/check_links.cjs http://localhost:4173 [dev]
// 引数に dev を付けると、開発モード（公開前のページも含む）で巡回する。
const { chromium } = require('playwright');

const base = process.argv[2] ?? 'http://localhost:4173';
const dev = process.argv[3] === 'dev';
const SKIP = [/^\/hospitals\//, /^\/nursing-homes\//, /^\/search\/results/, /^\/search\/nursing\?/, /^\/dev$/, /^\/portal/];

(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext()).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`画面のエラー：${e.message}`));
  await page.goto(base);
  if (dev) await page.evaluate(() => localStorage.setItem('kuramikke_auth', 'true'));

  const seen = new Set();
  const queue = ['/'];
  const bad = [];
  while (queue.length && seen.size < 150) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const text = await page.evaluate(() => document.body.innerText);
    if (/ページが見つかりません|404/.test(text.slice(0, 600))) bad.push(`${path}：ページが見つかりません`);
    const hrefs = await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')));
    for (const h of hrefs) {
      const p = h.split('#')[0];
      if (p && !seen.has(p) && !SKIP.some((re) => re.test(p))) queue.push(p);
    }
  }
  console.log(`巡回したページ：${seen.size}（${dev ? '開発モード' : '公開表示'}）`);
  console.log(bad.length ? `見つからないページ：\n  ${bad.join('\n  ')}` : '見つからないページ：なし');
  console.log(errors.length ? `エラー：\n  ${errors.join('\n  ')}` : 'エラー：なし');
  await browser.close();
})();
