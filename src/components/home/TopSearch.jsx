import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { PREFECTURES } from '../../data/nav';

const field = 'w-full h-12 px-3 border border-gold rounded bg-white text-[0.95rem] focus:outline-none focus:border-gold-deep';

// TOPの検索窓。エリア（都道府県）を選んで、キーワードを入れる（診療科目・名前・地名）
export const TopSearch = () => {
  const navigate = useNavigate();
  const [pref, setPref] = useState('');
  const [q, setQ] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (pref) sp.set('pref', pref);
    if (q.trim()) sp.set('q', q.trim());
    navigate(`/search/results?${sp.toString()}`);
  };

  return (
    <section aria-labelledby="top-search-title" className="max-w-[860px] mx-auto px-4 pt-8 md:pt-10">
      <form onSubmit={submit} className="bg-white border border-gold p-4 md:p-6">
        <h2 id="top-search-title" className="text-center font-round font-bold text-gold-deep text-[1.05rem] md:text-[1.2rem] tracking-[0.1em] mb-4">病院・診療所を探す</h2>
        <div className="grid gap-3 md:grid-cols-[10rem_1fr_auto] md:items-end">
          <label className="text-[0.8rem]">エリア
            <select value={pref} onChange={(e) => setPref(e.target.value)} className={`${field} mt-1`}>
              <option value="">選んでください</option>
              {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="text-[0.8rem]">診療科目・名前・地名
            <span className="relative block mt-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-sub" aria-hidden="true" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="例：内科、渋谷" className={`${field} pl-10`} />
            </span>
          </label>
          <Button type="submit" icon={null} className="w-full md:w-auto">探す</Button>
        </div>
      </form>
    </section>
  );
};
