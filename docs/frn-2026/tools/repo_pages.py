# Parses repo long-form pages and writing listings into block specs for the Figma page builder
import json, os, re, subprocess, sys
from datetime import date

ROOT = sys.argv[1]
OUT = sys.argv[2]
MEDIA_DIR = sys.argv[3]
os.makedirs(MEDIA_DIR, exist_ok=True)


def front(path):
    txt = open(path).read()
    m = re.match(r'---\n(.*?)\n---\n(.*)', txt, re.S)
    meta = {}
    for line in m.group(1).splitlines():
        k, _, v = line.partition(':')
        if v:
            meta[k.strip()] = v.strip().strip('"')
    return meta, m.group(2)


def inline(text):
    # Split into runs: plain, link, bold, italic
    runs, pos = [], 0
    for m in re.finditer(r'\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*', text):
        if m.start() > pos:
            runs.append({'t': text[pos:m.start()]})
        if m.group(1):
            runs.append({'t': m.group(1), 'link': True})
        elif m.group(3):
            runs.append({'t': m.group(3), 'bold': True})
        else:
            runs.append({'t': m.group(4), 'italic': True})
        pos = m.end()
    if pos < len(text):
        runs.append({'t': text[pos:]})
    return runs


def size(path):
    r = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', path], capture_output=True, text=True).stdout.split()
    return int(r[r.index('pixelWidth:') + 1]), int(r[r.index('pixelHeight:') + 1])


def media(src, video):
    path = os.path.join(ROOT, 'src', src.lstrip('/'))
    name = os.path.splitext(os.path.basename(src))[0]
    out = os.path.join(MEDIA_DIR, name + '.jpg')
    if video:
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '1', '-i', path, '-frames:v', '1', '-vf', 'scale=1600:-2', out], check=True)
    else:
        subprocess.run(['sips', '-Z', '1600', '-s', 'format', 'jpeg', path, '--out', out], capture_output=True, check=True)
    w, h = size(out)
    return {'file': out, 'w': w, 'h': h}


def blocks(body):
    out, para, lst, quote = [], [], None, []

    def flush():
        nonlocal para, lst, quote
        if para:
            out.append({'k': 'p', 'runs': inline(' '.join(para))}); para = []
        if lst:
            out.append(lst); lst = None
        if quote:
            out.append({'k': 'quote', 'runs': inline('\n'.join(quote))}); quote = []

    for raw in body.splitlines():
        line = raw.rstrip()
        sc = re.match(r'\{%\s*(figureImg|projectVideo)\s+"([^"]+)",\s*"([^"]*)"(.*?)%\}', line)
        if sc:
            flush()
            cap = re.search(r'caption="([^"]*)"', sc.group(4))
            video = sc.group(1) == 'projectVideo'
            out.append({'k': 'video' if video else 'fig', 'src': sc.group(2), 'alt': sc.group(3), 'caption': cap.group(1) if cap else None, **media(sc.group(2), video)})
            continue
        if not line.strip():
            flush(); continue
        h = re.match(r'(#{2,3})\s+(.*)', line)
        if h:
            flush(); out.append({'k': 'h2' if len(h.group(1)) == 2 else 'h3', 'runs': inline(h.group(2))}); continue
        if line.strip() == '---':
            flush(); out.append({'k': 'hr'}); continue
        q = re.match(r'>\s?(.*)', line)
        if q:
            if para:
                flush()
            quote.append(q.group(1).rstrip('\\').rstrip()); continue
        li = re.match(r'\s*(?:[-*]|(\d+)\.)\s+(.*)', line)
        if li:
            kind = 'ol' if li.group(1) else 'ul'
            if para:
                out.append({'k': 'p', 'runs': inline(' '.join(para))}); para = []
            if not lst or lst['k'] != kind:
                if lst:
                    out.append(lst)
                lst = {'k': kind, 'items': []}
            lst['items'].append(inline(li.group(2))); continue
        if lst and raw.startswith('  '):
            lst['items'][-1] += inline(' ' + line.strip()); continue
        para.append(line.strip())
    flush()
    return out


types = json.load(open(os.path.join(ROOT, 'src/_data/writingTypes.json')))


def long_date(d):
    y, m, dd = map(int, d[:10].split('-'))
    return f"{dd} {date(y, m, dd).strftime('%B')} {y}"


pages = []
for path, kind in [('src/work/the-loft.md', 'work'), ('src/work/mega-seating-plan.md', 'work'),
                   ('src/writing/flyer-design-tips.md', 'writing'), ('src/writing/the-hard-part-isnt-the-no.md', 'writing')]:
    meta, body = front(os.path.join(ROOT, path))
    meta_line = meta['services'] if kind == 'work' else f"{long_date(meta['date'])} · {types[meta['type']]['short']}"
    pages.append({'kind': kind, 'title': meta['title'], 'meta': meta_line, 'blocks': blocks(body)})

# Writing listings per type, date desc, hidden excluded (collections.writing + byType)
posts = []
wdir = os.path.join(ROOT, 'src/writing')
for f in sorted(os.listdir(wdir)):
    if not f.endswith('.md'):
        continue
    meta, _ = front(os.path.join(wdir, f))
    if meta.get('hidden') == 'true':
        continue
    m = re.match(r'(\d{4}-\d{2}-\d{2})', f)
    d = meta.get('date') or (m.group(1) if m else None)
    posts.append({'slug': f[:-3], 'title': meta['title'], 'type': meta.get('type'), 'date': d,
                  'month': date(*map(int, d[:10].split('-'))).strftime('%B %Y') if d else None,
                  'source': meta.get('source'), 'image': meta.get('image')})
listing = {t: sorted([p for p in posts if p['type'] == t], key=lambda p: p['date'] or '', reverse=True) for t in types}
json.dump({'pages': pages, 'listing': listing, 'types': types}, open(OUT, 'w'), indent=1, ensure_ascii=False)
print({p['title'][:30]: len(p['blocks']) for p in pages})
print({t: [p['title'][:25] for p in v] for t, v in listing.items()})
