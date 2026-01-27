import React from 'react';
import { ArrowRight } from 'lucide-react';
import searchIco from '../../assets/search_ico.svg';
import circleIco from '../../assets/circle_ico.svg';

export const HeroSection = ({ onTryAccess }) => {
  return (
    <section className="pt-6 pb-12 md:pt-16 md:pb-16 px-4">
      <div className="container mx-auto max-w-5xl">
        
        <div className="text-center mb-8 md:mb-14">
          <h2 className="text-xl md:text-4xl font-bold text-[#333] mb-2 md:mb-3 leading-tight font-sans">
            豊かな暮らし情報ミッケ！
          </h2>
          <p className="text-[#666] text-xs md:text-lg font-bold">
            あなたの街の「安心」と「楽しみ」がここにある。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-10">
          
          {/* 1. 探す */}
          <button 
            onClick={() => onTryAccess('SEARCH')}
            className="bg-white p-4 md:p-12 rounded-[24px] md:rounded-[40px] shadow-md hover:shadow-xl transition-all border-b-[6px] md:border-b-[10px] border-[#4F8E5D] group text-left relative flex flex-col justify-between h-full"
          >
            <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
              <div className="mb-3 md:mb-6">
                <div className="p-2 bg-green-50 rounded-2xl transition-transform group-hover:scale-105 inline-block">
                  <img src={searchIco} alt="探す" className="w-12 h-12 md:w-20 md:h-20 object-contain" />
                </div>
              </div>
              
              <div className="w-full">
                <span className="text-[#666] text-[10px] md:text-base font-bold block mb-1">
                  施設・病院を
                </span>
                <h3 className="text-xl md:text-4xl font-bold text-[#333] flex items-center justify-center md:justify-start gap-1 md:gap-2">
                  探す <ArrowRight className="text-[#4F8E5D] w-5 h-5 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
                </h3>
              </div>

              <p className="text-[#666] text-sm mt-4 font-bold leading-relaxed hidden md:block text-left">
                診療科目、休日診療、入居条件など<br/>
                あなたにぴったりの場所が見つかります
              </p>
            </div>
          </button>

          {/* 2. 集まる */}
          <button 
            onClick={() => onTryAccess('COMMUNITY')}
            className="bg-white p-4 md:p-12 rounded-[24px] md:rounded-[40px] shadow-md hover:shadow-xl transition-all border-b-[6px] md:border-b-[10px] border-[#F4A460] group text-left relative flex flex-col justify-between h-full"
          >
            <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
              <div className="mb-3 md:mb-6">
                <div className="p-2 bg-orange-50 rounded-2xl transition-transform group-hover:scale-105 inline-block">
                  <img src={circleIco} alt="集まる" className="w-12 h-12 md:w-20 md:h-20 object-contain" />
                </div>
              </div>

              <div className="w-full">
                <span className="text-[#666] text-[10px] md:text-base font-bold block mb-1">
                  コミュニティ
                </span>
                <h3 className="text-xl md:text-4xl font-bold text-[#333] flex items-center justify-center md:justify-start gap-1 md:gap-2">
                  集まる <ArrowRight className="text-[#F4A460] w-5 h-5 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
                </h3>
              </div>

              <p className="text-[#666] text-sm mt-4 font-bold leading-relaxed hidden md:block text-left">
                趣味の部活動や地域のイベント情報<br/>
                新しい仲間との出逢いを探しましょう
              </p>
            </div>
          </button>

        </div>
      </div>
    </section>
  );
};