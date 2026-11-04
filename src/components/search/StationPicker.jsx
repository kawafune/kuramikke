import React, { useState } from 'react';
import { TrainFront } from 'lucide-react';
import { loadStations, findStations, PREF_NAME_BY_CODE } from '../../data/stations';

const field = 'w-full h-12 px-3 border border-gold rounded bg-white text-[0.95rem] focus:outline-none focus:border-gold-deep';

// 駅名の入力欄。入力すると候補が出る。選ぶと onPick(駅) が呼ばれる。駅の一覧は、最初に使うときに読み込む
export const StationPicker = ({ onPick, label = '駅名', placeholder = '例：渋谷、博多' }) => {
  const [q, setQ] = useState('');
  const [stations, setStations] = useState(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);

  const ensure = () => {
    if (!stations && !failed) loadStations().then(setStations).catch(() => setFailed(true));
  };
  const matches = stations ? findStations(stations, q) : [];

  return (
    <div className="relative text-[0.8rem]">
      <label className="block">{label}
        <span className="relative block mt-1">
          <TrainFront size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-sub" aria-hidden="true" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => { ensure(); setOpen(true); }}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder={placeholder}
            autoComplete="off"
            role="combobox"
            aria-expanded={open && matches.length > 0}
            aria-controls="station-list"
            className={`${field} pl-10`}
          />
        </span>
      </label>
      {failed && <p role="alert" className="mt-1 text-accent-red-text">駅の一覧を読み込めませんでした。通信を確認して、もう一度お試しください。</p>}
      {open && q.trim() && stations && matches.length === 0 && <p className="mt-1 text-ink-sub">該当する駅が見つかりません。（漢字で入力してください）</p>}
      {open && matches.length > 0 && (
        <ul id="station-list" role="listbox" className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gold shadow-md max-h-72 overflow-y-auto">
          {matches.map((s) => (
            <li key={`${s.n}${s.a}${s.o}`} role="option" aria-selected="false">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { setQ(`${s.n}駅`); setOpen(false); onPick(s); }}
                className="w-full text-left px-3 py-2 min-h-[44px] hover:bg-cream-100 text-[0.9rem]"
              >
                <span className="font-bold">{s.n}駅</span>
                <span className="ml-2 text-[0.75rem] text-ink-sub">{PREF_NAME_BY_CODE[s.p]}／{s.l.slice(0, 2).join('・')}{s.l.length > 2 ? ' ほか' : ''}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
