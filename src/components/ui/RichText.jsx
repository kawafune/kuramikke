import React from 'react';
import { useSite } from '../../context/siteContext';

// 本文中の【要確認】【要人間確認】【要専門家確認】は、
// 開発モードでは見落とさないよう目立つ色で表示し、一般の訪問者には表示しない。
// [文字](https://…) と書くと、外部サイトへのリンクになる。
export const RichText = ({ text }) => {
  const { devMode } = useSite();
  return (
    <>
      {text.split(/(【要[^】]*】|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/).map((part, i) => {
        // [表示する文字](https://…)：外部サイトへのリンク
        const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
        if (link) return <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-gold-deep underline underline-offset-4">{link[1]}</a>;
        if (!/^【要/.test(part)) return <React.Fragment key={i}>{part}</React.Fragment>;
        return devMode
          ? <mark key={i} className="bg-[#FFE3DD] text-accent-red-text text-[0.8em] font-bold px-1 mx-0.5 rounded-sm">{part}</mark>
          : null;
      })}
    </>
  );
};
