import React from 'react';
import { FEATURE_LIST } from '../../data/hospitals';

// 特徴アイコン（夜間診療可・休日診療可・女医・駐車場・カード可）。持っているものだけ出す
export const FeatureIcons = ({ features, className = '' }) => (
  <ul className={`flex flex-wrap gap-x-4 gap-y-2 ${className}`}>
    {FEATURE_LIST.filter((f) => features.includes(f.key)).map(({ key, label, Icon }) => (
      <li key={key} className="flex items-center gap-1.5 text-[0.8rem] font-round font-bold">
        <span className="w-7 h-7 rounded bg-gold-deep text-white flex items-center justify-center"><Icon size={16} aria-hidden="true" /></span>
        {label}
      </li>
    ))}
  </ul>
);
