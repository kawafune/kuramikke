// 「カレンダーに追加」：Googleカレンダー用のリンクと、.ics ファイル（iPhone・Outlookなど）を、ブラウザの中で作る。
// 入力された日時は、クラミッケのサーバーには送らない。日時は、すべて日本時間として扱う。
const pad = (n) => String(n).padStart(2, '0');

const stamp = (d, { utc }) => {
  const x = utc ? d : new Date(d.getTime() + 9 * 3600 * 1000); // 日本時間の表示にするため、9時間たす
  return `${x.getUTCFullYear()}${pad(x.getUTCMonth() + 1)}${pad(x.getUTCDate())}T${pad(x.getUTCHours())}${pad(x.getUTCMinutes())}${pad(x.getUTCSeconds())}${utc ? 'Z' : ''}`;
};

// date＝'2026-11-05'、time＝'10:00'（日本時間）
export const buildEvent = ({ name, address, tel, url, date, time, durationMin = 60 }) => {
  const start = new Date(`${date}T${time}:00+09:00`);
  const end = new Date(start.getTime() + durationMin * 60 * 1000);
  return {
    title: `【診察】${name}`,
    location: `${name}（${address}）`,
    description: [
      `病院：${name}`,
      `電話：${tel}`,
      '※ 予約の内容は、病院にご確認ください。',
      '※ クラミッケでは、診療の予約は受け付けていません。',
      url,
    ].join('\n'),
    start,
    end,
  };
};

export const googleCalendarUrl = (ev) => {
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.title,
    dates: `${stamp(ev.start, { utc: false })}/${stamp(ev.end, { utc: false })}`,
    ctz: 'Asia/Tokyo',
    details: ev.description,
    location: ev.location,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
};

const escapeText = (s) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

// .ics は、1行が75バイトまで。日本語は1文字3バイトなので、余裕をみて短く折り返す（2行目以降は、先頭に空白をつける）
const fold = (line) => {
  const chars = Array.from(line);
  if (chars.length <= 24) return line;
  const out = [chars.slice(0, 24).join('')];
  for (let i = 24; i < chars.length; i += 23) out.push(` ${chars.slice(i, i + 23).join('')}`);
  return out.join('\r\n');
};

// alarms：['-PT1H'（1時間前）, '-P1D'（前日）] など。空なら、通知なし
export const buildIcs = (ev, alarms = [], now = new Date()) => {
  const uid = `${globalThis.crypto?.randomUUID?.() ?? `${now.getTime()}-${Math.random().toString(36).slice(2)}`}@kura-mikke.com`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kuramikke//JP',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp(now, { utc: true })}`,
    `DTSTART:${stamp(ev.start, { utc: true })}`,
    `DTEND:${stamp(ev.end, { utc: true })}`,
    `SUMMARY:${escapeText(ev.title)}`,
    `LOCATION:${escapeText(ev.location)}`,
    `DESCRIPTION:${escapeText(ev.description)}`,
    ...alarms.flatMap((trigger) => ['BEGIN:VALARM', `TRIGGER:${trigger}`, 'ACTION:DISPLAY', `DESCRIPTION:${escapeText('診察の予定があります')}`, 'END:VALARM']),
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${lines.map(fold).join('\r\n')}\r\n`;
};

export const ALARM_OPTIONS = [
  { id: 'none', label: '通知しない', alarms: [] },
  { id: 'hour', label: '1時間前に通知', alarms: ['-PT1H'] },
  { id: 'day', label: '前日に通知', alarms: ['-P1D'] },
  { id: 'both', label: '前日と、1時間前に通知', alarms: ['-P1D', '-PT1H'] },
];
