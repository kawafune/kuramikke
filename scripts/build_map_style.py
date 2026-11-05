# 地図のスタイル（public/map/kura-style.json）を作る。
# もと：国土地理院「最適化ベクトルタイル」の標準地図風スタイル（scripts/map/gsi_std.json。github.com/gsi-cyberjapan/optimal_bvmap）
# 変えていること：①色を、サイトのクリーム色に寄せて淡くする ②文字を、ゴシック体（Noto Sans JP）にそろえる ③等高線・送電線など、細かい線を外す
import json, re, colorsys
from pathlib import Path

SRC = Path(__file__).parent / 'map' / 'gsi_std.json'
OUT = Path(__file__).parent.parent / 'public' / 'map' / 'kura-style.json'
CREAM = (250, 247, 234)
DROP_SOURCE_LAYERS = {'Cntr', 'PwrTrnsmL', 'TpgphLine', 'TpgphArea'}
FONT = ['NotoSansJP-Regular']

def parse(c):
    c = c.strip()
    m = re.fullmatch(r'#([0-9a-fA-F]{3})', c)
    if m: return tuple(int(ch * 2, 16) for ch in m.group(1)) + (1.0,)
    m = re.fullmatch(r'#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?', c)
    if m:
        h = m.group(1); a = int(m.group(2), 16) / 255 if m.group(2) else 1.0
        return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)
    m = re.fullmatch(r'rgba?\(([^)]*)\)', c)
    if m:
        p = [x.strip() for x in m.group(1).split(',')]
        return (float(p[0]), float(p[1]), float(p[2]), float(p[3]) if len(p) > 3 else 1.0)
    m = re.fullmatch(r'hsla?\(([^)]*)\)', c)
    if m:
        p = [x.strip().rstrip('%') for x in m.group(1).split(',')]
        r, g, b = colorsys.hls_to_rgb(float(p[0]) / 360, float(p[2]) / 100, float(p[1]) / 100)
        return (r * 255, g * 255, b * 255, float(p[3]) if len(p) > 3 else 1.0)
    return None

def soften(rgba, mix, desat):
    r, g, b, a = rgba
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    r, g, b = [x * 255 for x in colorsys.hls_to_rgb(h, l, s * (1 - desat))]
    r, g, b = [round(x + (cr - x) * mix) for x, cr in zip((r, g, b), CREAM)]
    return f'rgba({r},{g},{b},{round(a, 3)})'

def walk(v, mix, desat):
    if isinstance(v, str):
        p = parse(v)
        return soften(p, mix, desat) if p else v
    if isinstance(v, list): return [walk(x, mix, desat) for x in v]
    if isinstance(v, dict): return {k: walk(x, mix, desat) for k, x in v.items()}
    return v

style = json.loads(SRC.read_text(encoding='utf-8'))
layers = []
for layer in style['layers']:
    if layer.get('source-layer') in DROP_SOURCE_LAYERS: continue
    paint = layer.get('paint', {})
    for k in list(paint):
        if not k.endswith('-color'): continue
        if k == 'text-color': paint[k] = walk(paint[k], 0.15, 0.3)
        elif k == 'text-halo-color': paint[k] = 'rgba(255,255,255,0.95)'
        elif k == 'background-color': paint[k] = 'rgba(250,247,234,1)'
        else: paint[k] = walk(paint[k], 0.45, 0.35)
    if 'text-font' in layer.get('layout', {}): layer['layout']['text-font'] = FONT
    layers.append(layer)
style['layers'] = layers
style['name'] = 'kuramikke-pale (based on GSI optimal_bvmap std)'
style['sources']['v']['attribution'] = '<a href="https://github.com/gsi-cyberjapan/optimal_bvmap" target="_blank" rel="noopener noreferrer">国土地理院ベクトルタイル</a>'
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(style, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print('layers', len(layers), 'bytes', OUT.stat().st_size)
