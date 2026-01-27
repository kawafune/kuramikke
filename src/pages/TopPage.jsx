import React from 'react';
import { HeroSectionModern } from '../components/home/HeroSectionModern';
import { ColumnSection } from '../components/home/ColumnSection';

export const TopPage = ({ onTryAccess }) => {
  return (
    <div className="animate-fade-in bg-[#f9ecd3] min-h-[calc(100vh-80px)]">
      {/* ヒーローエリア（検索ボタンなど） */}
      <HeroSectionModern onTryAccess={onTryAccess} />
      
      {/* コラムエリア */}
      <ColumnSection />
    </div>
  );
};