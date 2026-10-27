import React, { useState } from 'react';
import { CalendarPlus, Download, ExternalLink } from 'lucide-react';
import { useNow } from '../../hooks/useNow';
import { jstDateString, dayIndexOfDateString, rangesOfDay, toMinutes, WEEKDAY_LABEL } from '../../lib/today';
import { ALARM_OPTIONS, buildEvent, buildIcs, googleCalendarUrl } from '../../lib/calendar';

const field = 'w-full h-11 px-3 border border-gold rounded bg-white text-[0.9rem] focus:outline-none focus:border-gold-deep';

// 予約の日時を、お使いのカレンダーに入れる（ログイン不要）。
// 予約は病院で行い、その日時を知っているのは利用者自身。入力された内容は、この端末の中だけで使い、サーバーには送らない。
export const CalendarAdd = ({ hospital }) => {
  const now = useNow(60000);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [alarmId, setAlarmId] = useState('day');

  const ready = Boolean(date && time);
  const event = ready
    ? buildEvent({ name: hospital.name, address: hospital.address, tel: hospital.tel, url: `${window.location.origin}/hospitals/${hospital.id}`, date, time })
    : null;

  // 入力の確認（曜日と、受付時間）。祝日は判断できない
  let warning = '';
  if (ready) {
    const dayIdx = dayIndexOfDateString(date);
    const ranges = rangesOfDay(hospital.schedule, dayIdx);
    if (ranges.length === 0) {
      warning = `${WEEKDAY_LABEL[dayIdx]}曜日は、休診の予定です。日にちを、もう一度ご確認ください。`;
    } else {
      const m = toMinutes(time);
      if (!ranges.some((r) => r.start <= m && m < r.end)) {
        warning = `${WEEKDAY_LABEL[dayIdx]}曜日の受付時間（${ranges.map((r) => r.label).join(' / ')}）の外です。時刻を、ご確認ください。`;
      }
    }
  }

  const download = () => {
    const alarms = ALARM_OPTIONS.find((a) => a.id === alarmId)?.alarms ?? [];
    const blob = new Blob([buildIcs(event, alarms)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kuramikke-appointment.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const btn = 'inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded font-round font-bold text-[0.85rem]';

  return (
    <section aria-labelledby="calendar-title" className="scroll-mt-24 mt-8 border border-gold bg-cream-50 p-5 md:p-8">
      <h2 id="calendar-title" className="scroll-mt-24 flex items-center gap-2 text-[1.1rem] text-gold-deep mb-2"><CalendarPlus size={22} aria-hidden="true" />予約の日時を、カレンダーに入れる</h2>
      <p className="text-[0.85rem] leading-relaxed mb-5">
        病院に予約をしたあと、その日時を、お使いのカレンダーに入れておけます。入力した内容は、この端末の中だけで使い、クラミッケには送りません。
        クラミッケでは、診療の予約は受け付けていません。予約は、お電話か、病院の予約ページでお願いします。
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-[0.8rem]">予約の日にち
          <input type="date" value={date} min={jstDateString(now)} onChange={(e) => setDate(e.target.value)} className={`${field} mt-1`} />
        </label>
        <label className="text-[0.8rem]">予約の時刻
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={`${field} mt-1`} />
        </label>
        <label className="text-[0.8rem]">通知
          <select value={alarmId} onChange={(e) => setAlarmId(e.target.value)} className={`${field} mt-1`}>
            {ALARM_OPTIONS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        </label>
      </div>

      {warning && <p role="alert" className="mt-3 bg-[#FFF1EE] border border-accent-red-text p-3 text-[0.85rem] text-accent-red-text font-bold">{warning}</p>}
      {ready && <p className="mt-2 text-[0.75rem] text-ink-sub">※ 祝日は、お電話でご確認ください。</p>}

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        {ready ? (
          <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className={`${btn} bg-gold-deep text-white shadow-[0_3px_0_theme(colors.gold.shadow)]`}>
            Googleカレンダーに追加<ExternalLink size={16} aria-hidden="true" />
          </a>
        ) : (
          <span aria-disabled="true" className={`${btn} bg-line text-ink-sub cursor-not-allowed`}>Googleカレンダーに追加</span>
        )}
        <button
          type="button"
          onClick={download}
          disabled={!ready}
          className={`${btn} border-2 ${ready ? 'border-gold-deep text-gold-deep bg-white' : 'border-line text-ink-sub bg-white cursor-not-allowed'}`}
        >
          <Download size={16} aria-hidden="true" />ファイル（.ics）を保存
        </button>
      </div>
      <p className="mt-3 text-[0.75rem] text-ink-sub leading-relaxed">
        iPhoneやOutlookなどは、「ファイル（.ics）を保存」を押して、開いたファイルから追加してください。Googleカレンダーの通知は、追加したあとに、カレンダーの設定で変えられます。
      </p>
    </section>
  );
};
