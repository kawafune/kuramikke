import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SectionTitle } from '../components/ui/SectionTitle';
import { NotFoundPage } from './NotFoundPage';
import { usePageTitle } from '../hooks/usePageTitle';
import { AREAS, AREA_BY_SLUG } from '../data/areas';
import { KIND_LABEL } from '../data/medical';
import { KAIGO_TYPE_LABEL } from '../data/kaigo';
import { KINDS, SOURCE_TEXT, hubMeta, listMeta, listPath, pageCount, slicePage, sortByKana } from '../lib/areaMeta';

// 区ごとの一覧に使う、小さなデータ（scripts/build_area_data.mjs が作る）を読む
const cache = {};
const loadArea = (slug, kind) => {
  const key = `${slug}-${kind}`;
  cache[key] ??= fetch(`/data/area/${key}.json`).then((r) => { if (!r.ok) throw new Error('load'); return r.json(); }).catch((e) => { delete cache[key]; throw e; });
  return cache[key];
};
const useArea = (slug, kind) => {
  const [s, setS] = useState({ key: '', items: null, error: false });
  const key = `${slug}-${kind}`;
  useEffect(() => {
    let alive = true;
    loadArea(slug, kind).then((items) => alive && setS({ key, items, error: false })).catch(() => alive && setS({ key, items: null, error: true }));
    return () => { alive = false; };
  }, [slug, kind, key]);
  const ready = s.key === key;
  return { items: ready ? s.items : null, loading: !ready, error: ready && s.error };
};

const Loading = () => <p className="max-w-content mx-auto px-4 py-20 text-center" role="status">読み込んでいます…</p>;
const LoadError = () => <p className="max-w-content mx-auto px-4 py-20 text-center">データを読み込めませんでした。通信を確認して、もう一度お試しください。</p>;

// 区の入口：病院・診療所と、老人ホーム・介護施設の一覧への、案内
export const AreaHubPage = () => {
  const { slug } = useParams();
  const area = AREA_BY_SLUG[slug];
  const med = useArea(slug, 'hospitals');
  const care = useArea(slug, 'nursing');
  const counts = { hospitals: med.items?.length ?? 0, nursing: care.items?.length ?? 0 };
  const meta = area && med.items && care.items ? hubMeta(area.city, counts) : {};
  usePageTitle(meta.title ?? (area ? `${area.city}の病院・老人ホーム` : undefined), meta.description);
  if (!area) return <NotFoundPage />;
  if (med.error || care.error) return <LoadError />;
  if (med.loading || care.loading) return <Loading />;

  return (
    <>
      <Breadcrumb items={[{ label: '病院・介護施設を探す', to: '/search' }, { label: area.city }]} />
      <div className="max-w-[760px] mx-auto px-4 py-10 md:py-14">
        <SectionTitle as="h1">{area.city}の病院・診療所・老人ホーム・介護施設</SectionTitle>
        <p className="mb-8 text-center">{area.city}にある病院・診療所と、老人ホーム・介護施設の一覧です。気になる施設を選ぶと、住所や診療時間などをくわしく見られます。</p>
        <ul className="grid gap-4 sm:grid-cols-2">
          <li><Link to={listPath(slug, 'hospitals')} className="block rounded-2xl border border-gold bg-white p-6 text-center hover:bg-cream-50"><span className="block font-round font-bold text-gold-deep text-[1.1rem]">{area.city}の病院・診療所</span><span className="block mt-1 text-[0.9rem]">{counts.hospitals.toLocaleString()}件</span></Link></li>
          <li><Link to={listPath(slug, 'nursing')} className="block rounded-2xl border border-gold bg-white p-6 text-center hover:bg-cream-50"><span className="block font-round font-bold text-gold-deep text-[1.1rem]">{area.city}の老人ホーム・介護施設</span><span className="block mt-1 text-[0.9rem]">{counts.nursing.toLocaleString()}件</span></Link></li>
        </ul>
        <p className="mt-10 text-center text-[0.9rem]">ほかの区：{AREAS.filter((a) => a.slug !== slug).map((a, i) => <React.Fragment key={a.slug}>{i > 0 && '　'}<Link to={`/area/${a.slug}`} className="text-gold-deep underline underline-offset-4">{a.city}</Link></React.Fragment>)}</p>
      </div>
    </>
  );
};

