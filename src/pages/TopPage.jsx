import React from 'react';
import { NavTiles } from '../components/home/NavTiles';
import { FacilitySearchSection } from '../components/home/FacilitySearchSection';
import { ShukatsuBanner } from '../components/home/ShukatsuBanner';
import { ColumnSection } from '../components/home/ColumnSection';
import { CommunitySection } from '../components/home/CommunitySection';
import { ListingBanner } from '../components/home/ListingBanner';
import { AdBanner } from '../components/ui/AdBanner';
import { useSite } from '../context/siteContext';
import { BUSINESS_BY_PATH } from '../data/businessPages';

// TOPの構成：タイル → 病院・介護施設を探す（検索窓つき） → 終活ガイド → コラム → 絆を見つける → 掲載のご案内
// 公開表示では、準備ができていないもの（仮の内容・広告枠・公開前のページ）は出さない。開発モードでは、すべて出す。
export const TopPage = ({ onTryAccess }) => {
  const { devMode, isAvailable } = useSite();
  const searchOpen = devMode || isAvailable('SEARCH');
  const columnOpen = devMode || isAvailable('COLUMN');
  const communityOpen = devMode || isAvailable('COMMUNITY');
  const businessOpen = devMode || BUSINESS_BY_PATH['/business'].published;

  return (
    <>
      <h1 className="sr-only">クラミッケ｜病院・介護施設検索と暮らしのお役立ち情報WEBマガジン</h1>
      <NavTiles onNavigate={onTryAccess} />

      {devMode && (
        <div className="max-w-content mx-auto px-4 py-3">
          <AdBanner className="h-[50px] md:h-[60px]" />
        </div>
      )}

      {searchOpen && <FacilitySearchSection />}
      <ShukatsuBanner />

      {columnOpen && <ColumnSection onNavigate={onTryAccess} />}
      {devMode && (
        <div className="max-w-content mx-auto px-4 py-5 md:py-6 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {/* スマホでは1枠だけにして、縦に間延びしないようにする */}
          {[0, 1, 2].map((i) => <AdBanner key={i} className={`h-[70px] md:h-[90px] ${i > 0 ? 'hidden sm:flex' : ''}`} />)}
        </div>
      )}

      {communityOpen && <CommunitySection onNavigate={onTryAccess} />}

      {businessOpen && (
        <div className="max-w-content mx-auto px-4 pb-12 md:pb-16">
          <ListingBanner />
          {devMode && <AdBanner className="h-[60px] md:h-[75px] mt-5" />}
        </div>
      )}
    </>
  );
};
