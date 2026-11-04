// お問い合わせフォームの送信先（Vercel のサーバー機能）。入力内容を、メール送信サービス（Resend）経由で、運営へメールする。
// データベースには保存しない。個人情報は、ログにも出さない。
//
// 必要な環境変数（Vercel の Settings → Environment Variables。Production）：
//   RESEND_API_KEY   … Resend の APIキー
//   CONTACT_TO       … 受け取る運営のメールアドレス（リポジトリには書かない）
//   CONTACT_FROM     … 送信元（例：クラミッケ <noreply@kura-mikke.com>。Resend でドメインの認証が必要）
// どれかが無いと、503 を返す（画面には「メールでお問い合わせください」と出る）。

const TYPES = ['ご利用についてのご質問・ご意見', '掲載内容の誤りのご連絡', '事業者の方（掲載について）', '個人情報について', 'その他'];
const MAX = { name: 80, email: 200, message: 3000 };

// 簡易の回数制限（同じ接続元から、10分に5回まで）。サーバーが入れ替わると、リセットされる（ベストエフォート）
const hits = new Map();
const limited = (ip) => {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
};

const clean = (v, max) => String(v ?? '').replace(/\r/g, '').trim().slice(0, max);
const oneLine = (v) => v.replace(/[\n\t]+/g, ' ');

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) return res.status(503).json({ error: 'not_configured' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {});
  // 迷惑送信の対策：見えない欄（website）に入力がある／表示から送信までが早すぎる、は、成功したように見せて捨てる
  if (clean(body.website, 10) || Date.now() - Number(body.t || 0) < 3000) return res.status(200).json({ ok: true });

  const ip = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'rate_limited' });

  const name = oneLine(clean(body.name, MAX.name));
  const email = oneLine(clean(body.email, MAX.email));
  const type = TYPES.includes(body.type) ? body.type : 'その他';
  const message = clean(body.message, MAX.message);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.agree !== true) return res.status(400).json({ error: 'invalid' });

  const send = (payload) => fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  try {
    // 運営へ（返信すると、送った方に届く）
    const r = await send({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      reply_to: email,
      subject: `【クラミッケ】お問い合わせ：${type}`,
      text: `お名前：${name}\nメールアドレス：${email}\n種類：${type}\n\n${message}\n\n---\nクラミッケのお問い合わせフォームから送信されました。`,
    });
    if (!r.ok) return res.status(502).json({ error: 'send_failed' });
    // 送った方へ、受付のお知らせ（失敗しても、受付は成功として扱う）
    await send({
      from: CONTACT_FROM,
      to: [email],
      subject: '【クラミッケ】お問い合わせを受け付けました',
      text: `${name} 様\n\nクラミッケへのお問い合わせ、ありがとうございます。以下の内容で受け付けました。\n数日以内に、メールでお返事します。（内容によっては、お時間をいただくことがあります）\n\n種類：${type}\n\n${message}\n\n---\nこのメールは、お問い合わせフォームから自動で送信しています。心当たりがない場合は、お手数ですが、破棄してください。\nクラミッケから、営業のお電話をすることはありません。\n合同会社Happiino`,
    }).catch(() => {});
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: 'send_failed' });
  }
}
