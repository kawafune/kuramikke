import React from 'react';
import { Link } from 'react-router-dom';
import { CircleArrowRight } from 'lucide-react';
import logoImg from '../../assets/cralogo.svg';
import mikeImg from '../../assets/mike.svg';
import hospitalIco from '../../assets/search_ico.svg';

// 掲載依頼バナー（施設運営者向け）。画像にせずHTMLで組み、文字を読み上げ・拡大できるようにする
export const ListingBanner = () => (
  <Link to="/business" className="group block relative mt-4 md:mt-6 pt-7">
    {/* 見出しタブ */}
    <span className="absolute top-0 left-0 bg-white border border-b-0 border-gold px-4 md:px-5 pt-1 pb-0.5 font-round font-bold text-gold-deep text-[0.75rem] md:text-[0.85rem] tracking-[0.1em]">
      病院・介護施設運営者のみなさまへ
    </span>
    <span className="block border border-gold bg-white px-4 md:px-10 pt-6 pb-12 md:pb-10 group-hover:bg-cream-50 transition-colors">
      <span className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <span className="flex-1">
          <span className="flex items-end gap-2 md:gap-4">
            <img src={logoImg} alt="クラミッケ" className="h-8 md:h-12 w-auto" />
            <span className="font-round font-bold text-[0.9rem] md:text-[1.1rem]">に</span>
            <img src={hospitalIco} alt="" aria-hidden="true" className="h-10 md:h-14 w-auto ml-auto md:ml-4" />
            <img src={mikeImg} alt="" aria-hidden="true" className="h-12 md:h-16 w-auto" />
          </span>
          <span className="block mt-3 font-round font-bold text-[1.05rem] md:text-[1.6rem] tracking-[0.08em] leading-snug">
            <span className="text-[#2E8FA8]">病院</span>・<span className="text-[#8A5A33]">施設情報</span>を
            <span className="text-accent-red-text">掲載</span>しませんか？
          </span>
        </span>
        {/* 料金は、掲載のご案内（/business）で説明する。ここでは「無料」とは書かない */}
        <span className="flex justify-center md:-mr-4">
          <span className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-accent-red-text text-white flex flex-col items-center justify-center text-center font-round font-bold leading-tight text-[0.95rem] md:text-[1.15rem]">
            募集開始の<span className="text-[1.15rem] md:text-[1.5rem]">特典</span>あり
          </span>
        </span>
      </span>
    </span>
    <span className="absolute right-0 bottom-0 flex items-center gap-1.5 bg-gold-deep text-white font-round font-bold text-[0.8rem] pl-6 pr-3 py-1.5 [clip-path:polygon(14px_0,100%_0,100%_100%,0_100%)]">
      詳しくはこちら <CircleArrowRight size={16} aria-hidden="true" />
    </span>
  </Link>
);
