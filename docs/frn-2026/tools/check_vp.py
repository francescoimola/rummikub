import json, re, sys
from urllib.parse import unquote

doc = json.load(open(sys.argv[1]))
col = doc["collections"][0]
modes = [m["name"] for m in col["modes"]]
byname = {v["name"]: v for v in col["variables"]}
assert len(byname) == len(col["variables"]), "duplicate names"
cache = {}

def val(name, mode):
    key = (name, mode)
    if key in cache:
        return cache[key]
    v = byname[name]
    if v["expressionsByMode"]:
        assert set(v["expressionsByMode"]) == set(modes), name
        expr = v["expressionsByMode"][mode]
        def sub(m):
            c, n = m.group(1).split("::")
            assert unquote(c) == col["name"], c
            r = unquote(n)
            assert r in byname, f"unresolved {r} in {name}"
            return repr(val(r, mode))
        py = re.sub(r"\{\{(.+?)\}\}", sub, expr).replace("POWER", "pow").replace("ROUND", "rnd")
        out = eval(py, {"pow": pow, "rnd": lambda x, d: float(int(x * 10**d + 0.5)) / 10**d})
    else:
        assert set(v["valuesByMode"]) == set(modes), name
        out = v["valuesByMode"][mode]
    cache[key] = out
    return out

rows = []
for n, v in byname.items():
    vals = [val(n, m) for m in modes]
    rows.append((n, vals))
for n, vals in rows:
    print(f"{n:24} " + "  ".join(f"{x:>9.3f}" if isinstance(x, float) or isinstance(x, int) else f"{x:>9}" for x in vals))
