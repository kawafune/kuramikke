import { useEffect, useState } from 'react';
import { loadPref } from '../data/medical';
import { loadKaigoPref } from '../data/kaigo';

// 1つの県のデータを読み込む（loader：loadPref＝病院・診療所 / loadKaigoPref＝介護施設）。code が空なら、何もしない
const usePrefLoader = (loader, code) => {
  const [state, setState] = useState({ code: '', items: null, error: false });
  useEffect(() => {
    if (!code) return undefined;
    let alive = true;
    loader(code)
      .then((items) => { if (alive) setState({ code, items, error: false }); })
      .catch(() => { if (alive) setState({ code, items: null, error: true }); });
    return () => { alive = false; };
  }, [loader, code]);
  const ready = state.code === code;
  return { items: code && ready ? state.items : null, loading: Boolean(code) && !ready, error: Boolean(code) && ready && state.error };
};

export const usePrefData = (code) => usePrefLoader(loadPref, code);
export const useKaigoPrefData = (code) => usePrefLoader(loadKaigoPref, code);

// 複数の県をまとめて読み込む（お気に入りなど）。codes は '13,27' のような文字列
export const usePrefsData = (codes) => {
  const [state, setState] = useState({ codes: '', items: null, error: false });
  useEffect(() => {
    if (!codes) return undefined;
    let alive = true;
    Promise.all(codes.split(',').map(loadPref))
      .then((lists) => { if (alive) setState({ codes, items: lists.flat(), error: false }); })
      .catch(() => { if (alive) setState({ codes, items: null, error: true }); });
    return () => { alive = false; };
  }, [codes]);
  const ready = state.codes === codes;
  return { items: codes && ready ? state.items : null, loading: Boolean(codes) && !ready, error: Boolean(codes) && ready && state.error };
};
