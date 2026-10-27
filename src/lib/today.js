// 「本日の診療」の計算。日本時間（JST）で判断する（利用者の端末の時刻の設定に左右されないように）。
// 祝日は、サイトでは判断できない（診療時間の表の「祝」の列は、参考として表示するだけ）。画面で「祝日は、お電話でご確認ください」と必ず添える。
export const WEEKDAY_LABEL = ['月', '火', '水', '木', '金', '土', '日']; // 0＝月 … 6＝日

const WEEKDAY_INDEX = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
const jstFormat = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Tokyo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const jstDateFormat = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }); // 2026-10-28 の形

// いまの日本時間の、曜日（0＝月 … 6＝日）と、0時からの分
export const getJst = (date = new Date()) => {
  const parts = Object.fromEntries(jstFormat.formatToParts(date).map((p) => [p.type, p.value]));
  return { dayIdx: WEEKDAY_INDEX[parts.weekday], minutes: Number(parts.hour) * 60 + Number(parts.minute) };
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

// 本日の状態。kind：closed（休診の曜日）/ open（受付時間内）/ break（昼休みなど。次がある）/ before（まだ始まっていない）/ after（終了）
export const todayStatus = (schedule, date = new Date()) => {
  const { dayIdx, minutes } = getJst(date);
  const ranges = rangesOfDay(schedule, dayIdx);
  if (ranges.length === 0) return { kind: 'closed', dayIdx, ranges };
  if (ranges.some((r) => r.start <= minutes && minutes < r.end)) return { kind: 'open', dayIdx, ranges };
  const next = ranges.find((r) => r.start > minutes);
  if (!next) return { kind: 'after', dayIdx, ranges };
  return { kind: minutes < ranges[0].start ? 'before' : 'break', dayIdx, ranges, next };
};
