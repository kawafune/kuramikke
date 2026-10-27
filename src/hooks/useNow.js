import { useEffect, useState } from 'react';

// 一定の間隔で、いまの時刻を更新する（「本日の診療」が、ページを開いたままでも、ずれないように）
export const useNow = (intervalMs = 60000) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
};
