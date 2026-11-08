# Site notes

Reference for agents, one section per topic. `AGENTS.md` says when to read each one. Edit a section only when a change makes something it says false.

## Coding standards

Judgement rules for review. Mechanical rules are checked by `pnpm lint` (`scripts/lint.sh`) and the tests, so they are not repeated here. Repo conventions live in `AGENTS.md`.

### Design to code

- **The repo wins on existing values.** When Figma and the repo disagree on a value the repo already sets, the repo's value stays.
- **Figma px are a snapshot.** Every size is a Utopia token or a `clamp()`; layout comes from fluid scales, intrinsic grids and `@container` queries, with a viewport breakpoint only as a fallback. A raw px copied from Figma is a finding.
- **One fix per shared pattern.** A layout bug fixed on one page is fixed in the pattern: find every caller (the hero bleed needed the homepage hero, `.page-header` and `.collab-hero` alike).
- **A page contains what its frame draws.** An element the repo has and the frame lacks (an extra CTA, an arrow) is removed.
- **Typefaces are fixed.** KC Pelletier Sans for the hero and CTA headings, Ronzino for everything else.

### Content and markup

- **Arrow rule.** A link gets Icon/Arrow-right only when its label doesn't make clear it leaves the page ("More about me"), or when leaving is hard to undo ("To main site"). A label that already implies a new page ("Read case study") gets none. External links use `arrow-ext`.
- **Images keep their natural shape** unless `ratio=` is passed (`--ratio-3-2` and the other ratio-named tokens). The Explorations carousel is the one fixed crop (3:2).
- **Editable content goes through Pages CMS.** Copy or media an editor would change (carousel slides, FAQs, art projects) lives in `src/_data/*.json` or front matter with a matching `.pages.yml` entry, not hard-coded in a template.
- **Words follow `GLOSSARY.md`** in labels, class names and data keys (Explorations, Case study, Ideas).

### Comments

- **One comment, one line.** SCSS and CSS comments are single-line `//`, never wrapped prose across consecutive lines. Property-specific detail goes on the line above (or trailing) that property. Keep the *why*, drop the essay. (`/* */` blocks and SCSS comments over 25 words are caught by `pnpm lint`.)

### Rhythm rules

