# Converts the repo's light-dark() OKLCH colour tokens to sRGB 0-1 for Figma (Light + Dark), gamut-mapped by chroma reduction
import json, math, re, sys

src = open(sys.argv[1]).read()
HUE = 119.4

def parse_oklch(s):
    m = re.match(r'oklch\(([\d.]+)\s+(?:calc\(([\d.]+)[^)]*\)\)|([\d.]+))\s+(?:calc\(var\(--brand-hue\)\s*([+-])\s*([\d.]+)\)|var\(--brand-hue\)|([\d.]+))(?:\s*/\s*([\d.]+))?\)', s.strip())
    L = float(m.group(1)); C = float(m.group(2) or m.group(3))
    H = float(m.group(6)) if m.group(6) else HUE + ((float(m.group(5)) * (1 if m.group(4) == '+' else -1)) if m.group(5) else 0)
    return L, C, H, float(m.group(7)) if m.group(7) else 1.0

def oklch_to_lin(L, C, H):
    a, b = C * math.cos(math.radians(H)), C * math.sin(math.radians(H))
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    return (4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
            -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
            -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)

def to_srgb(L, C, H):
    inside = lambda c: all(-1e-6 <= x <= 1 + 1e-6 for x in oklch_to_lin(L, c, H))
    clipped = not inside(C)
    if clipped:
        lo, hi = 0.0, C
        for _ in range(40):
            mid = (lo + hi) / 2
            lo, hi = (mid, hi) if inside(mid) else (lo, mid)
        C = lo
    enc = lambda x: 12.92 * x if x <= 0.0031308 else 1.055 * x ** (1 / 2.4) - 0.055
    return [round(min(1, max(0, enc(x))), 5) for x in oklch_to_lin(L, C, H)], clipped

def hexof(rgb):
    return '#' + ''.join(f'{round(x * 255):02x}' for x in rgb)

def mix(a, b, pa):
    # color-mix(in oklch, a pa, b): white/transparent are achromatic, so hue comes from a
    return (a[0] * pa + b[0] * (1 - pa), a[1] * pa + b[1] * (1 - pa), a[2])

toks = {}
for name, body in re.findall(r'--((?:brand|neutral|success|warning|error|info)-\d+(?:-alpha)?):\s*light-dark\((.*?)\);', src):
    depth, cut = 0, None
    for i, ch in enumerate(body):
        depth += (ch == '(') - (ch == ')')
        if ch == ',' and depth == 0:
            cut = i
    toks[name] = [parse_oklch(body[:cut]), parse_oklch(body[cut + 1:])]

out, clips = [], []
for name, modes in toks.items():
    entry = {"name": name, "values": []}
    for mode, (L, C, H, A) in zip(("Light", "Dark"), modes):
        rgb, clipped = to_srgb(L, C, H)
        if clipped: clips.append(f"{name}/{mode}")
        entry["values"].append({"r": rgb[0], "g": rgb[1], "b": rgb[2], "a": A, "hex": hexof(rgb)})
    out.append(entry)

# Literal semantic colours (color-mix results that can't be aliases)
b50 = dict(zip(("Light", "Dark"), toks["brand-50"]))
b400 = dict(zip(("Light", "Dark"), toks["brand-400"]))
lit = []
cl = []
for mode in ("Light", "Dark"):
    L, C, H = mix(b50[mode][:3], (1.0, 0.0, 0.0), 0.3)
    rgb, _ = to_srgb(L, C, H)
    cl.append({"r": rgb[0], "g": rgb[1], "b": rgb[2], "a": 1, "hex": hexof(rgb)})
lit.append({"name": "content-light", "values": cl})
rgb, _ = to_srgb(*b400["Dark"][:3])
lit.append({"name": "card-bg-dark", "values": [None, {"r": rgb[0], "g": rgb[1], "b": rgb[2], "a": 0.12, "hex": hexof(rgb)}]})

json.dump({"primitives": out, "literals": lit, "gamutClipped": clips}, open(sys.argv[2], "w"), indent=1)
print(len(out), "primitives; clipped to sRGB:", clips or "none")
