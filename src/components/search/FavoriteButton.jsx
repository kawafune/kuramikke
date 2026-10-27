import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';

// お気に入りボタン。押すと、この端末に保存される（ログイン不要）
export const FavoriteButton = ({ id, name, className = '' }) => {
  const { has, toggle } = useFavorites();
  const on = has(id);
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); toggle(id); }}
      aria-pressed={on}
      aria-label={on ? `${name}をお気に入りから外す` : `${name}をお気に入りに追加する`}
      className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded border-2 font-round font-bold text-[0.85rem] ${on ? 'bg-accent-red-text border-accent-red-text text-white' : 'bg-white border-accent-red-text text-accent-red-text hover:bg-[#FFF1EE]'} ${className}`}
    >
      <Heart size={18} fill={on ? 'currentColor' : 'none'} aria-hidden="true" />
      {on ? 'お気に入り済み' : 'お気に入りに追加'}
    </button>
  );
};