- **The same pair gets the same gap.** Spacing follows the pair table in [Rhythm](#rhythm): Tight between things that belong together (sideways too), Flow between thoughts, Break above a new idea, Chapter between sections, Hang only for a heading or caption hanging from the thing above. A new gap is a finding unless the pair table names it.
- **Space belongs to the parent.** Set the gap on the parent's `flow`, never as a margin on the child (`has-mb-*` / `has-mt-*` are caught by `pnpm lint`). Where `.text` meets `flow`, `flow` alone sets the gap.
- **Four type rungs.** Display, headline, body and small. A new `font-size` or a heading at a size of its own is a finding; h2 and h3 differ by weight, not size.
- **An exception says why.** A gap or size outside the ladder carries `rhythm-exempt` and a reason on the same line; `pnpm lint` checks the mechanical part.

## CSS architecture

Read before editing `src/css`. Source comments and `scripts/lint.sh` cite these as "CSS rule N", so keep the numbering.

1. **No `@import`** — it's deprecated in Dart Sass and removed in 3.0. Every partial, cleacss included, is a `@use` at the top of `index.scss`. Module CSS is emitted in `@use` order, so position in that list is load-bearing.

2. **cleacss is vendored and trimmed** — Lives at `src/css/vendor/cleacss.css`, cut down to the classes the site uses. The file may be edited directly. Do not `pnpm add` it. Loaded with `@use 'vendor/cleacss'` right after `components` (where the old `@import` emitted it) — `@use` **inlines its contents** into one bundled stylesheet. Never revert to `@import`: besides the deprecation, `@import "x.css"` emits a runtime import (extra render-blocking request, unminified). There is no passthrough copy of `src/css/vendor` — nothing requests it.

3. **`@layer` names in use:** cleacss's `reset`, `layout`, `elements`, `is`, `has` (do not write to them), then ours: `fonts`, `colors`, `type`. Layers are for variable/token declarations only. All other styles go unlayered in `index.scss`.

   **Layer order is pinned, not incidental.** Priority is set by the order layer names *first appear*, so inlining cleacss would otherwise let our `fonts`/`colors`/`type` be named first and flip cleacss's layers above our tokens site-wide, silently. `src/css/_layers.scss` holds one `@layer reset, layout, elements, is, has, fonts, colors, type;` statement and **must stay the first `@use` in `index.scss`** — Sass emits module CSS in `@use` order, so it lands ahead of everything. LightningCSS strips the statement when source order already agrees; that's fine, the emitted order is what matters.

   **Exception — tokens that collide with cleacss must be unlayered.** cleacss ships its *own* unlayered `--space-*` scale, `--font-weight-bold`, and `--color-{success,warning,error,info}`/`--input-border-color` at `:root`. Per the cascade-layers spec, **unlayered always beats layered regardless of source order or specificity**, so a colliding token placed inside `@layer type`/`@layer colors` silently loses to cleacss's default. Our overriding tokens therefore all live in one unlayered mixin — `cleacss-overrides.overrides` in `src/css/_cleacss-overrides.scss` — that `index.scss` `@include`s **after** the cleacss `@use` (unlayered + later source order = wins). Only genuinely new token names or type-scale (`--step-*`) are collision-free and can stay layered. When adding a token, check whether cleacss already defines that exact name; if so, add it to `_cleacss-overrides.scss`, not a `@layer`.

4. **Colour mode** — cleacss uses `light-dark()` natively. Light/dark follows the OS and there is no manual switch: Safari 26 tints its toolbar from the page only while the page theme matches the Mac's appearance, so a site switch that disagrees with the OS loses the tint. Don't reintroduce one.

5. **OKLCH colours** — native oklch renders P3-wide automatically, so no `@supports (color: color(display-p3))` block is needed, but it does not keep a colour inside what the screen can show. Every brand step must sit inside Display P3: outside it, iOS draws the status-bar strip, gradients and plain fills in visibly different tints, while screenshots still show one flattened value.

6. **Content modes** — Pages set `contentMode: contrast` in frontmatter to give content a white background with accent-coloured links. Omit `contentMode` for the default layout on the page background. Renders as `data-content="contrast"` on `.layout` in `_base.njk`.

7. **Colour scales** — All colour scales (`--brand-*`, `--neutral-*`, `--success-*`, `--warning-*`, `--error-*`, `--info-*`) use Figma-generated oklch values with `light-dark()` for dark mode. Scales use 50–950 step numbering. The brand scale's tokens are `--brand-{step}` (formerly `--green-*`) — named for their role, since the hue is re-tintable (see rule 9). Neutral has both solid (`--neutral-{step}`) and alpha (`--neutral-{step}-alpha`) variants. Alpha variants use the darkest neutral step as base (950 in light, 50 in dark) with consistent alpha values across modes.

8. **Cleacss semantic overrides** — `--color-success`, `--color-warning`, `--color-error`, `--color-info`, and `--input-border-color` are set in the unlayered `overrides` mixin in `_cleacss-overrides.scss` (see rule 3 for why unlayered) to override cleacss's hardcoded defaults, linking form validation states to our Figma scales (500 step). That same mixin also holds the non-colour collisions — the `--space-*` scale and `--font-weight-bold: 550` (vs. cleacss's `700`).

9. **Brand re-tint knobs** — The brand scale (`--brand-{step}`) is parametric: every step's hue is `calc(var(--brand-hue) + <per-step offset>)` and chroma is `calc(<orig> * var(--brand-chroma))`. Both are registered via `@property` (`<number>`, so they animate). Defaults (`--brand-hue: 119.4`, `--brand-chroma: 1`) reproduce the original Figma scale exactly. Per-step hue offsets preserve each mode's hue-twist relative to base 119.4°. Re-tint the whole scale (and everything derived from it — `--color-accent`, hover, surfaces, content tokens) by changing `--brand-hue`/`--brand-chroma`: via the `:root[data-brand="…"]` hook in `_colors.scss` (currently `pink` → hue 360, `orange` → hue 55), via `brand: <name>` page frontmatter (rendered as `data-brand` on **`<html>`** in `_base.njk`), or from JS with `document.documentElement.style.setProperty('--brand-hue', 350)`. **The hook must target `:root`/`<html>`** — the `--brand-*` tokens are declared on `:root`, so their `var(--brand-hue)` is substituted there; overriding the hue on a descendant (e.g. `.layout`) only inherits the already-computed values and won't re-tint. Lower `--brand-chroma` (e.g. `0.85`) if a rotated hue looks over-saturated.

    **Rotated hues hit the gamut limit.** The chroma values were tuned on green, and at pink and orange hues the pale steps and several dark-mode steps leave Display P3 (rule 5). Those steps are replaced in each `:root[data-brand="…"]` hook by literals: the formula's colour with each channel clipped to sRGB, which matches what iOS drew before. Literal steps ignore `--brand-hue` and `--brand-chroma`, so re-tinting pink or orange means recomputing them (`oklch-skill` covers gamut conversion). A new preset hue needs the same treatment for whichever steps leave Display P3.

