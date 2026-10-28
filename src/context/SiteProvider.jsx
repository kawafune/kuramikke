import React, { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SiteContext } from './siteContext';
import { AUTH_KEY, HOME, READY, TARGET_PATH } from '../config/site';

const pathToTarget = (p) => {
  if (p === '/') return 'TOP';
  if (p.startsWith('/shukatsu')) return 'SHUKATSU';
  if (p.startsWith('/search')) return 'SEARCH';
  if (p.startsWith('/column')) return 'COLUMN';
  if (p.startsWith('/community')) return 'COMMUNITY';
  return null;
};

const readAuth = () => {
  try { return localStorage.getItem(AUTH_KEY) === 'true'; } catch { return false; }
};

// 開発モード（パスワードを入れた人だけ、公開前の画面も見られる）と、ページ移動をまとめて管理する
export const SiteProvider = ({ children }) => {
  const [devMode, setDevMode] = useState(readAuth);
  const [loginOpen, setLoginOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAvailable = useCallback((target) => Boolean(READY[target]) || devMode, [devMode]);

  const go = useCallback((target) => {
    if (TARGET_PATH[target] && isAvailable(target)) navigate(TARGET_PATH[target]);
  }, [isAvailable, navigate]);

  const login = useCallback(() => {
    try { localStorage.setItem(AUTH_KEY, 'true'); } catch { /* 保存できなくても、この画面の間は有効 */ }
    setDevMode(true);
    setLoginOpen(false);
  }, []);

  const logout = useCallback(() => {
    try { localStorage.removeItem(AUTH_KEY); } catch { /* 何もしない */ }
    setDevMode(false);
    navigate('/');
  }, [navigate]);

  const value = useMemo(() => ({
    devMode,
    pathname,
    currentTarget: pathToTarget(pathname),
    // 大きなタイル型ナビを持つのはポータル型のTOPだけ（そのときヘッダー下段のメニューは出さない）
    showTileNav: (pathname === '/' && (HOME === 'portal' || devMode)) || pathname === '/portal',
    isAvailable,
    go,
    openLogin: () => setLoginOpen(true),
    closeLogin: () => setLoginOpen(false),
    loginOpen,
    login,
    logout,
  }), [devMode, pathname, isAvailable, go, loginOpen, login, logout]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};
