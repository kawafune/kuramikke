#!/usr/bin/env python3
"""画像を、サイト用に自動で整える（大きすぎる画像を、軽くする）。

できること
  1. 取り込み：  python3 scripts/optimize_images.py add <元の画像...> --name col-スラッグ
       元の画像（jpg / png / webp）を、幅1600px以内・WebP・画質82（250KBを超えるときは、70まで下げる）に変えて、src/assets/photos/<name>.webp に保存する。
       同じ写真を2つ渡したとき（解像度ちがいなど）は、いちばん大きいものを使う。
       名前の決まり：コラム＝col-<記事のスラッグ>、終活ガイド＝guide-<スラッグ>、ページ＝page-<名前>
  2. 点検：      python3 scripts/optimize_images.py check
       src/assets と public/images の画像を調べて、大きすぎるもの（幅 1600px 超、または 250KB 超）を一覧で出す。直しはしない。
  3. 自動で整える： python3 scripts/optimize_images.py fix
       点検で見つかったものを、元の形式のまま、縮小・再圧縮して上書きする（ファイル名は変えない。参照が切れないように）。
       小さくならなかったものは、そのままにする。

  EXIF（撮影場所などの情報）は、すべて取り除く。透明なPNGは、透明を保つ。
"""
import argparse
import io
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
PHOTOS_DIR = ROOT / 'src' / 'assets' / 'photos'
SCAN_DIRS = [ROOT / 'src' / 'assets', ROOT / 'public' / 'images']
EXTS = {'.jpg', '.jpeg', '.png', '.webp'}
MAX_WIDTH = 1600
MAX_BYTES = 250 * 1024
QUALITY = 82
# 取り込み時の決まり：名前の先頭
PREFIXES = ('col-', 'guide-', 'page-')


def load(path):
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)  # 向きを正しくしてから、EXIFを捨てる
    return im


def resized(im, max_width=MAX_WIDTH):
    if im.width <= max_width:
        return im
    return im.resize((max_width, round(im.height * max_width / im.width)), Image.LANCZOS)


def encode(im, fmt):
    """WebP / JPEG は、画質82から始めて、基準（MAX_BYTES）を超えるときは、画質を少しずつ下げる（最低70）"""
    if fmt == 'PNG':
        buf = io.BytesIO()
        im.save(buf, 'PNG', optimize=True)
        return buf.getvalue()
    data = b''
    for q in (QUALITY, 78, 74, 70):
        buf = io.BytesIO()
        if fmt == 'WEBP':
            im.save(buf, 'WEBP', quality=q, method=6)
        else:
            im.convert('RGB').save(buf, 'JPEG', quality=q, optimize=True, progressive=True)
        data = buf.getvalue()
        if len(data) <= MAX_BYTES:
            break
    return data


def kb(n):
    return f'{n / 1024:.0f}KB'


def scan():
    for base in SCAN_DIRS:
        for p in sorted(base.rglob('*')):
            if p.suffix.lower() in EXTS and p.is_file():
                yield p


def cmd_add(args):
    name = args.name
    if not name.startswith(PREFIXES):
        sys.exit(f'名前は {" / ".join(PREFIXES)} のどれかで始めてください（例：col-my-article）')
    files = [Path(f) for f in args.files]
    for f in files:
        if not f.is_file() or f.suffix.lower() not in EXTS:
            sys.exit(f'画像（jpg / png / webp）ではありません：{f}')
    # 同じ写真の重複は、画素数がいちばん大きいものを使う
    best = max(files, key=lambda f: (lambda i: i.width * i.height)(Image.open(f)))
    if len(files) > 1:
        print(f'{len(files)}枚のうち、いちばん大きい {best.name} を使います')
    im = resized(load(best))
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGBA' if 'transparency' in im.info else 'RGB')
    out = PHOTOS_DIR / f'{name}.webp'
    data = encode(im, 'WEBP')
    if out.exists() and not args.force:
        sys.exit(f'すでにあります：{out.relative_to(ROOT)}（上書きするなら --force）')
    out.write_bytes(data)
    print(f'保存：{out.relative_to(ROOT)}（{im.width}×{im.height}、{kb(len(data))}。元は {kb(best.stat().st_size)}）')


def problems():
    for p in scan():
        size = p.stat().st_size
        with Image.open(p) as im:
            w, h = im.size
        reasons = []
        if w > MAX_WIDTH:
            reasons.append(f'幅{w}px')
        if size > MAX_BYTES:
            reasons.append(f'{kb(size)}')
        if reasons:
            yield p, w, h, size, '・'.join(reasons)


def cmd_check(_args):
    found = list(problems())
    total = sum(1 for _ in scan())
    for p, w, h, size, why in found:
        print(f'大きい：{p.relative_to(ROOT)}（{w}×{h}、{kb(size)}）← {why}')
    print(f'点検：{total}枚のうち、{len(found)}枚が基準（幅{MAX_WIDTH}px以内、{kb(MAX_BYTES)}以内）を超えています')
    return 1 if found else 0


def cmd_fix(_args):
    found = list(problems())
    saved = 0
    for p, w, h, size, _why in found:
        im = resized(load(p))
        fmt = {'.jpg': 'JPEG', '.jpeg': 'JPEG', '.png': 'PNG', '.webp': 'WEBP'}[p.suffix.lower()]
        data = encode(im, fmt)
        if len(data) < size:
            p.write_bytes(data)
            saved += size - len(data)
            print(f'整えました：{p.relative_to(ROOT)}（{w}×{h}、{kb(size)} → {im.width}×{im.height}、{kb(len(data))}）')
        else:
            print(f'そのまま：{p.relative_to(ROOT)}（これ以上小さくならない）')
    print(f'{len(found)}枚を確認、合計 {kb(saved)} 軽くしました')


def main():
    ap = argparse.ArgumentParser(description='画像を、サイト用に自動で整える')
    sub = ap.add_subparsers(dest='cmd', required=True)
    a = sub.add_parser('add', help='新しい画像を取り込む')
    a.add_argument('files', nargs='+', help='元の画像（同じ写真が複数でもよい）')
    a.add_argument('--name', required=True, help='保存名（col-… / guide-… / page-…）。拡張子は不要')
    a.add_argument('--force', action='store_true', help='同じ名前があっても上書きする')
    a.set_defaults(func=cmd_add)
    sub.add_parser('check', help='大きすぎる画像を探す（直さない）').set_defaults(func=cmd_check)
    sub.add_parser('fix', help='大きすぎる画像を、縮小・再圧縮して上書きする').set_defaults(func=cmd_fix)
    args = ap.parse_args()
    sys.exit(args.func(args) or 0)


if __name__ == '__main__':
    main()
