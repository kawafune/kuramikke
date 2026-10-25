import React from 'react';
import {
  CircleArrowRight, Hospital, Stethoscope, CalendarDays, Moon, Clock, MapPin, Microscope, HeartPulse,
  House, Building2, DoorOpen, Accessibility, Target, Timer, Sparkles,
} from 'lucide-react';
import { SectionTitle } from '../ui/SectionTitle';

// アイコンは原案イラスト受領までの仮（色は原案の雰囲気に寄せた）
const HOSPITAL_LINKS = [
  { label: '病院検索トップ', Icon: Hospital, color: 'text-[#4BB4C8]' },
  { label: '診療科目', Icon: Stethoscope, color: 'text-[#5E9BD6]' },
  { label: '休日診療', Icon: CalendarDays, color: 'text-[#5E9BD6]' },
  { label: '夜間救急診療', Icon: Moon, color: 'text-[#3A3A8C]' },
  { label: '本日診療可', Icon: Clock, color: 'text-[#5E9BD6]' },
  { label: 'マップから探す', Icon: MapPin, color: 'text-accent-red' },
  { label: '専門外来を探す', Icon: Microscope, color: 'text-[#4BB4C8]' },
  { label: '特徴から探す', Icon: HeartPulse, color: 'text-[#F08A9C]' },
];
const CARE_LINKS = [
  { label: '介護施設検索トップ', Icon: House, color: 'text-[#B07A4F]' },
  { label: '施設種別', Icon: Building2, color: 'text-accent-red' },
  { label: '今すぐ入居可能', Icon: DoorOpen, color: 'text-[#4BB4C8]' },
  { label: '看護・医療体制から探す', Icon: Accessibility, color: 'text-[#5E9BD6]' },
  { label: '目的から探す', Icon: Target, color: 'text-[#7DB54A]' },
  { label: 'マップから探す', Icon: MapPin, color: 'text-accent-red' },
  { label: '特徴から探す', Icon: Timer, color: 'text-accent-red' },
  { label: '新規開設施設', Icon: Sparkles, color: 'text-accent-red' },
];

const LinkGrid = ({ title, links, onNavigate }) => (
  <div className="mb-8">
    <h3 className="text-gold-deep text-[1rem] tracking-[0.12em] mb-3">{title}</h3>
    <ul className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-[9px]">
      {links.map(({ label, Icon, color }) => (
        <li key={label}>
          <button
            onClick={() => onNavigate('SEARCH')}
            className="group w-full h-full min-h-[64px] md:min-h-[70px] flex items-center gap-2 md:gap-3 px-3 md:px-4 bg-white border border-gold rounded text-left hover:bg-cream-50"
          >
            <Icon size={28} strokeWidth={1.6} className={`shrink-0 ${color}`} aria-hidden="true" />
            <span className="flex-1 font-round font-bold text-[0.8rem] md:text-[0.85rem] leading-snug">{label}</span>
            <CircleArrowRight size={18} className="shrink-0 text-gold-deep transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export const FacilitySearchSection = ({ onNavigate }) => (
  <section className="py-12 md:py-14 px-4">
    <div className="max-w-content mx-auto">
      <SectionTitle>病院・介護施設を探す</SectionTitle>
      <LinkGrid title="病院を探す" links={HOSPITAL_LINKS} onNavigate={onNavigate} />
      <LinkGrid title="介護施設を探す" links={CARE_LINKS} onNavigate={onNavigate} />
    </div>
  </section>
);
