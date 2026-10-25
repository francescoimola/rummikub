# Change inventory: section 2260:2139 vs repo (2026-10-24)

Baseline: repo templates + CSS on `development` (read-only). "Old" = what the repo renders today.

## A. Layout and structure (context only: the token work binds these, it doesn't redesign them)

| # | Where | Old (repo) | New (Figma) |
|---|---|---|---|
| A1 | All pages | Left sidebar holds name, nav, footer, look toggles | Full-width top header bar on `#e6f4bd`; sidebar gone |
| A2 | Nav | Start here, Work with me, Case studies, Ideas & guides, Artmaking, About, Say hello; mobile "Menu" disclosure | `•` Start here, Work with me, Ideas, Artmaking, About, Say hello. "Case studies" removed, "Ideas & guides" → "Ideas"; mobile shows a 3-column link grid, no disclosure |
| A3 | Hero band | None | `#e6f4bd` band with a display headline in **KC Pelletier Sans**: Home (192px), Work with me (55px + illustration), Ideas ("Blog", 55px + illustration + subtitle), Artmaking (55px, no band fill) |
| A4 | Content surface | `--body-bg` (brand-50); contrast mode on some pages | White `#ffffff` main-content band on every page |
| A5 | Footer | "Up for a chat?" + copy email + book call (+ mobile link list) | Large `#e6f4bd` band: Contact intro, 4 cards (email, video call, template email, socials) on 5% tint, illustration, ©, site note, D! logo + Creatives for Climate badge |
| A6 | Section pattern | Mixed (flow stacks, split-row on /art/) | Label column on the left, content column on the right, used on every page |
| A7 | Look toggles | Present (theme + brand picker) | Absent |
| A8 | Home | Profile media + headline + intro + 2 links | Intro + small photo + "More about me"; **Featured** (3 project items), **Explorations** carousel (prev/next), **Index** project list |
| A9 | Work with me | `/studio/` content | Hero; "Where I can help" chip + numbered service cards; "Smaller projects" accordion; illustration; "Happy humans" testimonial grid; case-study image; "Typical clients" cards |
| A10 | Ideas & Guides | pageHeader + sections, 3 items each | "Blog" hero; Essays / Guides / Notes rows; items as tinted cards (thumb, title, date) |
| A11 | Artmaking | split-row per project | Two display statements as hero; split rows with label column |
| A12 | About | Bio, Philosophy, FAQ, Recognition | Same sections restyled in label/content rows + "I'm an agency", "About this website", "Credits" |

## B. Token-level edits (scope for this session)

### Colour (UI): every one matches a repo token exactly (ΔE_OK ≤ 0.001) except where noted
| Figma | Count | Used for | Repo token |
|---|---|---|---|
| `#e6f4bd` | 17 | header / hero / footer bands | `--brand-150` |
| `#ecf8ca` | 3 | "Where I can help" label chips | `--brand-100` |
| `#383e2a` @95% | 230 | body text | `--neutral-950-alpha` |
| `#383e2a` @83% | 28 | recognition years | `--neutral-900-alpha` |
| `#383e2a` @69% | 4 | award org / publication | `--neutral-800-alpha` |
| `#383e2a` @5% | 46 | contact cards, writing items, service cards | `--neutral-100-alpha` |
| `#383e2a` @3% / 22% / 33% (strokes) | 28 | card borders, FAQ dividers | `--neutral-50-alpha` / `-400-alpha` / `-500-alpha` |
| `#383e2a` | 30 | headings, hero display text | `--neutral-950` |
| `#5c7c01` | 105 | links, labels (accent) | `--brand-800` |
| `#345900` | 46 | active nav link, footer illustration | `--brand-900` |
| `#ffffff` | 16 | main-content band, carousel buttons | **open**: white vs `--content-light` (ΔE 0.016) vs `--neutral-50` (ΔE 0.014) |
| `#3c3c43` @60% | 2 | service numbers "01/02" | **open**: off-palette (iOS grey); nearest `--neutral-700-alpha` (base ΔE 0.046, α .56 vs .60) |

### Type
| Figma | Count | Repo token | Note |
|---|---|---|---|
| Ronzino Regular 15.07 / 15.53 / 16.05 / 16.51 / 16.76 | ~330 | `--step-0` | same token frozen at containers ≈392 / 750 / 1156 / 1514 / 1709px (root 15px) |
| Ronzino Medium 16.05 / 16.76 | ~90 | `--step-0` + `--font-weight-medium` | Figma uses weight 500; repo is 425 (variable font) |
| Ronzino Bold 16.05 | 1 | `--font-weight-bold` | Figma 700; repo 550 |
| Ronzino Regular **13.97** | 10 | **new?** | dates / source in writing items; repo `--step--1` max is 12.66px |
| Ronzino Regular **14.74** | 9 | **new?** | testimonial attributions |
| **KC Pelletier Sans** 192.47 / lh 142 / ls −5.64px | 1 | **new font + new size** | Home hero |
| **KC Pelletier Sans** 55.17 / lh auto | 4 | **new font + new size** | other heroes |
| Letter spacing 0.1px / 0.18px / 0.34px | — | `--letter-spacing-m` / `-l` / `-xl` | `%`-unit copies (0.1%, 0.34%) are capture errors |
| Line height 1.5 | all body | `--line-height: 1.5` | |

### Spacing and radius
| Figma | Repo token |
|---|---|
| 20.75, 4.27, 12.3, 15.83, 8.02, 24.07, 6.37, 16.05 | `--space-s-m`, `-3xs`, `-xs`, `-3xs-m`, `-2xs`, `-m`, `-3xs-2xs`, `-s` at container 1156 (Δ ≤ 0.02px) |
| 15.39, 30.78, 31.42 / 24.68 / 93.13 | `--space-s-m`, `-l-xl`, `-l-2xl` @392 / `-s-m` @1709 / `-3xl` @750 |
| 57.48, 114.96, 10.5, 26.69 | near `--space-xl-2xl`, `-3xl-4xl`, `-2xs-xs`, `--step-2`; Δ 0.1–0.2px, **confirm** |
| Integers 4–72 (8, 16, 20, 24, 32, 40, 48, 56, 72) | hand-set in the 390/834 frames and new parts; map per breakpoint |
| One-off widths 360 / 392 / 397 / 437 | layout widths, not tokens |
| Radius 2 / 4 | `--border-radius-s` / `--border-radius` |

### Excluded (stay raw)
- Sticker / illustration / logo vector internals (`#f8dc4e`, `#dad9d8`, `#edd364`, `#061308`, …).
- Writing thumbnail swatches (`bg/link-swatch`): the build generates these randomly (`writingThumbColors`).
- Image fills; remote `Icon` instances (16); `Illustration` instances (7).