10. **Breakpoints live in one file** — every viewport `@media (width …)` and `@container` rule goes in `src/css/_responsive.scss`, one block per condition, so a breakpoint is never written twice. Base rules in `index.scss`/`_components.scss` describe the mobile state; the breakpoint block holds the override. **Why it's a mixin:** Sass emits `@use`'d module CSS *before* the using file's own, so a plain `@use 'responsive'` partial would land at the top and lose — media queries add no specificity, so equal-specificity conflicts resolve on source order alone. Wrapping in `@mixin all` and `@include responsive.all;` as the **last statement** in `index.scss` puts it after everything it overrides. Same trick as `_cleacss-overrides.scss` (rule 3). Block order inside the mixin is load-bearing: max-width ascending, then min-width ascending. **Exception:** feature queries (`hover: hover`, `forced-colors: active`, `prefers-reduced-motion`) stay nested with the rule they modify — they describe one selector's state, not a layout fold. Breakpoint Sass vars (`$bp-*`) still live in `_scale.scss`.
11. **Gaps sit on the rhythm ladder** — a `gap`, `column-gap`, `row-gap` or `margin` that uses a `--space-*` token uses one of `--space-xs` (Tight), `--space-s-m` (Flow), `--space-l-xl` (Break), `--space-xl-3xl` (Chapter) or `--space-3xs` (Hang); `font-size` is a `--step-*` token. The rule set and pair table are in [Rhythm](#rhythm). `pnpm lint` fails on anything else, with the nearest step as a suggestion. A deliberate exception (an icon gap, a layout track, the root size) carries `rhythm-exempt` and a reason on the same line.

## Rhythm

The one rule set for how big text is and how far apart things sit on francescoimola.com. It is the destination of the wayfinder map [Map: one rhythm for text sizes and spacing](https://github.com/francescoimola/rummikub/issues/77); each rule links to the ticket that decided it. Terms (Tight, Flow, Break, Chapter, Hang, Illustration band) are defined in [GLOSSARY.md](../GLOSSARY.md) under Layout.

**Lens.** The Vignelli Canon as a discipline only: few sizes, few spacing steps, the same pair always gets the same gap, white space does the work. The site is fluid (Utopia `clamp()`, container queries), so the goal is a recognisable rhythm at every width, **not** a strict baseline grid. Typeface and colour are out of scope (Ronzino, KC Pelletier and the brand colours are fixed).

**Pixels are illustrations.** Every rule below is a token. Pixel figures are rendered at the 15px root, wide desktop first, phone in brackets. Never write the pixels into code (AGENTS.md rule 5).

### 1. Type ladder

Four rungs ([Type ladder](https://github.com/francescoimola/rummikub/issues/79), small-print line height amended in [Pair table](https://github.com/francescoimola/rummikub/issues/82)).

| Rung | Token (phone → wide desktop) | Weight | Line height | Used for |
|---|---|---|---|---|
| **Display** | `--step-2-4` (27 → 53px), KC Pelletier, uppercase | 400 | 1.0 | page-header h1, closing call-to-action h2 |
| **Headline** | `--step-1` (20 → 22.5px) | 550 | 1.4 | long-form page title (h1), Collaborate h1 |
| **Body** | `--step-0` (15 → 16.9px) | 400 | 1.5 | p, li, links, buttons, summary, the dimmed line under a title. **h2 at 550, h3 at 425** at this same size, including card headings and section labels |
| **Small** | `--step--1` (11.25 → 12.66px) | 400 | **1.3** | `small`, figcaption, breadcrumb, dates, source, footer © |

- **Headings are body size.** Hierarchy between h2 and h3 comes from weight and space, not size. An h3 is dimmed, except inside a card, where the heading is the card's main heading.
- **Two small sizes became one.** Today `<small>` and captions differ; both are `--step--1`.
- **Frozen outside the ladder:** the pre-footer hero (`--step-hero`) fits its container exactly. The root `font-size: 15px` is the base of every `rem`.
- **Letter spacing is unchanged** by this effort.

### 2. Spacing ladder

Four gaps and one exception. Each is an existing Utopia pair token; there are no alias tokens, templates keep using `flow has-gap-*` ([Spacing ladder](https://github.com/francescoimola/rummikub/issues/81), [Enforcing the rules in code](https://github.com/francescoimola/rummikub/issues/84)).

| Gap | Token | Wide desktop (phone) | Meaning |
|---|---|---|---|
| **Tight** | `--space-xs` (`has-gap-xs`) | 12.7px (11.3) | things that belong together |
| **Flow** | `--space-s-m` (`has-gap-s-m`) | 22.9px (15.1) | one thought to the next |
| **Break** | `--space-l-xl` (`has-gap-l-xl`) | 45.9px (30.3) | a new idea inside a section |
| **Chapter** | `--space-xl-3xl` (`has-gap-xl-3xl`) | 88.4px (45.8) | a new section or a page-level block |
| **Hang** (exception) | `--space-3xs` (`has-gap-3xs`) | about 4.5px | something hanging from the thing above it: a heading under a section stroke, a card heading above its text, a caption under its image |

More space goes above a heading than below it. Space belongs to the parent block, never to the image or heading itself.

### 3. Pair table

Which gap sits between which neighbours ([Pair table](https://github.com/francescoimola/rummikub/issues/82), [Component rhythm](https://github.com/francescoimola/rummikub/issues/83), [Horizontal gaps](https://github.com/francescoimola/rummikub/issues/86), [Slicing the build issues](https://github.com/francescoimola/rummikub/issues/87)).

#### In running text

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

#### Media

| Pair | Gap |
|---|---|
| images inside a pair or grid | **Tight** |
| image block → image block | **Flow** |
| above and below an image, pair or grid | **Break** |
| image → its caption | **Hang** |
| image-led repeated blocks (stacked project items, Artmaking rows) | **Break** |
| project rows, once split text \| image | **Flow** |
| page title → hero image | **Chapter** |

#### Components

| Component | Rule |
|---|---|
| **Card** (contact, writing, service, project) | padding `--space-s`; heading → text and stacked small lines **Hang**; text → link or button **Tight**. The service card keeps its deliberate big title gap (`--space-2xl`) as a named exception |
| **Cards stacked in a list**, and grouped testimonials | **Tight** |
| **Closing call-to-action band** | heading → text **Flow**; text → actions **Flow**; the two actions **Tight**; band padding **Chapter** above and below |
| **Footer** | Contact heading + intro → first card **Flow**; cards **Tight**; the colophon's lines (text, badges, ©) **Flow**. The big Figma-drawn spaces around the drawing and colophon stay as drawn |
| **Page hero** | gap between drawing and title, and hero padding: **Chapter** |
| **Pre-footer hero** (homepage) | band padding **1.5 × Chapter** above and below, a marked `rhythm-exempt` exception for the room the slogan needs; touches the footer |
| **Intro** (homepage) | title, photos, introduction and Intro accordions **Break** apart; photos **Tight** sideways |
| **Wide illustration** | an illustration band: **Chapter** between blocks, **Break** padding inside, no margin on the drawing |
| **Recognition** (About) | year | entries **Tight** (sideways); groups **Flow** apart; the entries in a group keep their Tight stack |
| **FAQ accordion** | 1px divider centred, **Tight** each side, so an open answer ends with the same gap before the line |

### 4. Sideways gaps

Same kind of thing next to each other, in either direction, is **Tight** ([Horizontal gaps](https://github.com/francescoimola/rummikub/issues/86)). Rows of links (header menu, social, carousel Previous / Next), rows of controls (look toggles), side-by-side columns (label | text, thumbnail | text, Artmaking text | text), cards and image grids, colophon badges. Break and Chapter are never used sideways.

Outside the ladder, each marked `rhythm-exempt`:

- the icon gap (`--icon-gap`), inside one word;
- brand-colour swatches;
- the page gutter (`--gutter`, `--space-s-m`), the header, hero and footer inset (`--space-m-l`) and the wide header's three tracks (`--space-l`);
- bullet-list indent, the footer's Figma-drawn spaces, card padding.

### 5. Strokes

Line thickness is a multiple of `--input-border-width`: **thin** 1× (`--stroke-thin`) and **thick** 4× (`--stroke-thick`). A plain `<hr>` and a markdown `---` are thin; `<hr class="stroke-thick">` is thick ([Enforcing the rules in code](https://github.com/francescoimola/rummikub/issues/84)). Both use the input border colour (`--input-border-color`), the same as the FAQ dividers ([Slicing the build issues](https://github.com/francescoimola/rummikub/issues/87)).

A **section stroke** starts a new section: Break above it, the heading hanging **Hang** below it. An **accordion divider** separates FAQ questions and is always thin.

### 6. Keeping to the rules

`pnpm lint` fails on off-ladder gap classes in templates, off-ladder `--space-*` gaps and margins in SCSS (vertical and sideways), `has-mb-*` / `has-mt-*` in templates, and `font-size` in SCSS that is not a `--step-*` token. Each failure suggests the nearest ladder step. A deliberate exception carries a `rhythm-exempt` marker. Where `.text` meets `flow`, `flow` alone sets the gap. Long-form pages keep their `.case-study>*+*` context rule.

**Checking a page:** read the gaps with the DevTools probe in [DevTools probes](#devtools-probes) at phone, tablet and wide desktop, and compare against the pair table above. Never use browser automation.

## Long-form pages

Case studies and writing posts share **one** branch in `_base.njk` → `<main class="case-study text">`, writing adding `writing-post`. It renders a `.case-study__intro` (h1 + one dimmed line: `services` on work, `<time>` + type on writing) and nothing else — the opening image is authored as the first `figureImg` **in the body**, not by the template. `image:`/`alt:` frontmatter is listing-thumbnail and OG duty only; a post without one just leads with the intro then text. A standalone page opts into the same shell with `longForm: true` (Accessibility): no `writing-post` class, and the intro line reads "Last updated" from `updated`.

Media rhythm (`.case-study` in `_components.scss`) and the scroll animation (`_responsive.scss`) both key off `.case-study__intro`: the first media after it gets `settle` (bleeds on load, pulls in over 50vh of scroll). Later media never animate. Figures and media pairs sit at the 60rem column (`--grid-width-l`), wider than the 40rem text, on every page; media ending the page carries no trailing margin. Removing the intro div silently kills `settle`. Browsers without `animation-timeline` (Firefox) get the same keyframes scrubbed from JS: `app-core.js` dynamically imports `scroll-fallback.js`, which finds targets by the `--scroll-fallback` custom property the CSS sets and writes `--scroll-p` — so target selectors and the breakpoint live only in `_responsive.scss`.

**Always use `figureImg` for body images — never markdown `![]()`.** Markdown compiles to `<p><picture>`, and two images on adjacent lines land in the *same* `<p>`, so they stack with no gap and support no caption. `figureImg` emits a real `<figure>` that the spacing and animation selectors match.

```njk
{% figureImg "/assets/writing/x.png", "Alt text" %}
{% figureImg "/assets/writing/x.png", "Alt", caption="Optional caption" %}
{% figureImg "/assets/writing/x.png", "Alt", href="https://…" %}   {# wraps img in a target=_blank link #}
{% figureImg "/assets/writing/x.png", "Alt", class="extra" %}      {# extra class on the <figure> #}
{% figureImg "/assets/writing/x.png", "Alt", imgClass="extra" %}   {# extra class on the <img> itself #}
{% figureImg "/assets/writing/x.png", "Alt", position="62% 18%" %} {# object-position crop #}
{% figureImg "/assets/writing/x.png", "Alt", ratio="3:2" %}        {# crop to --ratio-3-2 (also projectVideo); unknown ratio fails the build #}
{% mediaPair %}{% figureImg … %}{% figureImg … %}{% endmediaPair %} {# two figures side by side, stacking below $bp-s #}
```

**Object-position picker (dev only):** under `pnpm start`, Alt/Option+click any img or video (videos need a poster) to drag its focal point live and copy the CSS or `position=` value. Lives in `src/dev/focal-picker.js`, copied and linked only in serve mode; `built-landmarks.test.js` asserts it never ships.

## Artmaking page

Each project is a `.split-row` `<article>`: a `.split-row__text` block (title | description + dimmed year + link, 2-up from a `@container` at `$bp-split`) at content width, then a `ul.grid-cols-2.split-row__images` of `.card` `<li>`s spanning the full-width page. Folds live in `_responsive.scss`.

- **Plain grid, no masonry.** Images keep their natural ratio; `align-items: start` stops them stretching, and `align-self: start` stops `.split-row` stretching the grid (its rows would spread apart). `artProjects.json` has no `ratio` field.
- **The image is a direct child of `.card`.** That is what triggers `.card`'s full-bleed rule, so images sit flush with no padding. Wrapping it in anything re-introduces the card padding.

Add new projects to `src/_data/artProjects.json`; `year`, `link`, `linkLabel` and `images` are all optional (an empty year renders nothing).

## Pages CMS

Content and media are editable via Pages CMS, configured in `.pages.yml` at the repo root (per-branch). Uploads land in `src/assets/` and are written as `/assets/...` URLs.

- **Collections** `work` (`src/work`, sorted by `endDate` desc, `featured` boolean) and `writing` (`src/writing`, sorted by `date` desc, `type` select) edit each `.md`'s frontmatter and body. Add a `writing` entry with `external`+`source` set (leave `permalink`+`body` blank) for a link-only Substack item. `writing.11tydata.js` (excluded from CMS) holds dir metadata + computed permalink.
- **Structured data files** (`artProjects`, `explorations`, `faqs`, `testimonials`, `collaborate`, `recognition`, and the contact fields in `site.json`) are edited through their `.pages.yml` entries, which hold the field shapes; read the entry before changing a data file. Gotchas: `faqs` answers are Markdown, rendered by the `markdown` filter in `faqList`; `explorations` uploads go to `src/assets/explorations`; `ctaCard` is imported `with context` so its defaults can read `site.json`.
- **Raw editors** for `_headers`, `_redirects`, `robots.txt` — `format: code`, no structured fields.
- **`body` fields are `type: text`, never `rich-text`** — posts mix markdown with Nunjucks shortcodes (`figureImg`, `projectVideo`) that a rich-text round-trip would corrupt.
- `settings.content.merge: true` preserves keys in `artProjects.json` that aren't in the schema.
- **Optimize-videos action:** the media page's button dispatches `.github/workflows/pages-cms-optimize-videos.yml`, which installs ffmpeg, runs `pnpm optimize:video`, and commits the mp4/webm/jpg back to the branch. Raw `.src.*` files are picked up automatically; existing outputs are skipped (pass `--force` to redo).

## Project videos

Embed lazy, autoplay-in-view videos with the `projectVideo` shortcode (defined in `eleventy.config.js`). Nothing downloads until an `IntersectionObserver` in `src/assets/scripts/app-core.js` sees the video near the viewport (`preload="none"` + `data-src`); it then autoplays muted and pauses when scrolled away. The play/pause control is **hidden** unless `<html>` has `[data-video-controls]` (≤3G connection, battery ≤20% unplugged, or reduced motion — `watchConstraints` in `video-controller.js`; the network/battery APIs are Chromium-only), the button has `[data-blocked]` (autoplay refused), or it has keyboard focus; its glyph follows `[data-playing]`. `prefers-reduced-motion` gets no autoplay. iOS Low Power Mode rejects `play()` (`NotAllowedError`; an `AbortError` is a scroll-away, not a refusal) and lifts the block per video, so a refusal centres the button and the next tap anywhere (`pointerup`/`touchend`) plays every video once, pausing the off-screen ones. Styling: `.project-video*` in `_components.scss`.

```njk
{% projectVideo "/assets/portfolio/x.webm", "Alt text" %}                                  {# webm-only (Safari 16+) #}
{% projectVideo "/assets/portfolio/x.mp4", "Alt", webm="/assets/portfolio/x.webm",
                poster="/assets/portfolio/x.jpg", caption="Optional caption" %}             {# webm + mp4 fallback #}
{% projectVideo "/assets/portfolio/x.mp4", "Alt", class="site-recording" %}                {# extra class on .project-video-wrapper #}
```

- **Formats:** WebM (small) with an MP4 fallback is the safe default — WebM-only drops pre-16 Safari/iOS. Single-format `src` may be `.webm` or `.mp4` (no `type` attr; browser sniffs).
- **Optimize raw uploads:** drop `<name>.src.{mp4,mov,webm}` into `src/assets/portfolio/`, run `pnpm optimize:video` (needs system `ffmpeg` on PATH) → emits `<name>.mp4`, `<name>.webm`, and a `<name>.jpg` poster.

## Sitemap

`src/sitemap.njk` → `/sitemap.xml`, built from `collections.all` (URL-sorted, trailing-slash pages only). Two opt-outs: `noindex: true` drops the page from the sitemap **and** emits the robots meta; `hidden: true` keeps a live page out of the writing listings and RSS but leaves it in the sitemap (`on-inner-desires`, linked from `/art/`). Never use `eleventyExcludeFromCollections` on a page that renders — it silently orphans it from the sitemap.

`<lastmod>` is emitted only when it's provably accurate: set **`updated: YYYY-MM-DD`** in frontmatter when you materially revise a page; writing posts fall back to `date`. Everything else omits the tag on purpose — Eleventy's default `page.date` is the file's creation time, which a fresh CI clone resets, so every deploy would stamp every URL with the build date and Google would stop trusting the whole file.

## Testing

### Map of the JavaScript

There are four groups of JS in this repo, ~1,300 lines of code total (excluding tests). If you can read this table, you can find anything.

| Where | What | Module style |
|---|---|---|
| `src/assets/scripts/` | Code that runs in the browser: video player, palette picker, copy-email buttons, nav menu | ESM (`import`/`export`) |
| `src/config/` | Build-time code: filters, shortcodes, collections, transforms, markdown twins. Wired up by `eleventy.config.js` | CommonJS (`require`/`module.exports`) — Eleventy config must be |
| `scripts/` | One-off maintenance CLIs run by hand: `pnpm optimize:video` (also called by the Pages CMS GitHub workflow — don't delete) and `pnpm compress:assets` | ESM |
| Repo root | `eleventy.config.js` (build config) and `vitest.config.js` (test config) | CJS / ESM respectively |

Two things that look odd but are intentional:

- **Lenis** (smooth scrolling) is an npm dependency. The build copies `node_modules/lenis/dist/lenis.min.js` into `assets/scripts/` (see `eleventy.config.js`), so updating it is just `pnpm up lenis` and a rebuild. The 4-line `src/assets/scripts/lenis.js` starts it.
- A few files carry `fallow-ignore` comments (`lenis.js`, `app-core.js`, `writing.11tydata.js`, `markdown-twins.js`). These tell the fallow analyzer to skip known gaps — they are deliberate, leave them alone.

### Running tests

```bash
pnpm build && pnpm test  # the tests read public/, so build first
```

`pnpm lint` runs as a pre-commit hook from `scripts/hooks/`, wired up by `pnpm install`. GitHub runs lint, build and tests only when something lands on `main`.

### What gets a test

Only failures you can't see by looking at a page. Three files remain, and each reads the built site in `public/`:

- **src/built-feeds.test.js**: both RSS feeds carry the right categories, and hidden posts stay out.
- **src/built-markdown.test.js**: every page ships its Markdown copy, plus `llms.txt`.
- **src/built-landmarks.test.js**: titles, descriptions, landmarks, sitemap and redirects. `META_EXCEPTIONS` lists the older pages that miss the title and description targets. Fix one, then delete it from the list.

### Builds and worktrees

- The tests read `public/`. Two builds in one checkout clobber each other; a failed `ELIFECYCLE` build that passes on a quiet re-run was this.
- Every worktree has its own `public/` and builds cold in 4–10 minutes (images re-optimize because they live in `public/`). Build and test inside your worktree; avoid the main checkout while another agent works there.
- `pnpm test` reads the current checkout's `public/`. After `pnpm start`, run `pnpm build` again before testing: dev output links the focal picker and fails `built-landmarks`.
- In a worktree, run git as separate plain commands; merge and push from the main checkout.

### Bugs only a browser shows

Agents can't drive a browser. For Firefox-only or timing bugs, hand Francesco a console snippet that logs state per frame and ask for the output pasted back; ready-made probes and how to hand results back are in [DevTools probes](#devtools-probes).

### Known Firefox console warnings

Firefox lists CSS it doesn't support as console warnings. They are progressive enhancement, not bugs, and wrapping the rules in `@supports` doesn't silence them (Firefox still reports declarations inside a failed block). Triaged in #67 with a frame-by-frame log; the page had zero JS errors and no failed requests.

- **Ours, expected:** `::scroll-button()` (carousel arrows, Chromium only), `animation-timeline` / `animation-range` (scroll animations, `scroll-fallback.js` covers Firefox), `interpolate-size`, `text-wrap: pretty` / `text-wrap-style: pretty`.
- **Vendored cleacss:** `::-ms-track` / `::-ms-thumb`.
- **Added by the build's vendor prefixing:** `-moz-column-gap`, `-webkit-text-size-adjust`.
- **Not ours:** anything from `popup.css`, `screenshot.css` or "Sublime highlighter" is a browser extension.
- **Font preload notices:** "preloaded with link preload was not used" for Ronzino Regular/Medium/Bold. The tags are correct (`crossorigin`, URLs match the `@font-face` rules) and each font is fetched once; treat it as a Firefox quirk, and keep the preloads because `font-display: optional` needs the fonts early.

A *real* problem is a red error: a JS exception, a 404, or a rule whose property Firefox supports but whose value is wrong.

## DevTools probes

For bugs only a browser shows (Firefox-only glitches, animation timing, scroll behaviour). Agents can't drive a browser here (AGENTS.md, browser automation blocklist), so the loop is: the agent hands over a console snippet, Francesco runs it, and pastes the output back. A snippet that logs **state per frame** beats a screenshot because it shows what changed and when.

### Handing results back

- Print the result as text in the console, then right-click → **Copy All Messages**, or select the lines and copy. Paste into the chat.
- `copy()` inside an `async` snippet fails after a delay in Firefox (no user gesture). Store the output on `window`, then run `copy(window.__log)` by hand.
- Files in `~/Downloads` are unreadable to agents and to `!` commands (macOS privacy). Paste the text, or drag the file into `.private/` in Finder.

### Transition probe: does it animate, and when does the layout change?

Used for #63 (FAQ accordions in Firefox): showed no transition events on `::details-content`, opacity jumping 0 to 1 in one frame, and a 12px gap lingering for exactly `--dur-medium`. Change the selector and the properties to suit the element under test.

```js
(async () => {
  const d = document.querySelector('details:not(.nav-menu)');
  d.scrollIntoView({ block: 'center' });
  const pc = () => getComputedStyle(d, '::details-content');
  console.log('FIRST LINE >>', 'interpolate-size:', CSS.supports('interpolate-size', 'allow-keywords'),
    '| ::details-content display:', pc().display);
  const log = [], t0 = performance.now(), ms = () => Math.round(performance.now() - t0);
  ['transitionrun', 'transitionstart', 'transitionend', 'transitioncancel'].forEach(t =>
    d.addEventListener(t, e => log.push(`${ms()}ms ${t} ${e.propertyName} pseudo=${e.pseudoElement}`)));
  let on = true, last = '';
  (function loop() { if (!on) return;
    const s = `open=${d.open} h=${Math.round(d.getBoundingClientRect().height)} opacity=${(+pc().opacity).toFixed(2)} cv=${pc().contentVisibility}`;
    if (s !== last) { log.push(`${ms()}ms ${s}`); last = s; }
    requestAnimationFrame(loop); })();
  const wait = t => new Promise(r => setTimeout(r, t));
  d.open = true;  await wait(700);
  d.open = false; await wait(700);
  on = false;
  window.__log = log.join('\n');
  console.log(window.__log);
})();
```

Reading the log: it only prints when something changes, so a smooth animation shows many rows with in-between values, and a snap shows one jump. No `transitionrun` rows means no transition ran at all.

### Is the dev server serving current CSS?

A fast check that needs no browser: `curl -s localhost:8080/css/index.css | grep -o '<selector>{[^}]*}'` and compare with the source. Partial edits (`_components.scss`) can be missed until `pnpm start` restarts.
