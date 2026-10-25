import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

// Xのロゴ（lucideに無いため）
const XLogo = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// 原案のSNS（Google+はサービス終了のため削除、TwitterはXに変更）
const SNS = [
  { name: 'Facebook', bg: 'bg-sns-facebook', Icon: Facebook, fill: true },
  { name: 'X', bg: 'bg-sns-x', Icon: XLogo },
  { name: 'Instagram', bg: 'bg-sns-instagram', Icon: Instagram },
];

export const SnsIcons = ({ size = 'sm' }) => {
  const box = size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  const icon = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  return (
    <ul className="flex items-center gap-2 md:gap-3">
      {SNS.map(({ name, bg, Icon, fill }) => (
        <li key={name}>
          {/* 【要確認】各SNSアカウントのURL */}
          <a href="#" aria-label={`クラミッケの${name}`} className={`${box} ${bg} rounded-full flex items-center justify-center text-white hover:opacity-80`}>
            <Icon className={icon} {...(fill ? { fill: 'currentColor', strokeWidth: 0 } : {})} />
          </a>
        </li>
      ))}
    </ul>
  );
};
