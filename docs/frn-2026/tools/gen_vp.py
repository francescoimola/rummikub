import json, re, sys
from urllib.parse import quote

OUT = sys.argv[1]
C = "Utopia"
MODES = ["Min", "Max"]

def ref(name):
    return "{{" + quote(C) + "::" + quote(name, safe="") + "}}"

V = []

def driver(name, vmin, vmax, desc, t="FLOAT"):
    V.append({"name": name, "resolvedType": t, "description": desc,
              "valuesByMode": {"Min": vmin, "Max": vmax},
              "expressionsByMode": {}, "expressionMetadataByMode": {}})

def formula(name, emin, desc, emax=None):
    V.append({"name": name, "resolvedType": "FLOAT", "description": desc,
              "valuesByMode": {},
              "expressionsByMode": {"Min": emin, "Max": emax if emax is not None else emin},
              "expressionMetadataByMode": {}})

ROOT = "Site root is 15px (index.scss), so repo px = config px x 15/16."

# Drivers
driver("type/base", 15, 16.875, f"DRIVER: --step-0 at each pole. Utopia config 16 -> 18px over 360 -> 1920 (_scale.scss). {ROOT}")
driver("type/ratio", 1.333, 1.333, "DRIVER: modular scale ratio (--type-ratio, _scale.scss).")
driver("space/base", 15, 16.875, f"DRIVER: --space-s at each pole. Utopia config 16 -> 18px (_cleacss-overrides.scss). {ROOT}")
driver("layout/content-width", 330, 900, "DRIVER: inline width of the split sections + home hero. Min = 360 - 2 x space/s-m Min; Max = --grid-width-l (60rem = 900px at 15px root), standing in for the 982px in the Figma frames.")
driver("layout/inline-size", 600, 600, "DRIVER: long-form text column cap = --inline-size (40rem = 600px at 15px root, index.scss:99), a constant in the repo. Bound as max width on Fill text blocks, so mobile fills and tablet caps at 600.")
driver("size/hero-illustration", 154, 220, "DRIVER (new in redesign): hero illustration height. Max = 220px (desktop as designed); Min = 70% (154px, user choice). Width follows the locked aspect ratio. Port: block-size: var(--size-hero-illustration) as a Utopia clamp.")
driver("size/illustration-wide", 345, 449.28, "DRIVER (Phase 17 Q36): width of the wide in-page illustration (Work collaboration drawing). Min 345 = mobile column, Max 449.28 as designed.")
driver("letter-spacing/s", -0.6, -0.6, "--letter-spacing-s: -0.04rem at 15px root.")
driver("letter-spacing/m", 0.105, 0.105, "--letter-spacing-m: 0.007rem at 15px root.")
driver("font-size-7", 12.75, 15, "cleacss --font-size-7: clamp(.85rem, .8rem + .16vw, 1rem) at 15px root. figcaption size (testimonial attributions).")
driver("font/body", "Ronzino", "Ronzino", "--font-family (index.scss).", "STRING")
driver("font/display", "KC Pelletier Sans", "KC Pelletier Sans", "New in redesign: display face for hero headings.", "STRING")

# Type steps
base, ratio = ref("type/base"), ref("type/ratio")
formula("step/-1", f"{base} / {ratio}", "--step--1 = base / ratio")
formula("step/0", base, "--step-0: body, h2/h3, links")
for n in range(1, 6):
    note = {1: "h1 / step-1 headings", 2: "--step-2", 3: "--step-3 (new, extended scale)", 4: "--step-4 (new): section hero headings", 5: "--step-5 (new): alt section hero size"}[n]
    formula(f"step/{n}", f"{base} * POWER({ratio}, {n})", f"--step-{n} = base x ratio^{n}. {note}")
formula("step/2-4", ref("step/2"), "New (Phase 17 Q20): section hero + CTA heading size, a Utopia type pair. Min = step/2, Max = step/4. Port: --step-2-4 clamp.", emax=ref("step/4"))
formula("type/small", f"{base} * 5 / 6", "<small> element: font-size smaller = step-0 / 1.2 (dates, sources). No repo token.")
formula("step/hero", f"{ref('layout/content-width')} * 1000 / 5196",
        "New: home hero size. Widest line ('YOUR BIG IDEAS') is 5.196em, so this makes it span layout/content-width.")

# Space steps
sb = ref("space/base")
steps = [("4xs", " / 8", 0.125), ("3xs", " / 4", 0.25), ("2xs", " / 2", 0.5), ("xs", " * 3 / 4", 0.75), ("s", "", 1),
         ("m", " * 3 / 2", 1.5), ("l", " * 2", 2), ("xl", " * 3", 3), ("2xl", " * 4", 4), ("3xl", " * 6", 6), ("4xl", " * 8", 8)]
# Utopia rounds each space step to whole px in its 16px-root config, so round there and convert back to the 15px root
for k, op, m in steps:
    formula(f"space/{k}", f"ROUND({sb} * 16 / 15{op}, 0) * 15 / 16",
            f"--space-{k} = space/base x {m}, rounded to whole config px like Utopia")

pairs = ["4xs-3xs", "3xs-2xs", "2xs-xs", "xs-s", "s-m", "m-l", "l-xl", "xl-2xl", "2xl-3xl", "3xl-4xl",
         "3xs-xl", "3xs-m", "s-l", "s-xl", "s-2xl", "m-xl", "l-2xl", "l-3xl", "l-4xl", "xl-3xl", "xl-4xl", "2xl-4xl"]
for p in pairs:
    a, b = p.split("-", 1)
    formula(f"space/{p}", ref(f"space/{a}"), f"--space-{p}: Min = space/{a}, Max = space/{b}", emax=ref(f"space/{b}"))

# Line heights and letter spacing
# Variables Plus returns 0 for arithmetic on a pure alias (step/0 is one), so derive from type/base directly
formula("line-height/body", f"{base} * 3 / 2", "--line-height: 1.5 on step/0")
formula("line-height/step-1", f"{ref('step/1')} * 7 / 5", "h1 at --step-1: line-height 1.4 (index.scss:200)")
formula("line-height/hero", f"{ref('step/hero')} * 37 / 50", "New: home hero line-height 0.74 (142 / 192.47 in Figma)")
formula("letter-spacing/l", f"{base} * 11 / 1000", "--letter-spacing-l: 0.011em, resolved on step/0")
formula("letter-spacing/xl", f"{base} * 21 / 1000", "--letter-spacing-xl: 0.021em, resolved on step/0")
formula("letter-spacing/hero", f"{ref('step/hero')} * -3 / 100", "New: home hero tracking -0.03em (-5.64 / 192.47 in Figma)")
formula("layout/gutter", ref("space/s-m"), "--gutter-x / --gutter-y = --space-s-m")

doc = {"version": 1, "collections": [{"name": C, "modes": [{"name": m} for m in MODES], "variables": V}]}
json.dump(doc, open(OUT, "w"), indent=2)
print(len(V), "variables")
