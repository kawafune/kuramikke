// 手書き用エンディングノート（PDF）を作る。scripts/pdf/ending_note.html → public/downloads/ending-note.pdf
// 使い方：node scripts/build_ending_note_pdf.cjs（Playwrightが必要）
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + path.resolve(__dirname, 'pdf/ending_note.html'));
  await p.pdf({ path: path.resolve(__dirname, '../public/downloads/ending-note.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
  console.log('作りました：public/downloads/ending-note.pdf');
})();
