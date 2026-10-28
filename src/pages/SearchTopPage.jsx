import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import { AdBanner } from '../components/ui/AdBanner';
import { SearchTypeTabs } from '../components/search/SearchTypeTabs';
import { EmergencyNotice } from '../components/search/EmergencyNotice';
import { useFavorites } from '../hooks/useFavorites';
import { usePageTitle } from '../hooks/usePageTitle';
import { REGIONS } from '../data/regions';
import { DEPARTMENTS, DATA_SOURCE_NAME, asOfLabel, loadIndex } from '../data/medical';
import { PREFECTURES } from '../data/nav';

const field = 'w-full h-11 px-3 border border-gold rounded bg-white text-[0.9rem] focus:outline-none focus:border-gold-deep';

// 病院・介護施設を探す：検索TOP（原案07）
export const SearchTopPage = () => {
  usePageTitle('病院・介護施設を探す');
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [pref, setPref] = useState('');
  const [dept, setDept] = useState('');
  const [tab, setTab] = useState('area'); // area＝エリアから / route＝路線から（準備中）
  const { ids } = useFavorites();
  const [index, setIndex] = useState(null);
  useEffect(() => {
    let alive = true;
    loadIndex().then((v) => { if (alive) setIndex(v); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  const total = index ? Object.values(index.prefs).reduce((sum, p) => sum + p.count, 0) : null;

  const go = (params) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v && sp.set(k, v));
    navigate(`/search/results?${sp.toString()}`);
  };

  return (
    <>
      <Breadcrumb items={[{ label: '病院・介護施設を探す' }]} />
      <div className="max-w-content mx-auto px-4 py-10 md:py-14">
        <SectionTitle as="h1">病院・介護施設を探す</SectionTitle>
        <EmergencyNotice />
        <div className="h-8" />
        <SearchTypeTabs active="hospital" />
        <p className="text-right -mt-4 mb-4 text-[0.85rem]"><Link to="/search/favorites" className="text-accent-red-text underline underline-offset-4">お気に入り（{ids.length}件）</Link></p>

        <p className="text-center my-10 md:my-14 font-round font-bold text-[1.05rem] md:text-[1.25rem] tracking-[0.1em]">
          病院・診療所の掲載数
          <span className="mx-3 text-[2.2rem] md:text-[2.8rem] text-accent-red-text border-b-4 border-cream-300 px-2">{total === null ? '…' : `${total.toLocaleString()}件`}</span>
          から検索する
        </p>

        <form onSubmit={(e) => { e.preventDefault(); go({ q }); }} className="max-w-[640px] mx-auto text-center">
          <label className="relative block">
            <span className="sr-only">キーワードで探す</span>
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-sub" aria-hidden="true" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="診療科目・名前・地名などを入力（例：渋谷　内科）" className={`${field} pl-10`} />
          </label>
          <Button type="submit" icon={null} className="mt-5">この条件で検索する</Button>
        </form>

        {/* エリア／路線 */}
        <div className="mt-14">
          <div role="tablist" className="flex">
            <button role="tab" aria-selected={tab === 'area'} onClick={() => setTab('area')} className={`min-h-[48px] px-6 font-round font-bold border border-b-0 border-gold ${tab === 'area' ? 'bg-white text-accent-red-text' : 'bg-cream-50 text-accent-red-text/70'}`}>エリアから探す</button>
            <button role="tab" aria-selected={tab === 'route'} onClick={() => setTab('route')} className={`min-h-[48px] px-6 font-round font-bold border border-b-0 border-gold ${tab === 'route' ? 'bg-white text-[#2A7A73]' : 'bg-cream-50 text-[#2A7A73]/70'}`}>路線から探す</button>
          </div>
          <div role="tabpanel" className="border border-gold bg-white p-5 md:p-8">
            {tab === 'route' ? (
              <p className="py-10 text-center">路線から探す機能は、準備中です。</p>
            ) : (
              <dl className="space-y-3">
                {REGIONS.map((r) => (
                  <div key={r.name} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <dt className="sm:w-[8.5rem] shrink-0 bg-accent-red-text text-white font-round font-bold text-center py-1.5 px-3 text-[0.9rem]">{r.name}</dt>
                    <dd className="flex flex-wrap gap-x-4 gap-y-1">
                      {r.prefs.map((p) => (
                        <Link key={p} to={`/search/results?pref=${encodeURIComponent(p)}`} className="py-1 hover:text-gold-deep hover:underline underline-offset-4">{p}</Link>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <form onSubmit={(e) => { e.preventDefault(); go({ pref, dept }); }} className="mt-8 bg-cream-50 p-4 flex flex-col md:flex-row md:items-end gap-3">
              <p className="font-round font-bold text-gold-deep md:mr-2 md:pb-2.5 whitespace-nowrap">条件を指定して検索</p>
              <label className="flex-1 text-[0.8rem]">エリア
                <select value={pref} onChange={(e) => setPref(e.target.value)} className={`${field} mt-1`}>
                  <option value="">すべて</option>
                  {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
              <span aria-hidden="true" className="hidden md:block pb-2 text-gold text-[1.4rem]">×</span>
              <label className="flex-1 text-[0.8rem]">診療科目
                <select value={dept} onChange={(e) => setDept(e.target.value)} className={`${field} mt-1`}>
                  <option value="">すべて</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>
              <Button type="submit" icon={null} className="md:px-6">検索する</Button>
            </form>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <AdBanner className="h-[80px]" />
          <AdBanner className="h-[80px] hidden sm:flex" />
        </div>
        <p className="mt-6 text-[0.8rem] text-ink-sub">出典：{DATA_SOURCE_NAME}（{index ? asOfLabel(index.asOf) : '…'}時点）。報告された内容がそのまま載っており、古い情報や誤りを含む場合があります。受診の前に、必ず各医療機関へご確認ください。</p>
      </div>
    </>
  );
};
