import React from 'react';
import { WEEKDAYS } from '../../data/medical';

// 診療時間の表（原案：受付時間 × 月〜祝、診療あり＝◯、なし＝−）
export const ScheduleTable = ({ schedule, className = '' }) => (schedule.length === 0 ? (
  <p className="text-[0.85rem] text-ink-sub">診療時間は、公的データに登録がありません。公式サイトなどでご確認ください。</p>
) : (
  <table className={`border-collapse text-center text-[0.8rem] ${className}`}>
    <caption className="sr-only">診療時間（◯は診療あり、−は休診）</caption>
    <thead>
      <tr>
        <th scope="col" className="border border-gold px-2 py-1 font-normal bg-cream-50">受付時間</th>
        {WEEKDAYS.map((d) => <th key={d} scope="col" className="border border-gold w-8 py-1 font-normal bg-cream-50">{d}</th>)}
      </tr>
    </thead>
    <tbody>
      {schedule.map((row) => (
        <tr key={row.time}>
          <th scope="row" className="border border-gold px-2 py-1 font-bold tracking-wider whitespace-nowrap">{row.time}</th>
          {row.days.map((open, i) => (
            <td key={WEEKDAYS[i]} className="border border-gold py-1">
              {open ? <span aria-label="診療あり">◯</span> : <span aria-label="休診" className="text-ink-sub">−</span>}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
));
