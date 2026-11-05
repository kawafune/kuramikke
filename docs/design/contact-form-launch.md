# お問い合わせフォーム 公開の手順（2026-11-05）

## 1. Resend の準備（代表）
1. https://resend.com/ でアカウント作成（無料プランで可。月3,000通・1日100通まで）
2. Domains → Add Domain → `kura-mikke.com`（リージョンは Tokyo があれば Tokyo）
3. 画面に出る DNS レコード（SPF・DKIM・MX など数行）を、ムームーDNSに追加する
   - 既存の A / CNAME（Vercel用）は触らない
   - Resend の MX は「send」などのサブドメイン宛て。ルートの MX は変えない
   - TXT の値は、長いのでコピー＆ペーストする
4. Resend 側で「Verify」→ Verified になるまで待つ（数分〜数時間）
5. API Keys → Create API Key（Sending access）→ キーをコピー（一度しか表示されない。LINEやメール本文には貼らない）

## 2. Vercel の環境変数（Production）
| 名前 | 値 |
|---|---|
| `RESEND_API_KEY` | 上でコピーしたキー |
| `CONTACT_TO` | 問い合わせを受け取るメールアドレス |
| `CONTACT_FROM` | `クラミッケ <noreply@kura-mikke.com>` |
| `VITE_CONTACT_FORM` | `1` |

追加したら、Deployments → 最新を Redeploy（環境変数は、再デプロイで反映）。

## 3. テスト
- https://kura-mikke.com/contact で、自分のアドレスを入れて送信 → 運営宛と自動返信が届くか
- 迷惑メールに入っていないか（Gmail の場合）

## 4. 公開前に、プライバシーポリシーへ追記（専門家の確認）
追記案は、下の文。専門家の確認が済んでから、`src/data/businessPages.js` の該当章に入れる。

> お問い合わせフォームに入力いただいた内容（お名前、メールアドレス、お問い合わせの種類、内容）は、メール配信サービス「Resend」（提供者：Resend, Inc.／米国）を通じて、当社が受け取ります。当社は、いただいた内容を、お返事のためにのみ利用し、当社のメール（受信箱）で保管します。当サイトのデータベースには、保存しません。

※ 外国（米国）の事業者を通る点について、個人情報保護法の「外国にある第三者への提供」の扱いが必要かは【要専門家確認】。
