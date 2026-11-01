import { useEffect, useState } from 'react';
import { loadIndex, PREF_CODES } from '../data/medical';
import { loadKaigoIndex } from '../data/kaigo';

// 都道府県を選んだときの、市区町村の一覧。県ごとの大きなデータを読まずに、小さな index.json だけで出す。
// kind：'hospital'（病院・診療所）／'nursing'（老人ホーム・介護施設）
export const useCities = (kind, pref) => {
  const [indexes, setIndexes] = useState({});
  useEffect(() => {
    let alive = true;
    const load = kind === 'nursing' ? loadKaigoIndex : loadIndex;
    load().then((v) => { if (alive) setIndexes((prev) => ({ ...prev, [kind]: v })); }).catch(() => {});
    return () => { alive = false; };
  }, [kind]);
  const code = PREF_CODES[pref];
  return (code && indexes[kind]?.prefs?.[code]?.cities) || [];
};
