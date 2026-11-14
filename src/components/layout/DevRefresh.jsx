import React, { useState } from 'react';

// 開発モードの帯に出す「表示を最新にする」道具。
// 1) 「最新か確認」：いま表示している版（画面に埋め込まれたもの）と、サーバーにある最新の版（/version.json）を比べる
// 2) 「キャッシュを消して更新」：このブラウザの保存（キャッシュ）を消して、サーバーから読み直す
//    ・消すのは、このブラウザの「ページ・画像などの保存」だけ。ログイン（開発モード）の状態は、消さない
//    ・サーバー側（Vercel）の保存は、ここでは消せない。Vercelの Caches 画面にある「Purge CDN Cache」で行う
const fmt = (iso) => {
  try { return new Date(iso).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return iso; }
};

const clearAndReload = async () => {
  try {
    if ('caches' in window) await Promise.all((await caches.keys()).map((k) => caches.delete(k)));
    if ('serviceWorker' in navigator) await Promise.all((await navigator.serviceWorker.getRegistrations()).map((r) => r.unregister()));
    // ページ本体（index.html）を、保存を使わずに取り直す。そのあと読み直すと、新しい部品（JS・CSS）が読み込まれる
    await fetch(`${window.location.pathname}?_refresh=${Date.now()}`, { cache: 'reload' });
    await fetch('/index.html', { cache: 'reload' });
  } catch { /* 失敗しても、読み直しは行う */ }
  window.location.reload();
};

export const DevRefresh = () => {
  const [state, setState] = useState({ kind: 'idle' }); // idle / checking / latest / newer / error
  const shown = typeof __BUILD__ !== 'undefined' ? __BUILD__ : { id: 'local', builtAt: '' };

  const check = async () => {
    setState({ kind: 'checking' });
    try {
      const r = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!r.ok) throw new Error(String(r.status));
      const latest = await r.json();
      setState(latest.id === shown.id ? { kind: 'latest' } : { kind: 'newer', latest });
    } catch {
      setState({ kind: 'error' });
    }
  };

  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="text-white/70">表示中の版：{shown.id}{shown.builtAt && `（${fmt(shown.builtAt)}）`}</span>
      <button onClick={check} className="underline underline-offset-2">最新か確認</button>
      {state.kind === 'checking' && <span aria-live="polite">確認中…</span>}
      {state.kind === 'latest' && <span aria-live="polite" className="text-[#9FE3B0]">✓ 最新です</span>}
      {state.kind === 'newer' && <span aria-live="polite" className="text-[#FFD28A]">新しい版があります：{state.latest.id}（{fmt(state.latest.builtAt)}）</span>}
      {state.kind === 'error' && <span aria-live="polite" className="text-[#FFB4A8]">確認できませんでした</span>}
      <button onClick={clearAndReload} className="underline underline-offset-2">キャッシュを消して更新</button>
    </span>
  );
};
