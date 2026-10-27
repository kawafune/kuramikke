import React from 'react';
import { Siren } from 'lucide-react';
import { RichText } from '../ui/RichText';

// 救急の案内。検索の画面は、いのちにかかわるときに使うものではないことを、はじめに伝える。
// 119 などは、押し間違いで電話がかからないよう、リンクにはしない。
export const EmergencyNotice = ({ compact = false }) => (
  <aside
    aria-label="お急ぎの方へ"
    className={`border-2 border-accent-red-text bg-[#FFF1EE] ${compact ? 'p-3 text-[0.8rem]' : 'p-4 md:p-5 text-[0.9rem]'} leading-relaxed`}
  >
    <p className="flex items-center gap-2 font-round font-bold text-accent-red-text mb-1">
      <Siren size={compact ? 18 : 22} aria-hidden="true" />お急ぎのときは
    </p>
    <ul className="space-y-0.5">
      <li>いのちにかかわるときは、迷わず<strong className="mx-1 text-[1.1em]">119番</strong>へ。</li>
      <li>救急車を呼ぶか迷うときは「<strong>#7119</strong>」（救急安心センター。実施していない地域があります）。</li>
      <li>お子さまのことは「<strong>#8000</strong>」（子ども医療電話相談）。</li>
    </ul>
    <p className="mt-1 text-[0.75rem]"><RichText text="このサイトは、診療の予約や、緊急のご相談を受けるものではありません。【要確認：電話番号・対応時間・実施地域は、公式の最新情報で確認する】" /></p>
  </aside>
);
