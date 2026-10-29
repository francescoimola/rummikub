# Rhythm: text sizes and spacing

The one rule set for how big text is and how far apart things sit on francescoimola.com. It is the destination of the wayfinder map [Map: one rhythm for text sizes and spacing](https://github.com/francescoimola/rummikub/issues/77); each rule links to the ticket that decided it. Terms (Tight, Flow, Break, Chapter, Hang, Illustration band) are defined in [GLOSSARY.md](../../GLOSSARY.md) under Layout.

**Lens.** The Vignelli Canon as a discipline only: few sizes, few spacing steps, the same pair always gets the same gap, white space does the work. The site is fluid (Utopia `clamp()`, container queries), so the goal is a recognisable rhythm at every width, **not** a strict baseline grid. Typeface and colour are out of scope (Ronzino, KC Pelletier and the brand colours are fixed).

**Pixels are illustrations.** Every rule below is a token. Pixel figures are rendered at the 15px root, wide desktop first, phone in brackets. Never write the pixels into code (AGENTS.md rule 5).

## 1. Type ladder

Four rungs ([Type ladder](https://github.com/francescoimola/rummikub/issues/79), small-print line height amended in [Pair table](https://github.com/francescoimola/rummikub/issues/82)).

| Rung | Token (phone → wide desktop) | Weight | Line height | Used for |
|---|---|---|---|---|
| **Display** | `--step-2-4` (27 → 53px), KC Pelletier, uppercase | 400 | 1.0 | page-header h1, closing call-to-action h2 |
| **Headline** | `--step-1` (20 → 22.5px) | 550 | 1.4 | long-form page title (h1), Collaborate h1 |
| **Body** | `--step-0` (15 → 16.9px) | 400 | 1.5 | p, li, links, buttons, summary, the dimmed line under a title. **h2 at 550, h3 at 425** at this same size, including card headings and section labels |
| **Small** | `--step--1` (11.25 → 12.66px) | 400 | **1.3** | `small`, figcaption, breadcrumb, dates, source, footer © |

- **Headings are body size.** Hierarchy between h2 and h3 comes from weight and space, not size. An h3 is dimmed, except inside a card, where the heading is the card's main heading.
- **Two small sizes became one.** Today `<small>` and captions differ; both are `--step--1`.
- **Frozen outside the ladder:** the home hero (`--step-hero`) fits its container exactly. The root `font-size: 15px` is the base of every `rem`.
- **Letter spacing is unchanged** by this effort.

## 2. Spacing ladder

Four gaps and one exception. Each is an existing Utopia pair token; there are no alias tokens, templates keep using `flow has-gap-*` ([Spacing ladder](https://github.com/francescoimola/rummikub/issues/81), [Enforcing the rules in code](https://github.com/francescoimola/rummikub/issues/84)).

| Gap | Token | Wide desktop (phone) | Meaning |
|---|---|---|---|
| **Tight** | `--space-xs` (`has-gap-xs`) | 12.7px (11.3) | things that belong together |
| **Flow** | `--space-s-m` (`has-gap-s-m`) | 22.9px (15.1) | one thought to the next |
| **Break** | `--space-l-xl` (`has-gap-l-xl`) | 45.9px (30.3) | a new idea inside a section |
| **Chapter** | `--space-xl-3xl` (`has-gap-xl-3xl`) | 88.4px (45.8) | a new section or a page-level block |
| **Hang** (exception) | `--space-3xs` (`has-gap-3xs`) | about 4.5px | something hanging from the thing above it: a heading under a section stroke, a card heading above its text, a caption under its image |

More space goes above a heading than below it. Space belongs to the parent block, never to the image or heading itself.

## 3. Pair table

Which gap sits between which neighbours ([Pair table](https://github.com/francescoimola/rummikub/issues/82), [Component rhythm](https://github.com/francescoimola/rummikub/issues/83), [Horizontal gaps](https://github.com/francescoimola/rummikub/issues/86), [Slicing the build issues](https://github.com/francescoimola/rummikub/issues/87)).

### In running text

| Pair | Gap |
|---|---|
| h2 / h3 → its own text; h2 → h3 directly | **Tight** |
| the line under a page title → the title ("August 2026 · Guides") | **Tight** |
| text → the link or button directly under it; link → link; button → link | **Tight** |
| list items; writing items; card lists | **Tight** |
| a small dimmed line that belongs to text above it (year under a description) | **Tight** |
| the heading above a list → its first item | **Tight** |
| paragraph → paragraph; paragraph → list; paragraph ↔ plain divider | **Flow** |
| above an h2 or h3 inside a section or long-form page | **Break** |
| a quote in running text, above and below | **Break** |
| between sections | **Chapter** |

### Media

| Pair | Gap |
|---|---|
| images inside a pair or grid | **Tight** |
| image block → image block | **Flow** |
| above and below an image, pair or grid | **Break** |
| image → its caption | **Hang** |
| image-led repeated blocks (home project items, Artmaking rows) | **Break** |
| page title → hero image | **Chapter** |

### Components

| Component | Rule |
|---|---|
| **Card** (contact, writing, service, project) | padding `--space-s`; heading → text and stacked small lines **Hang**; text → link or button **Tight**. The service card keeps its deliberate big title gap (`--space-2xl`) as a named exception |
| **Cards stacked in a list**, and grouped testimonials | **Tight** |
| **Closing call-to-action band** | heading → text **Flow**; text → actions **Flow**; the two actions **Tight**; band padding **Chapter** above and below |
| **Footer** | Contact heading + intro → first card **Flow**; cards **Tight**; the colophon's lines (text, badges, ©) **Flow**. The big Figma-drawn spaces around the drawing and colophon stay as drawn |
| **Page hero** | gap between drawing and title, and hero padding: **Chapter** |
| **Wide illustration** | an illustration band: **Chapter** between blocks, **Break** padding inside, no margin on the drawing |
| **Recognition** (About) | year | entries **Tight** (sideways); groups **Flow** apart; the entries in a group keep their Tight stack |
| **FAQ accordion** | 1px divider centred, **Tight** each side, so an open answer ends with the same gap before the line |

## 4. Sideways gaps

Same kind of thing next to each other, in either direction, is **Tight** ([Horizontal gaps](https://github.com/francescoimola/rummikub/issues/86)). Rows of links (header menu, social, carousel Previous / Next), rows of controls (look toggles), side-by-side columns (label | text, thumbnail | text, Artmaking text | text), cards and image grids, colophon badges. Break and Chapter are never used sideways.

Outside the ladder, each marked `rhythm-exempt`:

- the icon gap (`--icon-gap`), inside one word;
- brand-colour swatches;
- the page gutter (`--gutter`, `--space-s-m`), the header, hero and footer inset (`--space-m-l`) and the wide header's three tracks (`--space-l`);
- bullet-list indent, the footer's Figma-drawn spaces, card padding.

## 5. Strokes

Line thickness is a multiple of `--input-border-width`: **thin** 1× (`--stroke-thin`) and **thick** 4× (`--stroke-thick`). A plain `<hr>` and a markdown `---` are thin; `<hr class="stroke-thick">` is thick ([Enforcing the rules in code](https://github.com/francescoimola/rummikub/issues/84)). Both use the input border colour (`--input-border-color`), the same as the FAQ dividers ([Slicing the build issues](https://github.com/francescoimola/rummikub/issues/87)).

A **section stroke** starts a new section: Break above it, the heading hanging **Hang** below it. An **accordion divider** separates FAQ questions and is always thin.

## 6. Keeping to the rules

`pnpm lint` fails on off-ladder gap classes in templates, off-ladder `--space-*` gaps and margins in SCSS (vertical and sideways), `has-mb-*` / `has-mt-*` in templates, and `font-size` in SCSS that is not a `--step-*` token. Each failure suggests the nearest ladder step. A deliberate exception carries a `rhythm-exempt` marker. Where `.text` meets `flow`, `flow` alone sets the gap. Long-form pages keep their `.case-study>*+*` context rule.

**Checking a page:** read the gaps with the DevTools probe in [docs/devtools-probes.md](../devtools-probes.md) at phone, tablet and wide desktop, and compare against the pair table above. Never use browser automation.
