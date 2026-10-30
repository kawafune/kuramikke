// 利用規約・プライバシーポリシー・免責事項（src/data/businessPages.js の LEGAL_PAGES）を、編集しやすい Markdown に書き出す。
// 使い方：node scripts/export_legal_md.mjs docs/legal/draft.md
import { writeFileSync } from 'node:fs';
import { LEGAL_PAGES } from '../src/data/businessPages.js';

const block = (b) => {
  switch (b.type) {
    case 'p': return b.text;
    case 'ul': return b.items.map((t) => `- ${t}`).join('\n');
    case 'ol': return b.items.map((it, i) => `${i + 1}. ${it.title ?? ''}${it.text ? `：${it.text}` : ''}`).join('\n');
    case 'link': return `（リンク：${b.label} → ${b.to}）`;
    case 'mailto': return `（お問い合わせ用のメールボタン：件名「${b.subject}」。メールアドレスは、公開しない設定）`;
    default: return '';
  }
};

const head = `# 利用規約・プライバシーポリシー・免責事項　ドラフト

作成：Claude／確認：代表（編集のうえ、弁護士などの専門家へ）
基準：サイトの実装（docs と同じ内容。画面は、開発モードの /terms /privacy /disclaimer で確認できます）

## 使い方
- 【要人間確認】【要専門家確認】【要確認】は、決めたり、専門家に確認してもらったりする箇所です。解消したら、印を消してください。
- 編集した文章は、Claude に渡してもらえれば、サイトの画面（src/data/businessPages.js）に反映します。

## 要判断ポイント
1. **運営会社の所在地・代表者名・制定日**：運営会社ページ（準備中）と合わせて、記入してください。
2. **裁判所（管轄）**：本店所在地を管轄する地方裁判所を入れてください。【推奨：東京など、連絡のしやすい裁判所】
3. **アクセス解析・広告・アフィリエイトの外部サービス名**：使い始めるときに、プライバシーポリシーの5章へ追記します（電気通信事業法の「外部送信規律」。ASPの審査でも見られます）。
4. **公的データの出典表記**：厚生労働省の各データの利用規約にそって、表記を確認してください。

## 専門家に見てもらいたい論点
- 免責の範囲（故意・重過失の除外、消費者契約法8条との関係）
- 医療広告ガイドライン、景品表示法（「募集開始の特典」の表示、二重価格表示）
- 個人情報保護法、電気通信事業法の外部送信規律（クッキー・広告・解析）
- 特定商取引法に基づく表記（有料の掲載を募集するときに必要かどうか）
- 終活まわりの記事（相続・税・保険・投資）の、専門家確認の記載方法

---
`;

const body = LEGAL_PAGES.map((p) => {
  const secs = p.sections.map((s) => `### ${s.h}\n\n${s.blocks.map(block).filter(Boolean).join('\n\n')}`).join('\n\n');
  return `## ${p.title}（${p.path}）\n\n${p.lead}\n\n${secs}\n\n${p.note}\n`;
}).join('\n---\n\n');

writeFileSync(process.argv[2] ?? 'docs/legal/draft.md', `${head}\n${body}`);
console.log('書き出しました：', process.argv[2] ?? 'docs/legal/draft.md');
