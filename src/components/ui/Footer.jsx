import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-gray-700 pb-8">
          <div className="md:col-span-2">
            <h4 className="font-bold text-xl mb-4 text-green-400">
              クラミッケ
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              豊かな暮らし情報ミッケ！
              <br />
              シニアライフをサポートする、地域密着型・総合情報メディア。
              <br />
              病院検索、介護施設検索、そして地域のコミュニティまで。
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">メニュー</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>病院を探す</li>
              <li>介護施設を探す</li>
              <li>コラムを読む</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">お問い合わせ</h4>
            <button className="bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-6 rounded-lg transition-colors w-full md:w-auto">
              掲載依頼はこちら
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center">
          &copy; Happiino LLC. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};
