#!/usr/bin/env python3
"""駅の一覧（public/data/stations.json）を作る。国土交通省「国土数値情報（鉄道データ N02）」の Station.geojson を使う。
出典の表示が必要（CC BY 4.0）：「国土数値情報（鉄道データ）国土交通省」を加工して作成。

使い方：
  python3 scripts/build_stations.py <N02の Station.geojson> <医療・介護の都道府県JSONのフォルダ（public/data/medical）> <出力 public/data/stations.json>
駅ごとの都道府県は、いちばん近い病院・診療所の都道府県から割り出す（データに都道府県が無いため）。
同じ駅（グループコードが同じ線分）は、1つにまとめる。標準ライブラリ＋numpyが必要。
"""
import json, re, sys, glob, math
from collections import defaultdict
import numpy as np

src, med, out = sys.argv[1:4]
gj = json.load(open(src, encoding='utf-8'))

groups = defaultdict(lambda: {'pts': [], 'name': '', 'lines': {}})
for f in gj['features']:
    p = f['properties']
    g = groups[p['N02_005g']]
    g['name'] = p['N02_005']
    g['lines'][p['N02_003']] = p['N02_004']
    g['pts'].extend(f['geometry']['coordinates'])

# 施設の座標（都道府県コード付き）
fac, fcode = [], []
for path in sorted(glob.glob(f'{med}/[0-9][0-9].json')):
    code = path.split('/')[-1][:2]
    for x in json.load(open(path, encoding='utf-8')):
        if x['lat'] is not None:
            fac.append((x['lat'], x['lng'])); fcode.append(code)
fac = np.array(fac); fcode = np.array(fcode)

stations = []
for gid, g in groups.items():
    pts = np.array(g['pts'])
    lng, lat = pts[:, 0].mean(), pts[:, 1].mean()
    d = (fac[:, 0] - lat) ** 2 + ((fac[:, 1] - lng) * math.cos(math.radians(lat))) ** 2
    pref = str(fcode[int(d.argmin())])
    # 路線名：「11号線半蔵門線」→「半蔵門線」、「1号線(空港線)」→「空港線」のように、見やすくする
    def clean(ln):
        m = re.match(r'^\d+号線[(（](.+)[)）]$', ln)
        return m.group(1) if m else re.sub(r'^\d+号線', '', ln) or ln
    lines = list(dict.fromkeys(clean(ln) for ln in sorted(g['lines'])))
    stations.append({'n': g['name'], 'l': lines[:4], 'a': round(float(lat), 5), 'o': round(float(lng), 5), 'p': pref})

stations.sort(key=lambda s: (s['p'], s['n']))
json.dump(stations, open(out, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(f'{len(stations)}駅を書き出しました：{out}')
