import React from 'react';
import {
  CircleArrowRight, Hospital, Stethoscope, CalendarDays, Moon, Clock, MapPin, Microscope, HeartPulse,
  House, Building2, DoorOpen, Accessibility, Target, Timer, Sparkles,
} from 'lucide-react';
import { SectionTitle } from '../ui/SectionTitle';

import { Link } from 'react-router-dom';
import { useSite } from '../../context/siteContext';

// アイコンは原案イラスト受領までの仮（色は原案の雰囲気に寄せた）
// to があるものだけが、公開表示に出る。to が無いものは、開発モードでだけ「準備中」として並べる
const HOSPITAL_LINKS = [
  { label: '病院検索トップ', Icon: Hospital, color: 'text-[#4BB4C8]', to: '/search' },
  { label: '診療科目', Icon: Stethoscope, color: 'text-[#5E9BD6]', to: '/search' },
  { label: '休日診療', Icon: CalendarDays, color: 'text-[#5E9BD6]', to: '/search/results?f=holiday' },
  { label: '夜間も受付', Icon: Moon, color: 'text-[#3A3A8C]', to: '/search/results?f=night' },
  { label: '本日診療可', Icon: Clock, color: 'text-[#5E9BD6]', to: '/search/results?now=1' },
  { label: 'マップから探す', Icon: MapPin, color: 'text-accent-red' },
  { label: '専門外来を探す', Icon: Microscope, color: 'text-[#4BB4C8]' },
  { label: '特徴から探す', Icon: HeartPulse, color: 'text-[#F08A9C]', to: '/search/results' },
];
// 老人ホーム：実データ（介護サービス情報公表システム）を取り込み済み。費用・入居状況などのデータはまだ無いので、その検索は準備中
const CARE_LINKS = [
  { label: '介護施設検索トップ', Icon: House, color: 'text-[#B07A4F]', to: '/search/nursing' },
  { label: '施設種別', Icon: Building2, color: 'text-accent-red', to: '/search/nursing' },
  { label: '今すぐ入居可能', Icon: DoorOpen, color: 'text-[#4BB4C8]' },
  { label: '看護・医療体制から探す', Icon: Accessibility, color: 'text-[#5E9BD6]' },
  { label: '目的から探す', Icon: Target, color: 'text-[#7DB54A]' },
  { label: 'マップから探す', Icon: MapPin, color: 'text-accent-red' },
  { label: '特徴から探す', Icon: Timer, color: 'text-accent-red' },
  { label: '新規開設施設', Icon: Sparkles, color: 'text-accent-red' },
];

const cell = 'group w-full h-full min-h-[64px] md:min-h-[70px] flex items-center gap-2 md:gap-3 px-3 md:px-4 border border-gold rounded text-left';

const LinkGrid = ({ title, links }) => {
  const { devMode } = useSite();
  const shown = devMode ? links : links.filter((l) => l.to);
  if (shown.length === 0) return null;
  return (
    <div className="mb-8">
      <h3 className="text-gold-deep text-[1rem] tracking-[0.12em] mb-3">{title}</h3>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-[9px]">
        {shown.map(({ label, Icon, color, to }) => (
          <li key={label}>
            {to ? (
              <Link to={to} className={`${cell} bg-white hover:bg-cream-50`}>
                <Icon size={28} strokeWidth={1.6} className={`shrink-0 ${color}`} aria-hidden="true" />
                <span className="flex-1 font-round font-bold text-[0.8rem] md:text-[0.85rem] leading-snug">{label}</span>
                <CircleArrowRight size={18} className="shrink-0 text-gold-deep transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            ) : (
              <span aria-disabled="true" className={`${cell} bg-cream-50 opacity-60`}>
                <Icon size={28} strokeWidth={1.6} className={`shrink-0 ${color}`} aria-hidden="true" />
                <span className="flex-1 font-round font-bold text-[0.8rem] md:text-[0.85rem] leading-snug">{label}<span className="ml-1 text-[0.65rem] bg-cream-200 px-1.5 py-0.5 whitespace-nowrap">準備中</span></span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const FacilitySearchSection = () => (
  <section className="py-12 md:py-14 px-4">
    <div className="max-w-content mx-auto">
      <SectionTitle>病院・介護施設を探す</SectionTitle>
      <LinkGrid title="病院を探す" links={HOSPITAL_LINKS} />
      <LinkGrid title="介護施設を探す" links={CARE_LINKS} />
    </div>
  </section>
);
