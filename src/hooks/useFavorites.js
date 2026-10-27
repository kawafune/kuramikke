import { useSyncExternalStore } from 'react';
import { getFavorites, subscribeFavorites, toggleFavorite } from '../lib/favorites';

const EMPTY = [];

export const useFavorites = () => {
  const ids = useSyncExternalStore(subscribeFavorites, getFavorites, () => EMPTY);
  return { ids, toggle: toggleFavorite, has: (id) => ids.includes(id) };
};
