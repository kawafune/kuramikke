import React from 'react';
import topIco from '../assets/nav_top.svg';
import columnIco from '../assets/nav_column.svg';
import shukatsuIco from '../assets/nav_shukatsu.svg';
import hospitalIco from '../assets/search_ico.svg';
import meetIco from '../assets/circle_ico.svg';

// 原案の5メニュー（spec 6章）。icon は原案イラストのSVG
export const NAV_ITEMS = [
  { target: 'TOP', label: 'TOPページ', desc: 'トップページに戻る', icon: topIco },
  { target: 'SEARCH', label: '病院・介護施設を探す', desc: '病院・介護施設探しをお手伝いします。', icon: hospitalIco },
  { target: 'COLUMN', label: 'コラムを読む', desc: '暮らしを豊かにしてくれるコラムのご紹介', icon: columnIco },
  { target: 'COMMUNITY', label: '出逢いを探す', desc: 'イベント情報やコミュニティのご紹介', icon: meetIco },
  { target: 'SHUKATSU', label: '終活サポート', desc: 'エンディングノートを書きませんか？', icon: shukatsuIco },
];

export const NavIcon = ({ item, className = 'h-6' }) => (
  <img src={item.icon} alt="" aria-hidden="true" className={`${className} w-auto`} />
);

export const PREFECTURES = [
  '北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島', '栃木', '群馬', '茨城', '埼玉', '千葉', '東京', '神奈川', '新潟', '富山',
  '石川', '福井', '山梨', '長野', '静岡', '岐阜', '愛知', '三重', '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山', '鳥取', '島根',
  '岡山', '広島', '山口', '徳島', '香川', '愛媛', '高知', '福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄',
];
