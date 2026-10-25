// 病院の仮データ（実在しない名称）。公的データ（厚生労働省 医療情報ネット等）を取り込むときの項目に合わせてある。
// 取り込み後は同じ形のデータに差し替える。取得元と取得日は画面に必ず表示する。
export const DEPARTMENTS = ['内科', '外科', '小児科', '整形外科', '眼科', '皮膚科', '耳鼻咽喉科', '産婦人科'];

export const DATA_SOURCE = { label: '仮データ（実在しません）', fetchedAt: '2026-10-25' };

export const HOSPITALS = [
  { id: 'h1', name: 'サンプル内科クリニック', prefecture: '東京', address: '東京都渋谷区道玄坂1-0-0', tel: '03-0000-0001', departments: ['内科', '小児科'], hours: '9:00〜18:00', holiday: '日・祝', lat: 35.6595, lng: 139.6995 },
  { id: 'h2', name: 'ひだまり総合病院', prefecture: '東京', address: '東京都渋谷区宇田川町2-0-0', tel: '03-0000-0002', departments: ['内科', '外科', '整形外科'], hours: '8:30〜17:00', holiday: '日・祝', lat: 35.6615, lng: 139.6975 },
  { id: 'h3', name: 'みどり眼科', prefecture: '東京', address: '東京都渋谷区神南1-0-0', tel: '03-0000-0003', departments: ['眼科'], hours: '10:00〜19:00', holiday: '水・日', lat: 35.6640, lng: 139.7010 },
  { id: 'h4', name: 'さくら皮膚科クリニック', prefecture: '東京', address: '東京都渋谷区桜丘町3-0-0', tel: '03-0000-0004', departments: ['皮膚科'], hours: '9:30〜18:30', holiday: '木・日', lat: 35.6560, lng: 139.7020 },
  { id: 'h5', name: 'あおぞら整形外科', prefecture: '東京', address: '東京都渋谷区円山町4-0-0', tel: '03-0000-0005', departments: ['整形外科', '外科'], hours: '9:00〜19:00', holiday: '日・祝', lat: 35.6575, lng: 139.6945 },
  { id: 'h6', name: 'こもれび小児科', prefecture: '東京', address: '東京都渋谷区松濤5-0-0', tel: '03-0000-0006', departments: ['小児科', '内科'], hours: '9:00〜17:30', holiday: '土午後・日・祝', lat: 35.6660, lng: 139.6905 },
  { id: 'h7', name: 'つばさ耳鼻咽喉科', prefecture: '東京', address: '東京都渋谷区道玄坂2-0-0', tel: '03-0000-0007', departments: ['耳鼻咽喉科'], hours: '9:00〜18:00', holiday: '水・日', lat: 35.6585, lng: 139.6965 },
  { id: 'h8', name: 'ことり女性クリニック', prefecture: '東京', address: '東京都渋谷区南平台町6-0-0', tel: '03-0000-0008', departments: ['産婦人科', '内科'], hours: '9:30〜18:00', holiday: '木・日', lat: 35.6535, lng: 139.6985 },
];
