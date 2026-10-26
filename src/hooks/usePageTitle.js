import { useEffect } from 'react';

const BASE = 'クラミッケ｜豊かな暮らし情報ミッケ！';

// ページごとにブラウザのタブの名前を変える
export const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title}｜クラミッケ` : BASE;
    return () => { document.title = BASE; };
  }, [title]);
};
