import React from 'react';
import { Heart } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import { HospitalCard } from '../components/search/HospitalCard';
import { usePageTitle } from '../hooks/usePageTitle';
import { useFavorites } from '../hooks/useFavorites';
import { usePrefsData } from '../hooks/useMedical';
import { prefCodeOfId } from '../data/medical';

// お気に入りの病院（この端末に保存したもの）
export const FavoritesPage = () => {
  usePageTitle('お気に入りの病院');
  const { ids } = useFavorites();
  const codes = [...new Set(ids.map(prefCodeOfId))].sort().join(',');
  const { items, loading, error } = usePrefsData(codes);
  const list = ids.map((id) => items?.find((x) => x.id === id)).filter(Boolean);

  return (
    <>
      <Breadcrumb items={[{ label: '病院・介護施設を探す', to: '/search' }, { label: 'お気に入り' }]} />
      <div className="max-w-content mx-auto px-4 py-10 md:py-14">
        <SectionTitle as="h1">お気に入りの病院</SectionTitle>
        <p className="mb-6 bg-cream-50 p-4 text-[0.85rem] leading-relaxed">
          お気に入りは、いまお使いの<strong>この端末の中にだけ</strong>保存されます。クラミッケのサーバーには送りません。
          端末を変えたり、ブラウザの履歴を消したりすると、消えることがあります。
        </p>
        {loading ? (
          <p className="text-center py-10" role="status">読み込んでいます…</p>
        ) : error ? (
          <p className="text-center py-10">データを読み込めませんでした。通信を確認して、もう一度お試しください。</p>
        ) : list.length === 0 ? (
          <div className="bg-white border border-gold p-8 text-center">
            <Heart className="mx-auto mb-2 text-accent-red-text" aria-hidden="true" />
            <p className="mb-5">まだ、お気に入りの病院はありません。<br />病院の「お気に入りに追加」を押すと、ここに並びます。</p>
            <Button to="/search" icon={null}>病院を探す</Button>
          </div>
        ) : (
          <ul className="grid gap-5">{list.map((h) => <HospitalCard key={h.id} h={h} />)}</ul>
        )}
      </div>
    </>
  );
};