const Pager = ({ slug, kind, page, pages }) => {
  if (pages <= 1) return null;
  return (
    <nav aria-label="ページ送り" className="mt-8 flex flex-wrap justify-center gap-2">
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <Link key={n} to={listPath(slug, kind, n)} aria-current={n === page ? 'page' : undefined} className={`w-10 h-10 flex items-center justify-center ${n === page ? 'bg-gold-deep text-white' : 'bg-cream-100 hover:bg-cream-200'}`}>{n}</Link>
      ))}
    </nav>
  );
};

// 区の一覧（kind：hospitals / nursing）。各行は、ふつうのリンクで、施設ページへつなぐ
const AreaListPage = ({ kind }) => {
  const { slug, page: pageParam } = useParams();
  const area = AREA_BY_SLUG[slug];
  const { items, loading, error } = useArea(slug, kind);
  const page = pageParam === undefined ? 1 : /^[1-9]\d*$/.test(pageParam) ? Number(pageParam) : 0;
  const sorted = items ? sortByKana(items) : [];
  const pages = pageCount(sorted.length);
  const valid = area && page >= 1 && page <= pages && pageParam !== '1';
  const meta = area && items ? listMeta(area.city, kind, items.length, page || 1) : {};
  usePageTitle(meta.title ?? (area ? `${area.city}の${KINDS[kind].label}一覧` : undefined), meta.description);
  if (!area) return <NotFoundPage />;
  if (error) return <LoadError />;
  if (loading) return <Loading />;
  if (!valid && !(page === 1 && pageParam === undefined)) return <NotFoundPage />;

  const rows = slicePage(sorted, page);
  const hospitals = kind === 'hospitals';
  return (
    <>
      <Breadcrumb items={[{ label: '病院・介護施設を探す', to: '/search' }, { label: area.city, to: `/area/${slug}` }, { label: KINDS[kind].label }]} />
      <div className="max-w-[900px] mx-auto px-4 py-10 md:py-14">
        <SectionTitle as="h1">{area.city}の{KINDS[kind].label}一覧</SectionTitle>
        <p className="mb-6 text-center text-[0.9rem]">{area.city}の{KINDS[kind].label}、全{items.length.toLocaleString()}件（{(page - 1) * 50 + 1}〜{(page - 1) * 50 + rows.length}件目）。名前の五十音順です。</p>
        <ul className="border-t border-line">
          {rows.map((f) => (
            <li key={f.id} className="border-b border-line">
              <Link to={`/${hospitals ? 'hospitals' : 'nursing-homes'}/${f.id}`} className="block py-3 px-2 hover:bg-cream-50">
                <span className="block font-bold leading-snug">{f.name}</span>
                <span className="block text-[0.8rem] text-ink-sub">
                  {hospitals ? `${KIND_LABEL[f.kind] ?? '医療機関'}・${f.departments.slice(0, 4).join('・')}` : `${KAIGO_TYPE_LABEL[f.service] ?? '介護施設'}${f.corp ? `・${f.corp}` : ''}`}・{f.address}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Pager slug={slug} kind={kind} page={page} pages={pages} />
        <p className="mt-8 text-center text-[0.9rem]">
          <Link to={`/area/${slug}`} className="text-gold-deep underline underline-offset-4">{area.city}のトップへ</Link>
          {'　'}
          <Link to={listPath(slug, hospitals ? 'nursing' : 'hospitals')} className="text-gold-deep underline underline-offset-4">{area.city}の{KINDS[hospitals ? 'nursing' : 'hospitals'].label}</Link>
        </p>
        <p className="mt-6 text-[0.75rem] text-ink-sub">出典：{SOURCE_TEXT[kind]}。掲載内容は変わることがあります。受診・ご利用の前に、施設へご確認ください。</p>
      </div>
    </>
  );
};

export const AreaHospitalsPage = () => <AreaListPage kind="hospitals" />;
export const AreaNursingPage = () => <AreaListPage kind="nursing" />;
