import React from 'react';
import { Heart, Home, ArrowRight } from 'lucide-react';
import mikeChan from '../assets/mike.svg'; // ★クラミケちゃんをインポート

export const TopPage = ({ onTryAccess }) => {
  return (
    <div className="animate-fade-in">
      {/* ヒーローエリア */}
      <section className="bg-gradient-to-b from-green-50 to-white py-12 md:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* ★ここにクラミケちゃんを配置！ */}
          <div className="mb-6 flex justify-center">
            <img
              src={mikeChan}
              alt="クラミケちゃん"
              className="h-32 md:h-40 w-auto drop-shadow-xl animate-bounce-slow"
            />
          </div>

          <span className="inline-block bg-white text-green-600 px-4 py-1 rounded-full text-sm font-bold shadow-sm mb-4 border border-green-100">
            暮らしのお役立ち情報WEBマガジン
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            豊かな暮らし情報
            <br className="md:hidden" />
            ミッケ！
          </h2>
          <p className="text-gray-500 mb-10 max-w-lg mx-auto">
            地域の病院・介護施設から、毎日の暮らしを彩るイベントまで。
            <br />
            あなたの街の「安心」と「楽しみ」が見つかります。
          </p>
        </div>

        {/* 背景装飾（オプション） */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
          <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-200 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* ... (以下、検索ボタンやコラム部分は変更なし) ... */}
      <section className="bg-white pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto -mt-8 relative z-10">
            <button
              onClick={() => onTryAccess('SEARCH')}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-b-4 border-green-500 group text-left transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-4 bg-green-100 text-green-600 rounded-2xl">
                  <Heart size={32} />
                </div>
                <ArrowRight className="text-gray-300 group-hover:text-green-500 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                病院を探す
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                診療科目、休日診療、夜間救急など。
                <br />
                現在地からのマップ検索も可能です。
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  内科
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  整形外科
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  眼科
                </span>
              </div>
            </button>

            <button
              onClick={() => onTryAccess('SEARCH')}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-b-4 border-orange-500 group text-left transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl">
                  <Home size={32} />
                </div>
                <ArrowRight className="text-gray-300 group-hover:text-orange-500 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                介護施設を探す
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                特別養護老人ホーム、グループホームなど。
                <br />
                入居条件や特徴から探せます。
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  入居可
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  認知症対応
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold text-gray-800 mb-8 text-center">
            新着コラム
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onTryAccess('COLUMN')}
              >
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold">
                    Image
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-orange-500 font-bold">
                    暮らし
                  </span>
                  <h4 className="font-bold text-gray-800 mt-2 mb-2">
                    春の訪れを感じる、シニアのための散歩コース {i}
                  </h4>
                  <p className="text-xs text-gray-400">2026.01.27</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
