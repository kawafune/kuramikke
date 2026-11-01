#!/usr/bin/env python3
"""市区町村コード（5桁）と、市区町村の名前の対応表（scripts/municipalities.json）を作る。
医療情報ネットのデータには、市区町村の「コード」だけで名前が入っていない。介護サービス情報公表システムのデータには、
コードと名前の両方が入っているので、そこから対応表を作る。

使い方：python3 scripts/build_municipalities.py <介護のCSVのフォルダ>
（年1回のデータ更新のときに、介護のCSVから作り直す。市町村合併などで、名前が変わるため）
"""
import csv, json, sys
from pathlib import Path

out = {}
for p in sorted(Path(sys.argv[1]).glob('jigyosho_*_all_*.csv')):
    for enc in ('utf-8-sig', 'cp932'):
        try:
            with open(p, encoding=enc, newline='') as f:
                for r in csv.DictReader(f):
                    code = (r.get('都道府県コード又は市町村コード') or '')[:5]
                    name = (r.get('市区町村名') or '').strip()
                    if len(code) == 5 and name:
                        out[code] = name
            break
        except UnicodeDecodeError:
            continue
Path(__file__).with_name('municipalities.json').write_text(json.dumps(dict(sorted(out.items())), ensure_ascii=False, indent=0), encoding='utf-8')
print(f'{len(out)}件を書き出しました：scripts/municipalities.json')
