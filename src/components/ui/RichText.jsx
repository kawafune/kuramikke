import React from 'react';
import { useSite } from '../../context/siteContext';

// 本文中の【要確認】【要人間確認】【要専門家確認】は、
// 開発モードでは見落とさないよう目立つ色で表示し、一般の訪問者には表示しない。
export const RichText = ({ text }) => {
  const { devMode } = useSite();
  return (
    <>
      {text.split(/(【要[^】]*】)/).map((part, i) => {
        if (!/^【要/.test(part)) return <React.Fragment key={i}>{part}</React.Fragment>;
        return devMode
          ? <mark key={i} className="bg-[#FFE3DD] text-accent-red-text text-[0.8em] font-bold px-1 mx-0.5 rounded-sm">{part}</mark>
          : null;
      })}
    </>
  );
};
