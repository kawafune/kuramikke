// 「本日の診療」の計算。日本時間（JST）で判断する（利用者の端末の時刻の設定に左右されないように）。
// 祝日は lib/holidays.js で判定し、診療時間の表の「祝」の列で見る。臨時の休診は判断できないので、画面で「お電話でご確認ください」と添える。
import { holidayName } from './holidays';

export const WEEKDAY_LABEL = ['月', '火', '水', '木', '金', '土', '日']; // 0＝月 … 6＝日

const WEEKDAY_INDEX = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
const jstFormat = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Tokyo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const jstDateFormat = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }); // 2026-10-28 の形

// いまの日本時間の、曜日（0＝月 … 6＝日）と、0時からの分
export const getJst = (date = new Date()) => {
  const parts = Object.fromEntries(jstFormat.formatToParts(date).map((p) => [p.type, p.value]));
  return { dayIdx: WEEKDAY_INDEX[parts.weekday], minutes: Number(parts.hour) * 60 + Number(parts.minute), dateStr: jstDateFormat.format(date) };
};

export const jstDateString = (date = new Date()) => jstDateFormat.format(date);

// '2026-11-05' → 曜日（0＝月 … 6＝日）。日本時間の0時として扱う
export const dayIndexOfDateString = (dateStr) => getJst(new Date(`${dateStr}T00:00:00+09:00`)).dayIdx;

export const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

// '09:30〜12:30' → { label, start, end }
export const parseRange = (label) => {
  const [a, b] = label.split(/[〜~～]/);
  return { label, start: toMinutes(a), end: toMinutes(b) };
};

// その曜日に診療する時間帯
export const rangesOfDay = (schedule, dayIdx) => schedule.filter((r) => r.days[dayIdx]).map((r) => parseRange(r.time));

// 診療時間の表の列。祝日なら「祝」の列（7）、そうでなければ曜日（0〜6）
export const scheduleColumn = (dayIdx, holiday) => (holiday ? 7 : dayIdx);

// 本日の状態。kind：closed（休診の曜日）/ open（受付時間内）/ break（昼休みなど。次がある）/ before（まだ始まっていない）/ after（終了）
export const todayStatus = (schedule, date = new Date()) => {
  const { dayIdx, minutes, dateStr } = getJst(date);
  const holiday = holidayName(dateStr);
  const ranges = rangesOfDay(schedule, scheduleColumn(dayIdx, holiday));
  const base = { dayIdx, holiday, dateStr, ranges };
  if (ranges.length === 0) return { kind: 'closed', ...base };
  if (ranges.some((r) => r.start <= minutes && minutes < r.end)) return { kind: 'open', ...base };
  const next = ranges.find((r) => r.start > minutes);
  if (!next) return { kind: 'after', ...base };
  return { kind: minutes < ranges[0].start ? 'before' : 'break', ...base, next };
};
