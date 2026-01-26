import React from 'react';

export const SearchPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-green-800 flex items-center gap-2">
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm">
            認証済み
          </span>
          病院・介護施設検索機能
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          現在、Google Maps API連携および詳細条件フィルター機能を実装中です。
          <br />
          「ちぃくり」で使用したマップコンポーネントをここに移植します。
        </p>

        {/* 開発用プレースホルダー */}
        <div className="w-full h-96 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
          <p className="text-gray-400 font-bold z-10">
            Map Component Loading...
          </p>
          <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        </div>
      </div>
    </div>
  );
};
