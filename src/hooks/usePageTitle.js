import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 正規のURL（検索エンジンに、どれが本物のページかを伝える）。開発用のURL（vercel.app）で見ても、正規のURLを指す
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://kura-mikke.com').replace(/\/$/, '');

const BASE = 'クラミッケ｜豊かな暮らし情報ミッケ！';

// ページごとにブラウザのタブの名前を変える
// description を渡すと、そのページの「検索結果に出る説明文（meta description）」になる。なければ、サイト全体の説明文のまま
export const usePageTitle = (title, description) => {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = title ? `${title}｜クラミッケ` : BASE;
    return () => { document.title = BASE; };
  }, [title]);
  useEffect(() => {
    if (!description) return undefined;
    const meta = document.querySelector('meta[name="description"]');
    if (!meta) return undefined;
    const before = meta.getAttribute('content');
    meta.setAttribute('content', description);
    return () => meta.setAttribute('content', before ?? '');
  }, [description]);
  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
  }, [pathname]);
};
