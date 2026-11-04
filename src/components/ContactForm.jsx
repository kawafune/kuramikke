import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { CONTACT_EMAIL } from '../config/site';

// お問い合わせフォーム（入力 → 確認 → 完了）。送信先は /api/contact（api/contact.js）。保存はしない。
const TYPES = ['ご利用についてのご質問・ご意見', '掲載内容の誤りのご連絡', '事業者の方（掲載について）', '個人情報について', 'その他'];
const field = 'w-full px-3 py-2 border border-gold rounded bg-white text-[0.95rem] focus:outline-none focus:border-gold-deep';

const Steps = ({ step }) => (
  <ol className="grid grid-cols-3 gap-1 mb-8 text-center font-round font-bold text-white text-[0.9rem]" aria-label="入力の進み具合">
    {['入力', '確認', '完了'].map((label, i) => (
      <li key={label} aria-current={i === step ? 'step' : undefined} className={`py-2 ${i === step ? 'bg-[#70BDB5]' : 'bg-[#BDBDBD]'}`}>{label}</li>
    ))}
  </ol>
);

const Row = ({ label, required, children, hint }) => (
  <div className="mb-5">
    <p className="font-round font-bold text-[0.9rem] mb-1">{label}{required && <span className="ml-2 text-[0.7rem] bg-accent-red-text text-white px-1.5 py-0.5">必須</span>}</p>
    {children}
    {hint && <p className="mt-1 text-[0.75rem] text-ink-sub">{hint}</p>}
  </div>
);

export const ContactForm = () => {
  const [step, setStep] = useState(0);
  const [v, setV] = useState({ name: '', email: '', type: TYPES[0], message: '', agree: false, website: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const shownAt = useRef(Date.now());
  const set = (k) => (e) => setV({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const check = () => {
    if (!v.name.trim()) return 'お名前を入力してください。';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) return 'メールアドレスを、正しく入力してください。';
    if (!v.message.trim()) return 'お問い合わせの内容を入力してください。';
    if (!v.agree) return 'プライバシーポリシーへの同意に、チェックをお願いします。';
    return '';
  };

  const toConfirm = (e) => {
    e.preventDefault();
    const msg = check();
    setError(msg);
    if (!msg) { setStep(1); window.scrollTo(0, 0); }
  };

  const send = async () => {
    setSending(true); setError('');
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...v, agree: true, t: shownAt.current }) });
      if (r.ok) { setStep(2); window.scrollTo(0, 0); return; }
      setError(r.status === 503
        ? 'ただいま、フォームからの送信を準備中です。お手数ですが、メールでお問い合わせください。'
        : r.status === 429 ? '短い時間に、たくさん送信されました。しばらくしてから、もう一度お試しください。'
          : '送信できませんでした。通信を確認して、もう一度お試しください。');
    } catch {
      setError('送信できませんでした。通信を確認して、もう一度お試しください。');
    } finally { setSending(false); }
  };

  if (step === 2) {
    return (
      <div className="bg-cream-50 p-6 md:p-10">
        <Steps step={2} />
        <p className="font-round font-bold text-[1.1rem] text-gold-deep mb-3">お問い合わせを受け付けました。</p>
        <p className="mb-6">ありがとうございます。ご入力のメールアドレスに、受付のお知らせをお送りしました。数日以内に、メールでお返事します。（お知らせが届かないときは、迷惑メールのフォルダも、ご確認ください）</p>
        <Button to="/" icon={null}>TOPページへ戻る</Button>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 p-5 md:p-10">
      <Steps step={step} />
      {step === 0 ? (
        <form onSubmit={toConfirm} noValidate>
          <Row label="お名前" required><input value={v.name} onChange={set('name')} autoComplete="name" maxLength={80} className={field} /></Row>
          <Row label="メールアドレス" required hint="お返事は、このアドレスにお送りします。"><input type="email" value={v.email} onChange={set('email')} autoComplete="email" maxLength={200} className={field} /></Row>
          <Row label="お問い合わせの種類">
            <select value={v.type} onChange={set('type')} className={field}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          </Row>
          <Row label="お問い合わせの内容" required hint="個人情報（口座番号・暗証番号など）は、書かないでください。"><textarea value={v.message} onChange={set('message')} rows={8} maxLength={3000} className={field} /></Row>
          {/* 迷惑送信の対策：人の目には見えない欄。ここに入力があると、送信は捨てられる */}
          <div aria-hidden="true" className="absolute -left-[9999px]"><label>ウェブサイト<input tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} /></label></div>
          <label className="flex items-start gap-3 mb-6 cursor-pointer">
            <input type="checkbox" checked={v.agree} onChange={set('agree')} className="mt-1.5 w-5 h-5 accent-[#8A6D0B]" />
            <span className="text-[0.9rem]"><Link to="/privacy" target="_blank" className="text-gold-deep underline underline-offset-4">プライバシーポリシー</Link>に同意のうえ、送信します。</span>
          </label>
          {error && <p role="alert" className="mb-4 bg-[#FFF1EE] border border-accent-red-text p-3 text-[0.9rem] text-accent-red-text font-bold">{error}</p>}
          <div className="text-center"><Button type="submit" icon={null}>入力内容を確認する</Button></div>
        </form>
      ) : (
        <div>
          <p className="mb-4 text-[0.9rem]">次の内容で送信します。まちがいがないか、ご確認ください。</p>
          <dl className="bg-white border border-gold mb-6">
            {[['お名前', v.name], ['メールアドレス', v.email], ['種類', v.type], ['内容', v.message]].map(([k, val]) => (
              <div key={k} className="flex flex-col sm:flex-row gap-1 sm:gap-6 p-4 border-b border-line last:border-b-0">
                <dt className="sm:w-[9rem] shrink-0 font-round font-bold text-[0.85rem]">{k}</dt>
                <dd className="whitespace-pre-wrap break-words min-w-0">{val}</dd>
              </div>
            ))}
          </dl>
          {error && (
            <p role="alert" className="mb-4 bg-[#FFF1EE] border border-accent-red-text p-3 text-[0.9rem] text-accent-red-text font-bold">
              {error}
              {CONTACT_EMAIL && <> （<a className="underline" href={`mailto:${CONTACT_EMAIL}`}>メールで送る</a>）</>}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4">
            <button type="button" onClick={() => { setStep(0); setError(''); }} className="min-h-[44px] px-8 border border-gold-deep text-gold-deep font-round font-bold bg-white">もどって直す</button>
            <button type="button" onClick={send} disabled={sending} className="min-h-[44px] px-10 bg-gold-deep text-white font-round font-bold rounded shadow-[0_3px_0_theme(colors.gold.shadow)] disabled:opacity-60">{sending ? '送信しています…' : 'この内容で送信する'}</button>
          </div>
        </div>
      )}
    </div>
  );
};
