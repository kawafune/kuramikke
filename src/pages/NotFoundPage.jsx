import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { usePageTitle } from '../hooks/usePageTitle';

// 原案 00_404notfound
export const NotFoundPage = () => {
  usePageTitle('ページが見つかりません');
  return (
    <div className="max-w-content mx-auto px-4 py-16 md:py-24 text-center">
      <p className="text-gold-deep font-round font-bold tracking-[0.15em] mb-4">404 NOT FOUND</p>
      <h1 className="text-[1.4rem] md:text-[1.6rem] text-ink mb-8">ページが見つかりません</h1>
      <p className="mb-10 text-[0.95rem]">
        こちらのページは削除された、またはURL（ページのアドレス）が変更された可能性がございます。<br className="hidden md:block" />
        このページをブックマーク登録されていた方は、お手数ですがブックマークの変更をお願いいたします。
      </p>
      <Button to="/" icon="arrow">TOPページへ戻る</Button>
      <p className="mt-6"><Link to="/shukatsu" className="text-gold-deep underline underline-offset-4 text-[0.9rem]">終活サポートを見る</Link></p>
    </div>
  );
};
