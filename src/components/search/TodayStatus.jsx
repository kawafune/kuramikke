import React from 'react';
import { CalendarCheck, Clock, Hourglass } from 'lucide-react';
import { useNow } from '../../hooks/useNow';
import { todayStatus, WEEKDAY_LABEL } from '../../lib/today';
import { isNewYearBreak } from '../../lib/holidays';

// 「本日の診療」の表示。いまの日本時間と、診療時間の表から、状態を出す。
// 祝日は自動で判定する。臨時の休診は判断できないため、必ず「お電話でご確認ください」と添える。
const TONE = {
  open: 'bg-[#2A7A73] text-white',
  closed: 'bg-ink-sub text-white',
  other: 'bg-cream-200 text-ink',
};

export const TodayStatus = ({ schedule, compact = false, className = '' }) => {
  const now = useNow();
  const s = todayStatus(schedule, now);
  const day = s.holiday ? `祝日・${s.holiday}` : `${WEEKDAY_LABEL[s.dayIdx]}曜日`;
  const labels = s.ranges.map((r) => r.label).join(' / ');

  const view = {
    closed: { tone: TONE.closed, Icon: CalendarCheck, text: `本日（${day}）は、休診の予定です` },
    open: { tone: TONE.open, Icon: Clock, text: 'ただいま、受付時間内です' },
    break: { tone: TONE.other, Icon: Hourglass, text: `ただいま、受付時間外です。次は ${s.next?.label} です` },
    before: { tone: TONE.other, Icon: Hourglass, text: `本日の受付は、${s.ranges[0]?.label} からです` },
    after: { tone: TONE.other, Icon: Hourglass, text: '本日の受付は、終了しました' },
  }[s.kind];

  return (
    <div className={className}>
      <p className={`inline-flex items-center gap-2 font-round font-bold ${compact ? 'text-[0.8rem] px-3 py-1.5' : 'text-[0.95rem] px-4 py-2'} ${view.tone}`}>
        <view.Icon size={compact ? 16 : 20} aria-hidden="true" />
        <span><span className="mr-2 text-[0.85em] opacity-90">本日の診療</span>{view.text}</span>
      </p>
      {s.kind !== 'closed' && <p className={`mt-1 ${compact ? 'text-[0.75rem]' : 'text-[0.85rem]'}`}>本日（{day}）の受付時間：{labels}</p>}
      <p className={`mt-0.5 text-ink-sub ${compact ? 'text-[0.7rem]' : 'text-[0.8rem]'}`}>※ 祝日は自動で判定しています。臨時の休診がある場合もあるため、お出かけ前にお電話でご確認ください。</p>
      {isNewYearBreak(s.dateStr) && <p className={`mt-0.5 font-bold ${compact ? 'text-[0.75rem]' : 'text-[0.85rem]'}`}>年末年始（12月29日〜1月3日）は、お休みの病院が多くなります。必ずお電話でご確認ください。</p>}
    </div>
  );
};
