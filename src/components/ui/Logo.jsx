import React from 'react';
import logoImg from '../../assets/cralogo.svg';
import mikeImg from '../../assets/mike.svg';

// キャッチ「豊かな暮らし情報ミッケ！」＋文字ロゴ＋三毛猫
export const Logo = ({ size = 'md' }) => {
  const s = size === 'lg'
    ? { catch: 'text-[0.8rem]', logo: 'h-10', mike: 'h-16' }
    : { catch: 'text-[0.6rem] md:text-[0.72rem]', logo: 'h-7 md:h-9', mike: 'h-11 md:h-14' };
  return (
    <span className="inline-flex items-end gap-1">
      <span className="flex flex-col">
        <span className={`font-round text-ink tracking-[0.12em] leading-none mb-1 whitespace-nowrap ${s.catch}`}>
          豊かな暮らし情報ミッケ！
        </span>
        <img src={logoImg} alt="クラミッケ" className={`${s.logo} w-auto`} />
      </span>
      <img src={mikeImg} alt="" aria-hidden="true" className={`${s.mike} w-auto`} />
    </span>
  );
};
