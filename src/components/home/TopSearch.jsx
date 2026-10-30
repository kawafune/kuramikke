import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { PREFECTURES } from '../../data/nav';
import { getLastPref } from '../../lib/lastPref';

const field = 'w-full h-12 px-3 border border-gold rounded bg-white text-[0.95rem] focus:outline-none focus:border-gold-deep';

// 「病院・介護施設を探す」の検索窓。探す対象（病院・診療所／老人ホーム）を選んで、エリアとキーワードを入れる
export const TopSearch = () => {
  const navigate = useNavigate();
  const [target, setTarget] = useState('hospital');
  const [pref, setPref] = useState(getLastPref); // 前回のエリアを、最初から選んでおく
  const [q, setQ] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (pref) sp.set('pref', pref);
    if (q.trim()) sp.set('q', q.trim());
    navigate(`${target === 'hospital' ? '/search/results' : '/search/nursing'}?${sp.toString()}`);
  };

  return (
    <form onSubmit={submit} className="max-w-[860px] mx-auto mb-10 bg-white border border-gold p-4 md:p-6">
      <fieldset className="flex flex-wrap justify-center gap-x-6 gap-y-1 mb-4">
        <legend className="sr-only">探すもの</legend>
        {[['hospital', '病院・診療所'], ['nursing', '老人ホーム・介護施設']].map(([v, label]) => (
          <label key={v} className="inline-flex items-center gap-2 min-h-[40px] cursor-pointer font-round font-bold text-[0.95rem]">
            <input type="radio" name="top-search-target" value={v} checked={target === v} onChange={() => setTarget(v)} className="w-5 h-5 accent-[#8A6D0B]" />
            {label}
          </label>
        ))}
      </fieldset>
      <div className="grid gap-3 md:grid-cols-[10rem_1fr_auto] md:items-end">
        <label className="text-[0.8rem]">エリア
          <select value={pref} onChange={(e) => setPref(e.target.value)} className={`${field} mt-1`}>
            <option value="">選んでください</option>
            {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <label className="text-[0.8rem]">{target === 'hospital' ? '診療科目・名前・地名' : '施設名・地名・運営法人'}
          <span className="relative block mt-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-sub" aria-hidden="true" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={target === 'hospital' ? '例：内科、渋谷' : '例：世田谷'} className={`${field} pl-10`} />
          </span>
        </label>
        <Button type="submit" icon={null} className="w-full md:w-auto">探す</Button>
      </div>
    </form>
  );
};
