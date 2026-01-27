import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const ColumnSection = () => {
  // ダミーデータ
  const columns = [
    {
      id: 1,
      category: '終活',
      date: '2026.04.01',
      title: 'エンディングノートをつけてやり残さないという選択。',
      imageColor: 'from-orange-100 to-orange-50',
    },
    {
      id: 2,
      category: 'Life',
      date: '2026.04.05',
      title: '1輪刺しで魅せる「花のある生活」。空間に彩を。',
      imageColor: 'from-green-100 to-green-50',
    },
    {
      id: 3,
      category: '食',
      date: '2026.04.10',
      title: 'お弁当を持ってピクニック。春の陽気を感じて。',
      imageColor: 'from-yellow-100 to-yellow-50',
    },
    {
      id: 4,
      category: '健康',
      date: '2026.04.15',
      title: '毎朝5分のストレッチで変わる、シニアの体調管理。',
      imageColor: 'from-blue-100 to-blue-50',
    },
    {
      id: 5,
      category: '趣味',
      date: '2026.04.20',
      title: '初心者から始める「大人の塗り絵」が脳トレに人気。',
      imageColor: 'from-purple-100 to-purple-50',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  // 画面幅に応じて表示枚数を変更
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 768 ? 3 : 1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, columns.length - itemsPerPage);

  // ★追加: スマホかどうかを判定
  const isMobile = itemsPerPage === 1;

  // ★追加: スライド幅とオフセットの計算
  // スマホなら幅80%、PCならきっちり割る
  const slideWidthPercent = isMobile ? 80 : 100 / itemsPerPage;
  // スマホなら中央寄せのために左右に10%のオフセットを設ける、PCなら0
  const offsetPercent = isMobile ? (100 - slideWidthPercent) / 2 : 0;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="bg-[#fcfcfc] py-16 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative">
        
        <div className="text-center mb-10">
          <h3 className="text-xl md:text-2xl font-bold text-[#C8A040] mb-2 inline-block">
            お役立ちコラム
          </h3>
          <div className="h-1 w-20 bg-[#C8A040] mx-auto rounded-full opacity-50"></div>
        </div>

        {/* カルーセルエリア */}
        <div className="relative group md:px-12">
          
          {/* 矢印ボタン（スマホでは邪魔になるのでPCのみ表示） */}
          <button 
            onClick={prevSlide}
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#C8A040] text-[#C8A040] p-2 rounded-full shadow-md hover:bg-[#C8A040] hover:text-white transition-colors"
            aria-label="前へ"
          >
            <ChevronLeft size={24} />
          </button>

          {/* スライド本体 */}
          {/* スマホの時は親のパディングを無視して画面端まで広げる */}
          <div className={`overflow-hidden py-8 ${isMobile ? '-mx-4' : 'px-4'}`}>
            <div 
              className="flex transition-transform duration-500 ease-out"
              // ★修正: 計算したオフセットと幅を使って移動距離を決定
              style={{ 
                transform: `translateX(calc(${offsetPercent}% - ${currentIndex * slideWidthPercent}%))` 
              }}
            >
              {columns.map((col, index) => (
                <div 
                  key={col.id} 
                  // ★修正: スマホの時はカード間の隙間を少し狭くする
                  className={`flex-shrink-0 transition-all duration-300 ${isMobile ? 'px-2' : 'px-3'} ${
                    // アクティブじゃないスライドを少し小さく・薄くする演出（スマホのみ）
                    isMobile && index !== currentIndex ? 'scale-90 opacity-70' : 'scale-100 opacity-100'
                  }`}
                  // ★修正: 計算した幅を適用
                  style={{ width: `${slideWidthPercent}%` }}
                >
                  <div className="bg-white rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group/card flex flex-col h-full border border-gray-100 overflow-hidden h-[320px]">
                    {/* 画像エリア */}
                    <div className={`h-40 w-full bg-gradient-to-br ${col.imageColor} relative flex-shrink-0`}>
                      <div className="absolute inset-0 flex items-center justify-center text-white/60 font-bold">
                        No Image
                      </div>
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#C8A040] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        {col.category}
                      </span>
                    </div>
                    
                    {/* テキストエリア */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-2 text-right">
                         <span className="text-[#999] text-xs font-bold tracking-widest">{col.date}</span>
                      </div>

                      <h4 className="text-[#333] font-bold text-sm leading-relaxed mb-2 group-hover/card:text-[#C8A040] transition-colors line-clamp-2">
                        {col.title}
                      </h4>
                      
                      <div className="mt-auto flex justify-end">
                         <div className="w-8 h-8 rounded-full bg-[#f9ecd3] flex items-center justify-center text-[#C8A040] group-hover/card:bg-[#C8A040] group-hover/card:text-white transition-colors">
                           <ArrowRight size={16} />
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右矢印ボタン（PCのみ） */}
          <button 
            onClick={nextSlide}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#C8A040] text-[#C8A040] p-2 rounded-full shadow-md hover:bg-[#C8A040] hover:text-white transition-colors"
            aria-label="次へ"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* インジケーター */}
        <div className="flex justify-center gap-2 mt-4 md:mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === index 
                  ? 'w-4 h-4 bg-[#C8A040]'
                  : 'w-3 h-3 bg-[#E0D8C0] hover:bg-[#C8A040]/70'
              }`}
              aria-label={`スライド ${index + 1} へ移動`}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="bg-[#C8A040] text-white font-bold py-3 px-12 rounded-full hover:opacity-90 transition-opacity shadow-md flex items-center gap-2 mx-auto">
            コラム一覧を見る <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};