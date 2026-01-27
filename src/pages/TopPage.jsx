import React from 'react';
import { Heart, Home, ArrowRight, MapPin, Search } from 'lucide-react';

export const TopPage = ({ onTryAccess }) => {
  return (
    <div className="animate-fade-in bg-bg-warm min-h-[calc(100vh-80px)]">
      
      {/* ★メインエリア：検索への入り口を最優先配置 */}
      <section className="pt-8 pb-12 md:pt-16 md:pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          
          {/* キャッチコピー（控えめに配置） */}
          <div className="text-center mb-8 md:mb-12">
            <span className="inline-block bg-white/80 text-accent-green px-4 py-1 rounded-full text-xs md:text-sm font-bold shadow-sm mb-3 border border-green-100">
              暮らしのお役立ち情報WEBマガジン
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-2 leading-tight">
              豊かな暮らし情報ミッケ！
            </h2>
            <p className="text-primary-light text-sm md:text-base">
              地域の「安心」と「楽しみ」がここにある。
            </p>
          </div>

          {/* ★ここが主役：2大検索ボタン */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* 病院を探す */}
            <button 
              onClick={() => onTryAccess('SEARCH')}
              className="bg-white p-6 md:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all border-b-8 border-accent-green group text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Heart size={120} className="text-accent-green" />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <div className="p-4 bg-green-50 text-accent-green rounded-2xl">
                    <Heart size={40} strokeWidth={2.5} />
                  </div>
                  <div className="bg-accent-green text-white w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowRight size={20} />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-3">病院を探す</h3>
                <p className="text-primary-light mb-6 font-medium">
                  診療科目や現在地から、<br/>信頼できる病院をすぐに検索。
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200">内科</span>
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200">小児科</span>
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200">夜間救急</span>
                </div>
              </div>
            </button>

            {/* 介護施設を探す */}
            <button 
              onClick={() => onTryAccess('SEARCH')}
              className="bg-white p-6 md:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all border-b-8 border-accent-orange group text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Home size={120} className="text-accent-orange" />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <div className="p-4 bg-orange-50 text-accent-orange rounded-2xl">
                    <Home size={40} strokeWidth={2.5} />
                  </div>
                  <div className="bg-accent-orange text-white w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowRight size={20} />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-3">介護施設を探す</h3>
                <p className="text-primary-light mb-6 font-medium">
                  条件や空き状況から、<br/>大切な家族のための施設を探す。
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200">老人ホーム</span>
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200">グループホーム</span>
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200">入居可</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* お知らせ・コラムエリア（背景を白にして区切り） */}
      <section className="bg-white py-16 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-xl font-bold text-primary mb-2">新着コラム & お知らせ</h3>
            <p className="text-sm text-primary-light">シニアライフを豊かにする情報をお届けします</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" onClick={() => onTryAccess('COLUMN')}>
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {/* ダミー画像代わりのグラデーション */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${i === 1 ? 'from-green-100 to-green-50' : i === 2 ? 'from-orange-100 to-orange-50' : 'from-blue-100 to-blue-50'}`}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold opacity-30">Image {i}</div>
                </div>
                <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs bg-bg-warm text-accent-orange font-bold px-2 py-1 rounded">暮らし</span>
                      <span className="text-xs text-gray-400">2026.01.27</span>
                    </div>
                    <h4 className="font-bold text-primary group-hover:text-accent-green transition-colors line-clamp-2">
                      春の訪れを感じる、シニアのための散歩コース特集 {i}
                    </h4>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button className="border-2 border-primary-light text-primary font-bold py-3 px-10 rounded-full hover:bg-primary hover:text-white transition-colors">
              コラム一覧を見る
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};