import React from 'react';
import { NavTiles } from '../components/home/NavTiles';
import { ColumnSection } from '../components/home/ColumnSection';
import { FacilitySearchSection } from '../components/home/FacilitySearchSection';
import { CommunitySection } from '../components/home/CommunitySection';
import { ListingBanner } from '../components/home/ListingBanner';
import { AdBanner } from '../components/ui/AdBanner';

// TOPの構成は docs/design/spec.md 7章（原案 00_global_TOP）
export const TopPage = ({ onTryAccess }) => (
  <>
    <h1 className="sr-only">クラミッケ｜病院・介護施設検索と暮らしのお役立ち情報WEBマガジン</h1>
    <NavTiles onNavigate={onTryAccess} />

    <div className="max-w-content mx-auto px-4 py-5">
      <AdBanner className="h-[60px] md:h-[75px]" />
    </div>

    <ColumnSection onNavigate={onTryAccess} />

    <div className="max-w-content mx-auto px-4 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
      {/* スマホでは1枠だけにして、縦に間延びしないようにする */}
      {[0, 1, 2].map((i) => <AdBanner key={i} className={`h-[70px] md:h-[90px] ${i > 0 ? 'hidden sm:flex' : ''}`} />)}
    </div>

    <FacilitySearchSection onNavigate={onTryAccess} />
    <CommunitySection onNavigate={onTryAccess} />

    <div className="max-w-content mx-auto px-4 pb-12 md:pb-16">
      <ListingBanner />
      <AdBanner className="h-[60px] md:h-[75px] mt-5" />
    </div>
  </>
);
