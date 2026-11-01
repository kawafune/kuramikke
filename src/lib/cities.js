// 読み込んだ1県分のデータから、市区町村の一覧（件数つき）を作る。並びは、データの順（市区町村コード順）
export const citiesOf = (items) => {
  const count = new Map();
  (items ?? []).forEach((f) => { if (f.city) count.set(f.city, (count.get(f.city) ?? 0) + 1); });
  return [...count].map(([name, n]) => ({ name, n }));
};
