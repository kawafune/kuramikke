import React from 'react';
import { Link } from 'react-router-dom';
import { CircleArrowRight } from 'lucide-react';
import shukatsuIco from '../../assets/nav_shukatsu.svg';

// 終活ガイドへの入口。「病院・介護施設を探す」の下に置く（探している人が、次に必要になりやすい情報）
export const ShukatsuBanner = () => (
  <section aria-labelledby="shukatsu-banner-title" className="max-w-content mx-auto px-4 pb-12 md:pb-14">
    <Link to="/shukatsu" className="group flex flex-col md:flex-row items-center gap-4 md:gap-8 bg-cream-100 border border-gold px-5 md:px-10 py-6 hover:bg-cream-200 transition-colors">
      <img src={shukatsuIco} alt="" aria-hidden="true" className="h-14 md:h-16 w-auto shrink-0" />
      <span className="flex-1 text-center md:text-left">
        <span id="shukatsu-banner-title" className="block font-round font-bold text-gold-deep text-[1.1rem] md:text-[1.25rem] tracking-[0.08em]">終活ガイド｜ご家族のために、ご自身のために</span>
        <span className="block mt-1 text-[0.9rem]">葬儀・お墓・相続・遺品整理など、いま必要になったことも、これから備えたいことも。やさしい言葉でご案内します。</span>
      </span>
      <span className="flex items-center gap-1.5 bg-gold-deep text-white font-round font-bold text-[0.9rem] px-5 py-2 rounded shrink-0">
        ガイドを見る <CircleArrowRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  </section>
);
