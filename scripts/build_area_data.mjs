// 区ごとの一覧ページ用に、小さなデータファイル（public/data/area/<slug>-hospitals.json など）を作る。
// 都道府県ぜんぶのデータ（東京で約8MB）を読み込まずに、一覧ページを開けるようにするため。ビルドのたびに自動で実行される（prebuild / predev）。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { AREAS } from '../src/data/areas.js';

const load = (p) => JSON.parse(readFileSync(p, 'utf-8'));
mkdirSync('public/data/area', { recursive: true });

const med = {};
const care = {};
for (const a of AREAS) {
  med[a.prefCode] ??= load(`public/data/medical/${a.prefCode}.json`);
  care[a.prefCode] ??= load(`public/data/kaigo/${a.prefCode}.json`);
  const hospitals = med[a.prefCode].filter((f) => f.city === a.city)
    .map((f) => ({ id: f.id, kind: f.kind, name: f.name, kana: f.kana, address: f.address, departments: f.departments.slice(0, 8) }));
  // 診療科別の件数（一覧用のデータは診療科を8つまでに絞っているので、ここで全部数えておく）
  const dept = new Map();
  med[a.prefCode].filter((f) => f.city === a.city).forEach((f) => f.departments.forEach((d) => dept.set(d, (dept.get(d) ?? 0) + 1)));
  const depts = [...dept.entries()].sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0], 'ja')).slice(0, 8);
  writeFileSync(`public/data/area/${a.slug}-summary.json`, JSON.stringify({ depts }));
  const nursing = care[a.prefCode].filter((f) => f.city === a.city)
    .map((f) => ({ id: f.id, service: f.service, name: f.name, kana: f.kana, address: f.address, corp: f.corp ?? null, capacity: f.capacity ?? null }));
  writeFileSync(`public/data/area/${a.slug}-hospitals.json`, JSON.stringify(hospitals));
  writeFileSync(`public/data/area/${a.slug}-nursing.json`, JSON.stringify(nursing));
  console.log(`area/${a.slug}：病院・診療所 ${hospitals.length}件、介護施設 ${nursing.length}件`);
}
