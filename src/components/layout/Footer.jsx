import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import logoImg from '../../assets/cralogo.svg';

export const Footer = ({ onNavigate }) => {
  const footerLinks = {
    'サービスについて': [
      { label: 'トップページ', target: 'TOP' },
      { label: '病院・施設を探す', target: 'SEARCH' },
      { label: 'コミュニティ', target: 'COMMUNITY' },
      { label: 'お役立ちコラム', target: 'COLUMN' },
    ],
    'サポート': [
      { label: 'お知らせ', target: '#' },
      { label: 'ヘルプセンター', target: '#' },
      { label: 'お問い合わせ', target: '#' },
    ],
    '運営情報': [
      { label: '運営会社', target: '#' },
      { label: '利用規約', target: '#' },
      { label: 'プライバシーポリシー', target: '#' },
    ],
  };

  return (
    // ★修正: 背景色を #FFF9EE に変更
    <footer className="bg-[#FFF9EE] pt-12 pb-6 text-primary-light">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          
          {/* 左側：ロゴとSNS */}
          <div className="md:col-span-4 flex flex-col items-start">
            <img src={logoImg} alt="クラミッケ" className="h-10 w-auto mb-6 filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all" />
            <p className="text-sm mb-6 leading-relaxed font-bold">
              地域の病院・介護施設から、<br/>毎日の暮らしを彩るイベントまで。<br/>
              あなたの街の「安心」と「楽しみ」が見つかります。
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white rounded-full text-primary-light hover:text-accent-orange hover:shadow-sm transition-all"><Facebook size={20} /></a>
              <a href="#" className="p-2 bg-white rounded-full text-primary-light hover:text-accent-orange hover:shadow-sm transition-all"><Twitter size={20} /></a>
              <a href="#" className="p-2 bg-white rounded-full text-primary-light hover:text-accent-orange hover:shadow-sm transition-all"><Instagram size={20} /></a>
            </div>
          </div>

          {/* 右側：サイトマップリンク集 */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-bold text-primary mb-4">{category}</h4>
                <ul className="space-y-3 text-sm">
                  {links.map((link, index) => (
                    <li key={index}>
                      <button 
                        onClick={() => link.target !== '#' && onNavigate(link.target)}
                        className="hover:text-accent-green transition-colors text-left font-medium"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 下段：コピーライト */}
        <div className="border-t border-[#E0D8C0] pt-6 text-center text-xs md:text-sm font-bold">
          <p>© {new Date().getFullYear()} Kuramikke. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};