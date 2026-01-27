import React from 'react';
import { ArrowRight } from 'lucide-react';
import searchIco from '../../assets/search_ico.svg';
import circleIco from '../../assets/circle_ico.svg';
// mikeImgのインポートは不要になったので削除しました

export const HeroSectionModern = ({ onTryAccess }) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 px-4 overflow-hidden">
      
      {/* 背景の装飾（モダンな空気感を作る） */}
      {/* ★修正: 左上を黄色(bg-yellow-200)に変更し、スマホ上部が黄色っぽくなるように調整 */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000"></div>
      {/* ★修正: 左下をオレンジ(bg-orange-200)に変更してバランス調整 */}
      <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-orange-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* 左側：メッセージとブランド（情緒的価値） */}
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-2">
              <span className="text-xs font-bold text-[#4F8E5D] tracking-wider">
                🌿 暮らしのお役立ち情報WEBマガジン
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#333] leading-tight tracking-tight font-sans">
              豊かな暮らし<br/>
              情報<span className="text-[#F4A460]">ミッケ！</span>
            </h2>
            
            <p className="text-[#666] text-base md:text-lg font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
              あなたの街の「安心」と「楽しみ」がここにある。<br className="hidden md:block" />
              シニア世代のための新しい情報プラットフォーム。
            </p>

            {/* ★修正: ここにあったクラミケちゃんの画像ブロックを削除しました */}
          </div>

          {/* 右側：アクションカード（機能的価値） */}
          <div className="grid grid-cols-1 gap-5">
            
            {/* 1. 探すカード */}
            <button 
              onClick={() => onTryAccess('SEARCH')}
              className="group relative bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-[32px] shadow-lg hover:shadow-2xl transition-all duration-300 border border-white text-left flex items-center gap-6 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent opacity-0 group-hover:opacity-100 rounded-[32px] transition-opacity duration-300"></div>
              
              <div className="relative p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                <img src={searchIco} alt="探す" className="w-12 h-12 object-contain" />
              </div>
              
              <div className="relative flex-1">
                <span className="text-xs font-bold text-[#4F8E5D] block mb-1">HOSPITALS & FACILITIES</span>
                <h3 className="text-2xl font-bold text-[#333] mb-1 group-hover:text-[#4F8E5D] transition-colors">施設・病院を探す</h3>
                <p className="text-[#666] text-xs md:text-sm font-medium line-clamp-1">診療科目、条件などからぴったりの場所を検索</p>
              </div>

              <div className="relative w-10 h-10 rounded-full bg-[#f9ecd3] flex items-center justify-center text-[#4F8E5D] group-hover:bg-[#4F8E5D] group-hover:text-white transition-all">
                <ArrowRight size={20} />
              </div>
            </button>

            {/* 2. 集まるカード */}
            <button 
              onClick={() => onTryAccess('COMMUNITY')}
              className="group relative bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-[32px] shadow-lg hover:shadow-2xl transition-all duration-300 border border-white text-left flex items-center gap-6 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent opacity-0 group-hover:opacity-100 rounded-[32px] transition-opacity duration-300"></div>
              
              <div className="relative p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                <img src={circleIco} alt="集まる" className="w-12 h-12 object-contain" />
              </div>
              
              <div className="relative flex-1">
                <span className="text-xs font-bold text-[#F4A460] block mb-1">COMMUNITY & EVENTS</span>
                <h3 className="text-2xl font-bold text-[#333] mb-1 group-hover:text-[#F4A460] transition-colors">コミュニティで集まる</h3>
                <p className="text-[#666] text-xs md:text-sm font-medium line-clamp-1">趣味の部活動や地域のイベントに参加しよう</p>
              </div>

              <div className="relative w-10 h-10 rounded-full bg-[#f9ecd3] flex items-center justify-center text-[#F4A460] group-hover:bg-[#F4A460] group-hover:text-white transition-all">
                <ArrowRight size={20} />
              </div>
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};