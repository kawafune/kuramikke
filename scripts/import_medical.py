#!/usr/bin/env python3
"""医療情報ネット（厚生労働省）のオープンデータCSVを、サイト用のJSONに変える。

使い方:
  python3 scripts/import_medical.py <CSVのフォルダ> <出力フォルダ> [--kind hospital|clinic|all]
例:
  python3 scripts/import_medical.py ./e-gov20250601 public/data/medical

入力（ファイル名の先頭で判定）:
  01-1 病院の施設票 / 01-2 病院の診療科・時間 / 02-1 診療所の施設票 / 02-2 診療所の診療科・時間
出力:
  <出力>/<都道府県コード>.json   ← その県の病院・診療所（画面で、見る県だけ読み込む）
  <出力>/index.json              ← 県ごとの件数・取得元（出典表示用）

生データ（CSV）はリポジトリに入れない。出力の形は docs/design/data-plan.md を参照。
標準ライブラリだけで動く。
"""
import csv, json, sys, unicodedata, argparse
from pathlib import Path
from collections import defaultdict

DAYS = ['月', '火', '水', '木', '金', '土', '日', '祝']
PREF = {
    '01': '北海道', '02': '青森', '03': '岩手', '04': '宮城', '05': '秋田', '06': '山形', '07': '福島', '08': '茨城', '09': '栃木',
    '10': '群馬', '11': '埼玉', '12': '千葉', '13': '東京', '14': '神奈川', '15': '新潟', '16': '富山', '17': '石川', '18': '福井',
    '19': '山梨', '20': '長野', '21': '岐阜', '22': '静岡', '23': '愛知', '24': '三重', '25': '滋賀', '26': '京都', '27': '大阪',
    '28': '兵庫', '29': '奈良', '30': '和歌山', '31': '鳥取', '32': '島根', '33': '岡山', '34': '広島', '35': '山口', '36': '徳島',
    '37': '香川', '38': '愛媛', '39': '高知', '40': '福岡', '41': '佐賀', '42': '長崎', '43': '熊本', '44': '大分', '45': '宮崎',
    '46': '鹿児島', '47': '沖縄',
}


def nfkc(s):
    """全角の数字・英字を半角にそろえる（検索しやすくする）。かなは、そのまま"""
    return unicodedata.normalize('NFKC', s or '').strip()


def read_csv(path):
    with open(path, encoding='utf-8-sig', newline='') as f:
        yield from csv.DictReader(f)


def to_min(hhmm):
    h, m = hhmm.split(':')
    return int(h) * 60 + int(m)


def fmt(m):
    return f'{m // 60:02d}:{m % 60:02d}'


def merge(ranges):
    """重なる・つながる時間帯を1つにまとめる"""
    out = []
    for a, b in sorted(ranges):
        if out and a <= out[-1][1]:
            out[-1][1] = max(out[-1][1], b)
        else:
            out.append([a, b])
    return out


def build_schedule(hours_rows):
    """施設の全診療科の、外来の受付時間をまとめて、画面の表（時間帯の行 × 月〜祝）の形にする。
    外来受付の時間が無ければ、診療時間で代用する。"""
    per_day = [[] for _ in range(8)]
    for r in hours_rows:
        for i, d in enumerate(DAYS):
            s, e = r.get(f'{d}_外来受付開始時間', ''), r.get(f'{d}_外来受付終了時間', '')
            if not (s and e):
                s, e = r.get(f'{d}_診療開始時間', ''), r.get(f'{d}_診療終了時間', '')
            if s and e:
                try:
                    a, b = to_min(s), to_min(e)
                except ValueError:
                    continue
                if a < b:
                    per_day[i].append((a, b))
    per_day = [merge(x) for x in per_day]
    labels = sorted({(a, b) for day in per_day for a, b in day})
    # 時間帯の種類が多すぎる施設は、各日の「最初〜最後」にまとめる（表が長くなりすぎないように）
    if len(labels) > 4:
        per_day = [[[day[0][0], day[-1][1]]] if day else [] for day in per_day]
        labels = sorted({(a, b) for day in per_day for a, b in day})
    rows = []
    for a, b in labels:
        rows.append({'time': f'{fmt(a)}〜{fmt(b)}', 'days': [1 if [a, b] in day else 0 for day in per_day]})
    return rows


def flag(v):
    return {'1': 1, '0': 0}.get(v, None)


def facility(row, kind):
    lat, lng = row['所在地座標（緯度）'], row['所在地座標（経度）']
    ok = lat not in ('', '0', '0.0') and lng not in ('', '0', '0.0')
    code = row['都道府県コード']
    weekly = [flag(row[f'毎週決まった曜日に休診（{d}）']) for d in DAYS[:7]]  # 値の意味は「診療あり＝1」と推定（要確認）
    return {
        'id': row['ID'],
        'kind': kind,
        'name': nfkc(row['正式名称']),
        'kana': nfkc(row['正式名称（フリガナ）']),
        'pref': PREF.get(code, ''),
        'address': nfkc(row['所在地']),
        'lat': float(lat) if ok else None,
        'lng': float(lng) if ok else None,
        'url': row['案内用ホームページアドレス'] or None,
        'openDays': weekly,
        'holidayOpen': flag(row['祝日に休診']),
        'otherClosed': row['その他の休診日（gw、お盆等）'] or None,
        'beds': int(row['合計病床数']) if row.get('合計病床数', '').isdigit() else None,
        'departments': [],
        'schedule': [],
    }, code


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('out')
    ap.add_argument('--kind', default='all', choices=['hospital', 'clinic', 'all'])
    a = ap.parse_args()
    src, out = Path(a.src), Path(a.out)
    out.mkdir(parents=True, exist_ok=True)

    kinds = [('hospital', '01-1', '01-2'), ('clinic', '02-1', '02-2')]
    by_pref = defaultdict(list)
    for kind, fac_prefix, hours_prefix in kinds:
        if a.kind not in ('all', kind):
            continue
        fac_files = sorted(src.glob(f'{fac_prefix}*.csv'))
        hours_files = sorted(src.glob(f'{hours_prefix}*.csv'))
        if not fac_files:
            print(f'[{kind}] 施設票（{fac_prefix}）が見つからないため、飛ばします'); continue
        hours = defaultdict(list)
        for p in hours_files:
            for r in read_csv(p):
                hours[r['ID']].append(r)
        n = 0
        for row in read_csv(fac_files[0]):
            f, code = facility(row, kind)
            hr = hours.get(f['id'], [])
            f['departments'] = sorted({r['診療科目名'] for r in hr if r.get('診療科目名')})
            f['schedule'] = build_schedule(hr)
            by_pref[code].append(f)
            n += 1
        print(f'[{kind}] {n}件。診療科・時間あり：{sum(1 for v in by_pref.values() for f in v if f["kind"] == kind and f["schedule"])}件')

    index = {}
    for code, items in sorted(by_pref.items()):
        items.sort(key=lambda f: f['id'])
        (out / f'{code}.json').write_text(json.dumps(items, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
        index[code] = {'pref': PREF.get(code, ''), 'count': len(items)}
    (out / 'index.json').write_text(json.dumps({'source': '厚生労働省 医療情報ネット（ナビイ） オープンデータ', 'asOf': '2025-06-01', 'prefs': index}, ensure_ascii=False, indent=1), encoding='utf-8')
    print('出力：', out, f'（{len(index)}県）')


if __name__ == '__main__':
    main()
