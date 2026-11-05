// Google アナリティクス（GA4）。測定ID（G-XXXXXXXXXX）が設定されているときだけ動く。
// 設定：Vercel の環境変数 VITE_GA_MEASUREMENT_ID（Production）。開発モードの閲覧は、計測しない。
// 計測する内容は、プライバシーポリシー5章に書いてある。個人を特定する情報は送らない（IPアドレスは匿名化される）。
export const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? '';

let loaded = false;

export const initAnalytics = () => {
  if (!GA_ID || loaded || typeof window === 'undefined') return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false, anonymize_ip: true });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
};

export const trackPageView = (path) => {
  if (!GA_ID || !window.gtag) return;
  window.gtag('event', 'page_view', { page_path: path, page_location: window.location.href, page_title: document.title });
};

// 送客の計測：サイトの外へ出るリンクのクリックを、outbound_click として記録する。
// link_type：ad（広告・rel=sponsored）／maps（Googleマップ）／official（公式サイトや公的機関など）。個人情報は送らない。
const linkType = (a, host) => {
  if ((a.rel || '').includes('sponsored')) return 'ad';
  if (/(^|\.)google\.[a-z.]+$/.test(host) && /\/maps|maps\./.test(a.href)) return 'maps';
  if (host.endsWith('calendar.google.com')) return 'calendar';
  return 'official';
};

let outboundBound = false;
export const initOutboundTracking = () => {
  if (outboundBound || typeof document === 'undefined') return;
  outboundBound = true;
  document.addEventListener('click', (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!a || !GA_ID || !window.gtag) return;
    let u;
    try { u = new URL(a.href, window.location.href); } catch { return; }
    if (!/^https?:$/.test(u.protocol) || u.host === window.location.host) return;
    window.gtag('event', 'outbound_click', {
      link_type: linkType(a, u.hostname),
      link_domain: u.hostname,
      link_url: u.origin + u.pathname, // 検索語などのパラメータは送らない
      page_path: window.location.pathname,
    });
  }, true);
};
