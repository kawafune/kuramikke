import React from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import mikeImg from '../assets/mike.svg';

// 原案から作り直す前のページ用の仮画面
export const ComingSoonPage = ({ title, onBack }) => (
  <div className="max-w-content mx-auto px-4 py-16 md:py-24 text-center">
    <SectionTitle as="h1">{title}</SectionTitle>
    <img src={mikeImg} alt="" aria-hidden="true" className="h-24 w-auto mx-auto mb-6" />
    <p className="mb-10">このページは、ただいま準備中です。</p>
    <Button onClick={onBack}>TOPページへ戻る</Button>
  </div>
);
