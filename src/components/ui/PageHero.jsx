import React from 'react';

// ページ上部の帯。原案は写真の中央に「ゴールドの四角ラベル」。写真が決まるまでは無地のクリーム色
export const PageHero = ({ title, image }) => (
  <div className="relative flex items-center justify-center h-[150px] md:h-[210px] bg-cream-200 overflow-hidden">
    {image && <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />}
    <h1 className="relative bg-gold-deep/90 text-white px-8 py-5 md:px-10 md:py-8 text-center font-round font-bold text-[1.1rem] md:text-[1.3rem] tracking-[0.15em] leading-snug outline outline-1 outline-white/70 -outline-offset-[6px]">
      {title}
    </h1>
  </div>
);
