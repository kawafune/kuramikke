import React from 'react';

// 本文中の【要確認】【要人間確認】は、見落とさないよう目立つ色で表示する（公開前に必ず解消する）
export const RichText = ({ text }) => (
  <>
    {text.split(/(【要[^】]*】)/).map((part, i) => (
      /^【要/.test(part)
        ? <mark key={i} className="bg-[#FFE3DD] text-accent-red-text text-[0.8em] font-bold px-1 mx-0.5 rounded-sm">{part}</mark>
        : <React.Fragment key={i}>{part}</React.Fragment>
    ))}
  </>
);
