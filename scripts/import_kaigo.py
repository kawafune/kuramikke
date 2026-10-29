#!/usr/bin/env python3
"""介護サービス情報公表システム（厚生労働省）のオープンデータ「介護サービス事業所データ」を、サイト用のJSONに変える。

使い方:
  python3 scripts/import_kaigo.py <CSVのフォルダ> <出力フォルダ> [--as-of 2026-06-30]
例:
  python3 scripts/import_kaigo.py ./kaigo20260630 public/data/kaigo

入力：ファイル名が jigyosho_<サービスコード>_all_*.csv のもの（例：jigyosho_331_all_20260709.csv）
出力：<出力>/<都道府県コード>.json と index.json
標準ライブラリだけで動く。生データ（CSV）はリポジトリに入れない。

【注意】このデータには、費用（入居一時金・月額）や、空き状況は入っていない。
住宅型有料老人ホーム、介護保険の特定施設ではないサービス付き高齢者向け住宅も、入っていない（別の公表データ）。
"""
import csv, json, re, sys, unicodedata, argparse
from pathlib import Path
from collections import defaultdict


def nfkc(s):
    return unicodedata.normalize('NFKC', s or '').strip()


def read_rows(path):
    for enc in ('utf-8-sig', 'cp932'):
        try:
            with open(path, encoding=enc, newline='') as f:
                yield from csv.DictReader(f)
            return
        except UnicodeDecodeError:
            continue
    raise SystemExit(f'文字コードを判定できません：{path}')


def short_pref(name):
    """'東京都'→'東京'、'石川県'→'石川'（北海道はそのまま）。医療機関のデータと表記をそろえる"""
    return name if name == '北海道' else re.sub(r'[都府県]$', '', name or '')


def num(v):
    try:
        x = float(v)
        return x if x != 0 else None
    except (TypeError, ValueError):
        return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('out')
    ap.add_argument('--as-of', default='')
    a = ap.parse_args()
    src, out = Path(a.src), Path(a.out)
    out.mkdir(parents=True, exist_ok=True)

    by_pref = defaultdict(list)
    counts = defaultdict(int)
    for p in sorted(src.glob('jigyosho_*_all_*.csv')):
        m = re.match(r'jigyosho_(\d+)_all_', p.name)
        service = m.group(1)
        for r in read_rows(p):
            code = (r.get('都道府県コード又は市町村コード') or '')[:2]
            lat, lng = num(r.get('緯度')), num(r.get('経度'))
            addr = nfkc(r.get('住所'))
            by_pref[code].append({
                'id': f"{r['事業所番号']}-{service}",  # 事業所番号（10桁、先頭2桁が都道府県コード）－サービスコード。同じ事業所が複数のサービスを持つため
                'service': service,
                'serviceName': r.get('サービスの種類', ''),
                'name': nfkc(r['事業所名']),
                'kana': nfkc(r.get('事業所名カナ')),
                'pref': short_pref(r.get('都道府県名', '')),
                'city': r.get('市区町村名', ''),
                'address': addr,
                'tel': nfkc(r.get('電話番号')) or None,
                'lat': round(lat, 6) if lat is not None else None,
                'lng': round(lng, 6) if lng is not None else None,
                'url': (r.get('URL') or '').strip() or None,
                'capacity': int(float(r['定員'])) if r.get('定員') not in (None, '', '0') else None,
                'corp': nfkc(r.get('法人の名称')) or None,
                'days': r.get('利用可能曜日') or None,
            })
            counts[service] += 1
    index = {}
    for code, items in sorted(by_pref.items()):
        items.sort(key=lambda f: f['id'])
        (out / f'{code}.json').write_text(json.dumps(items, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
        index[code] = {'pref': items[0]['pref'], 'count': len(items)}
    (out / 'index.json').write_text(json.dumps({'source': '厚生労働省 介護サービス情報公表システム オープンデータ', 'asOf': a.as_of, 'services': counts, 'prefs': index}, ensure_ascii=False, indent=1), encoding='utf-8')
    print('サービス別の件数：', dict(counts))
    print('出力：', out, f'（{len(index)}都道府県）')


if __name__ == '__main__':
    main()
