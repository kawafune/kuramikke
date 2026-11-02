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
