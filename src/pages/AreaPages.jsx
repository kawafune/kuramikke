import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SectionTitle } from '../components/ui/SectionTitle';
import { NotFoundPage } from './NotFoundPage';
import { usePageTitle } from '../hooks/usePageTitle';
import { AREAS, AREA_BY_SLUG } from '../data/areas';
import { KIND_LABEL } from '../data/medical';
import { KAIGO_TYPE_LABEL } from '../data/kaigo';
import { KINDS, SOURCE_TEXT, hubMeta, tally, listMeta, listPath, pageCount, slicePage, sortByKana } from '../lib/areaMeta';

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

// 件数の表（種類別）
const CountTable = ({ caption, rows }) => (
  <table className="w-full text-[0.95rem] border-t border-line">
    <caption className="sr-only">{caption}</caption>
    <tbody>{rows.map(([label, n]) => <tr key={label} className="border-b border-line"><th scope="row" className="text-left font-normal py-2 pr-4">{label}</th><td className="py-2 text-right whitespace-nowrap">{n.toLocaleString()}件</td></tr>)}</tbody>
  </table>
);

// 区の入口：その区の全体像（種類別の件数）と、高齢者の相談窓口。施設のリストは、一覧ページに置く
export const AreaHubPage = () => {
  const { slug } = useParams();
  const area = AREA_BY_SLUG[slug];
  const med = useArea(slug, 'hospitals');
  const care = useArea(slug, 'nursing');
  const sum = useArea(slug, 'summary');
  const ready = Boolean(area && med.items && care.items && sum.items);
  const careTypes = ready ? tally(care.items.map((f) => KAIGO_TYPE_LABEL[f.service] ?? '介護施設')) : [];
  const kinds = ready ? tally(med.items.map((f) => KIND_LABEL[f.kind] ?? '医療機関')) : [];
  const depts = ready ? sum.items.depts : [];
  const counts = { hospitals: med.items?.length ?? 0, nursing: care.items?.length ?? 0 };
  const meta = ready ? hubMeta(area.city, counts, careTypes[0]) : {};
  usePageTitle(meta.title ?? (area ? `${area.city}の病院・老人ホーム` : undefined), meta.description);
  if (!area) return <NotFoundPage />;
  if (med.error || care.error || sum.error) return <LoadError />;
  if (med.loading || care.loading || sum.loading) return <Loading />;

  return (
    <>
      <Breadcrumb items={[{ label: '病院・介護施設を探す', to: '/search' }, { label: area.city }]} />
      <div className="max-w-[760px] mx-auto px-4 py-10 md:py-14">
        <SectionTitle as="h1">{area.city}の病院・老人ホーム・介護施設</SectionTitle>
        <p className="mb-10">{area.city}には、病院・診療所が{counts.hospitals.toLocaleString()}件、老人ホーム・介護施設が{counts.nursing.toLocaleString()}件あります。老人ホーム・介護施設でいちばん多いのは「{careTypes[0]?.[0]}」（{careTypes[0]?.[1]}件）、病院・診療所では「{depts[0]?.[0]}」を診る施設が最も多く、{depts[0]?.[1]}件です。</p>

        <section aria-labelledby="hub-care" className="mb-10">
          <h2 id="hub-care" className="text-[1.15rem] border-l-[6px] border-gold pl-3 mb-4">{area.city}の老人ホーム・介護施設（種類別）</h2>
          <CountTable caption={`${area.city}の老人ホーム・介護施設の種類別の件数`} rows={careTypes} />
          <p className="mt-3 text-[0.9rem]"><Link to={listPath(slug, 'nursing')} className="text-gold-deep underline underline-offset-4">{area.city}の老人ホーム・介護施設の一覧を見る（{counts.nursing.toLocaleString()}件）</Link></p>
        </section>

        <section aria-labelledby="hub-med" className="mb-10">
          <h2 id="hub-med" className="text-[1.15rem] border-l-[6px] border-gold pl-3 mb-4">{area.city}の病院・診療所</h2>
          <p className="mb-3 text-[0.9rem]">{kinds.map(([k, n]) => `${k}${n.toLocaleString()}件`).join('、')}。診療科（届け出の多いもの）は次のとおりです。</p>
          <CountTable caption={`${area.city}の診療科別の件数`} rows={depts} />
          <p className="mt-3 text-[0.9rem]"><Link to={listPath(slug, 'hospitals')} className="text-gold-deep underline underline-offset-4">{area.city}の病院・診療所の一覧を見る（{counts.hospitals.toLocaleString()}件）</Link></p>
        </section>

        <section aria-labelledby="hub-consult" className="mb-10">
          <h2 id="hub-consult" className="text-[1.15rem] border-l-[6px] border-gold pl-3 mb-4">{area.city}の高齢者の相談窓口</h2>
          <p className="mb-3">介護や暮らしのことで迷ったら、まず、お住まいの地域の相談窓口へ。費用はかからず、施設を探す前の相談もできます。</p>
          <p className="mb-2"><a href={area.consult.url} target="_blank" rel="noopener noreferrer" className="text-gold-deep underline underline-offset-4 font-bold">{area.city}公式サイト：{area.consult.name}</a></p>
          <p className="text-[0.9rem]">{area.consult.note}</p>
        </section>

        <p className="text-center text-[0.9rem]">ほかの区：{AREAS.filter((a) => a.slug !== slug).map((a, i) => <React.Fragment key={a.slug}>{i > 0 && '　'}<Link to={`/area/${a.slug}`} className="text-gold-deep underline underline-offset-4">{a.city}</Link></React.Fragment>)}</p>
        <p className="mt-6 text-[0.75rem] text-ink-sub">出典：{SOURCE_TEXT.hospitals}、{SOURCE_TEXT.nursing}をもとに、クラミッケが集計しました。相談窓口は区の公式サイトのページで、内容は変わることがあります。</p>
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
