# Francesco Imola — Design System Reference

This document is a tangible, exhaustive snapshot of the current design system. Feed it to design tools (Claude Design, Figma Make, etc.) so experiments stay native to the existing site.

**Site:** francescoimola.com · **Stack:** Astro 5 + React + Radix UI Themes v3 · **Styling:** CSS custom properties + PostCSS (no Tailwind) · **Award:** CSS Design Awards — Special Kudos, UI, UX, Innovation

---

## 1. Foundational Principles

1. **Less rather than more.** Simplification over complexity. Cut anything that doesn't earn its place.
2. **Unapologetically simple.** Flat surfaces, sharp edges, generous whitespace, no decorative noise.
3. **Content-led.** Copy drives layout. Typography does most of the heavy lifting.
4. **Sustainable.** Runs on green hosting; uses ~80% less energy than most sites. Performance and carbon footprint are design concerns.
5. **Accessible by default.** `prefers-reduced-motion` respected. Focus rings visible. Colour contrast AA+. `highContrast` prop used on body text and headings.
6. **Sharp, not soft.** `radius="none"` everywhere. No rounded cards, no soft shadows. The only circular element is the dialog close button.

---

## 2. Typography

### Font family
- **Ronzino** — custom webfont. Humanist sans-serif with slightly editorial feel. Loaded locally as `.woff2` with `font-display: optional` (no FOIT, no layout shift).
- Weights loaded: `400` (regular), `500` (medium), `700` (bold). Italics available for 400 and 500.
- System fallback stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji'`
- Declared on `.radix-themes` via `--default-font-family`.

### Primary weights in use
- **400 regular** — body copy, nav links
- **500 medium** — headings (H1–H6), buttons, prominent UI
- **700 bold** — reserved for rare emphasis (e.g., active tabs)

### Line height
- Custom scale factor: `--line-height-scale: 1.18` — applied on top of Radix defaults for `.rt-Text`, `.rt-Heading`, `.rt-Quote`. Produces slightly tighter-than-default vertical rhythm.

### Text wrapping
- `text-wrap: balance` on headings, paragraphs, list items, anchors, buttons, labels, figcaptions (global reset).
- `text-wrap: pretty` on table cells.
- `<Text wrap="pretty">` or `wrap="balance"` applied per-component for specific effect.

### Size scale (Radix `size` prop)
| Size | Use |
|---|---|
| `8` | H1 page heading, BottomCTA heading |
| `6` | H2 on tablet |
| `3` | Body copy, nav, inner section titles on desktop, footer headings |
| `2` | Small meta, footer copyright, figcaption, testimonial role |

### Headings
- All headings use `weight="medium"` (500) — never bold.
- H1 via `<PageHeading>` component: `size="8"`, `trim="both"`, `highContrast`, `max-width: 25ch`.
- H2 via `<InnerSection>`: responsive `{ initial: "8", sm: "6", md: "3" }` (scales *down* at larger breakpoints because the counter + rule visually carries the section title).
- Optional inline `<Text color="orange|yellow">` for emphasized words in H1 (e.g., "designer" in orange, "copywriter" in yellow).

---

## 3. Colour System

Radix UI scales with full P3 colour-space variants. Accent: **yellow** · Gray: **olive** · Panel: **solid**.

### Yellow scale (brand accent)
Mustard-lean, leaf-green-tinted yellow. Steps 1–8 are light surfaces; 9–12 are deep, near-black-olive for contrast.

| Step | Hex | Use |
|---|---|---|
| 1 | `#fdfdf9` | Near-white background |
| 2 | `#f9faf0` | Subtle background |
| **3** | `#f3f6cb` | **Default hero background** / Service card default |
| 4 | `#ebefa9` | Light hover states |
| **5** | `#e0e48c` | **BottomCTA background** / Service card hover |
| 6 | `#d2d67e` | Borders, inactive active |
| 7 | `#bfc36c` | Mid-tone UI |
| 8 | `#a9ac55` | Strong border / focus outline (via `--yellow-a8`) |
| **9** | `#3b3c02` | **Dark olive surface** (footer, `--brand-surface-dark-olive`) |
| 10 | `#4d4e19` | Dark surface hover |
| 11 | `#737517` | Accessible mid-contrast text on light |
| 12 | `#3e3f05` | Deepest text on light backgrounds |

Alpha variants `--yellow-a1` → `--yellow-a12` exist for overlays. P3 equivalents via `oklch()` auto-applied on P3 displays.

### Orange scale (secondary accent)
Warm mustard-orange. Used sparingly.

| Step | Hex | Use |
|---|---|---|
| **5** | `#ffd2a0` | **About page hero background** |
| **9** | `#553009` | **Dark mustard surface** (`--brand-surface-dark-mustard`) |
| 11 | `#a96a2d` | Accessible orange text |

### Olive grey scale
Radix default `olive` gray family — warm, earthy, slightly green-leaning grey. Variables `--olive-1` through `--olive-12` available at `:root`. Inside `.radix-themes` the same scale is aliased as `--gray-*`.

- Body background: `var(--olive-1)` — warm off-white.
- Page content background: `var(--gray-1)`.
- Muted text: `color="gray"` on `<Text>`.
- Footer link alpha: `var(--gray-a11)` for copyright line.

### Semantic tokens
```css
--brand-surface-dark-mustard: var(--orange-9);  /* Deep warm brown */
--brand-surface-dark-olive: var(--yellow-9);    /* Deep olive — footer */
```

### Colour application rules
- **Hero backgrounds vary per page** (set via `<Layout backgroundColor>`): home = `yellow-3`, about = `orange-5`, others configurable.
- **Footer** is always `--brand-surface-dark-olive` with `appearance="dark"` Radix theme.
- **Cards** are either `yellow-3` (services) or `gray-3` (copywriting/email/logos).
- **Focus outlines**: `2px solid var(--accent-a8)` or `var(--yellow-a8)`, offset `2px`.
- **Contrast tier:** `highContrast` prop used liberally on body text and headings to push text to `--gray-12` equivalent.

---

## 4. Spacing & Layout

### Fluid spacing scale
Radix defaults are overridden inside `.radix-themes` with `clamp()` for smooth responsive scaling:

```css
--space-3: clamp(10px, 0.6rem + 0.25vw, 14px);
--space-4: clamp(14px, 0.8rem + 0.35vw, 19px);
--space-5: clamp(20px, 1.1rem + 0.5vw, 28px);
--space-6: clamp(28px, 1.5rem + 0.8vw, 36px);
--space-7: clamp(36px, 2rem + 1vw, 46px);
--space-8: clamp(42px, 2.4rem + 1.2vw, 54px);
--space-9: clamp(56px, 3.2rem + 1.5vw, 72px);
```

### Custom large-space tokens (at `:root`)
```css
--space-10: clamp(3rem,  5vw,  5rem);   /* ~48–80px   — page block padding */
--space-11: clamp(4rem,  8vw,  8rem);   /* ~64–128px  — large gaps */
--space-12: clamp(5rem, 10vw, 10rem);   /* ~80–160px  — section gaps, hero pb */
--space-13: clamp(8rem, 20vw, 20rem);
--space-14: clamp(10rem,30vw, 30rem);
```

### Containers
```css
--max-cw:    1536px;   /* Primary content max-width */
--max-cw-sm: 768px;    /* Half-width: BottomCTA heading, centered copy */
--container-xs: calc(var(--container-1) / 1.618);  /* Golden-ratio small container */
```

### Section padding
```css
--section-px-initial: var(--space-4);
--section-px-sm:      var(--space-6);
```

### Global side margin
```css
.side-margin { padding-inline: 5cqmin; }
```
All top-level content rails inside `.side-margin` for consistent horizontal breathing room.

### Grid system
- **Main page grid** (`<MainGrid>`): `max-width: var(--max-cw)`, `columns={{ initial: "1", md: "2" }}`, `gapY: var(--space-12)`, `gapX: 4`, `py: var(--space-10)`.
- **Hero grid**: same 2-column split on `md+`. Logo + nav on row 1; H1 spans col 2; role metadata in col 1 under logo; description spans col 2.
- **Inner sections** use CSS subgrid: `gridColumn: "1 / -1"`, `gridTemplateColumns: "subgrid"` — headings sit in col 1 on `md+`, content sits in col 2.
- **Key Service Points**: `columns={{ initial: "1", md: "2" }}` — heading left, copy + CTA right.
- **Footer**: 2 columns on `sm+` — left is 4-section nav, right is newsletter form + sustainability card.

### Breakpoints (Radix defaults)
`initial` < 520px · `xs` 520+ · `sm` 768+ · `md` 1024+ · `lg` 1280+ · `xl` 1640+

---

## 5. Border Radius

**`radius="none"` globally.** Every card, button, input, dialog, and surface has sharp 90° corners. This is a core brand rule — do not round anything.

Exceptions (explicit, rare):
- Dialog close button: `border-radius: 999px` (fully circular).

---

## 6. Motion & Transitions

### Global
- **Smooth scroll**: Lenis (`lenis` package). `duration: 1.0s`, custom easing `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`. `prefers-reduced-motion` users get `duration: 0.5s`, linear easing.
- **View Transitions API** enabled site-wide (`@view-transition { navigation: auto }`) with named transitions on persistent elements: `site-logo`, `site-nav`, `site-footer`, `blur-top`, `blur-bottom`.

### Page enter
```css
.content-enter { animation: slide-up-fade 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes slide-up-fade { from { opacity: 0; transform: translateY(12px); } }
```

### Transition tokens
```css
--transition-fast: 0.2s;
```

### Standard easings
- **Page enter / dialog open**: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out expo-ish)
- **Hover translate (playful bounce)**: `cubic-bezier(0.34, 1.56, 0.64, 1)` — used on KSP heading translateX and Accordion question translateX (0.45s)
- **Accordion open/close slide**: `cubic-bezier(0.87, 0, 0.13, 1)` (ease-in-out quart), 300ms
- **Fade-in/out**: `cubic-bezier(0, 0, 0.2, 1)` / `cubic-bezier(0.4, 0, 1, 1)`, 200ms

### Motion patterns
- Links and cards use `transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)` on hover/focus, translating right by `var(--space-2)`.
- ScrollReveal component wraps sections; `<InnerSection animate>` uses Framer Motion: `initial: { opacity: 0, y: 18 }`, `whileInView: { opacity: 1, y: 0 }`, `once: true`, `margin: "-80px"`, 0.5s ease-out.
- Dialog open: 150ms fade + scale from 0.96.

### `prefers-reduced-motion`
Always check. Lenis falls back to short duration + linear easing. `.content-enter` animation suppressed outside `@media (prefers-reduced-motion: no-preference)`. Edge-blur transition shortens to 0.15s.

---

## 7. Effects

### Edge blur overlays
Fixed-position top/bottom blur strips that fade content at viewport edges during scroll. Implemented so the backdrop-filter lives on `::after` (Safari 26 Liquid Glass toolbar tinting ignores pseudo-elements).

```css
.edge-blur {
  position: fixed; left: 0; right: 0;
  height: clamp(5rem, 12vh, 15rem);
  z-index: var(--z-overlay);
  pointer-events: none;
}
.edge-blur::after {
  content: ""; position: absolute; inset: 0;
  backdrop-filter: blur(20px);
}
```
- Top blur: fades in after scroll, masked `linear-gradient(to bottom, black, transparent)`.
- Bottom blur: always visible, masked upward.

### Safari 26 toolbar tint sync
JS observer sets `body` background-color to match the currently-visible hero or footer, so iOS Safari 26 samples the right tint for the Liquid Glass toolbar. (Pseudo-elements, absolute children, and `display: none` elements are ignored by Safari; fixed elements with `opacity: 0` are not.)

### Shadows
Essentially none in default UI. The only shadow is `box-shadow: var(--shadow-6)` on `.DialogContent` modals.

### Z-index scale
```css
--z-1: 100;         /* View-transition layer */
--z-overlay: 9999;  /* Edge blur */
--z-modal: 10000;   /* Dialogs */
```

---

## 8. Component Inventory

Located in [src/components/](src/components/). Built on Radix UI Themes primitives, styled via props + CSS custom properties.

### Layout components
- **`Layout.astro`** — page shell. Slots: `heading`, `role`, `description`, `page-content`, `bottom-cta`, `structured-data`. Props: `backgroundColor`, `roleFullWidth`, `noMobileRole`, `noIndex`, theme overrides.
- **`MainGrid.tsx`** — 2-column responsive content grid with subgrid-friendly children.
- **`InnerSection.tsx`** — numbered section wrapper with H2, auto-incrementing counter, optional ScrollReveal/Framer Motion animate-in. Counter via `counter-increment: section-counter` and `::before { content: counter(...) }`.
- **`Footer.tsx`** — 2-column dark footer. Nested Radix `<Theme appearance="dark">`. 4 link sections + newsletter form + sustainability card + copyright.
- **`Head.astro`** — SEO meta, OG tags, favicons.
- **`SkipToNav`** — accessible skip-to-section nav.

### Content components
- **`PageHeading.tsx`** — H1, size 8, medium weight, `trim="both"`, `highContrast`, 25ch max.
- **`BottomCTA.tsx`** — Full-width CTA band, default `yellow-5` background, centered H2 size 8, optional paragraph max 40ch, children slot for buttons.
- **`KeyServicePoints` + `KSP`** — 2-column list of services with hover-translate on heading + soft CTA button. Divided by `thin solid var(--gray-a6)`.
- **`Testimonial.tsx`** — 2-column on md+: author+role+logo left, quote+stars right. Uses `"{quote}"` literal quotes.
- **`ReviewStars.tsx`** — star rating (3/4/5).
- **`BlogCard.astro`**, **`ContentCard.tsx`** — list/grid cards.
- **`project/ProjectImage.astro`** — case study thumbnail with title + skills.
- **`FAQ.tsx`**, **`ProcessAccordion.tsx`** — accordion patterns (Radix Accordion).
- **`VerticalFeatureTabs.tsx`** — left-rail tabbed feature switcher.
- **`PricingTable.tsx`** — pricing display.
- **`PlaygroundProject.astro`**, **`TemplateDialog.tsx`** — experimental/modal components.

### Interactive
- **`ButtonLink.tsx`** — polymorphic Button-as-anchor (Radix `<Button asChild>` + `<a>`). Props pass through to Radix Button.
- **`ContactForm.tsx`**, **`NewsletterForm.tsx`** — inline form patterns with underline inputs (see §9).
- **`ShareButtons.tsx`**, **`CopyEmailButton.tsx`**, **`GoBackButton.tsx`** — utility buttons.
- **`BlogFilters.tsx`** — Radix Tabs filter.

### Media & icons
- **`icons/`** — SVG wordmarks (MegaSeatingPlanLogo, BlueberryLogo, SarahYLLogo, FigmaIcon, WebflowIcon, FramerIcon, etc.). Tool icons fill with `var(--gray-a10)`, client logos with `var(--gray-a11)`.
- **`mdx/`** — components rendered inside MDX blog posts.
- **`ui/`** — low-level UI atoms.

### Animation helpers
- **`ScrollReveal.tsx`** — wrapper that animates children in on scroll.

---

## 9. Pattern Library

### Buttons
Use Radix `<Button>` via `<ButtonLink>` wrapper for anchors. Common variants:

| Purpose | Variant | Color | Size |
|---|---|---|---|
| Primary CTA in hero | `solid` | default (yellow) | 3 |
| "View more projects" | `soft` | `gray` | 2 |
| Nav Contact button | `soft` | `gray` | 3 |
| Large CTA (footer band) | default | default | `{ initial: 3, sm: 4 }`, `highContrast` |
| Secondary in CTA band | `soft` | `gray` | `{ initial: 3, sm: 4 }` |

Arrow icons: `<ArrowRightIcon>` for inline CTAs, `<ArrowTopRightIcon>` for external links. Always after the label.

### Cards
```css
.service-card {
  background-color: var(--yellow-3);
  transition: background-color 0.2s ease-in-out;
  &:hover { background-color: var(--yellow-5); }
  &:focus-visible { outline: 2px solid var(--accent-a8); outline-offset: 2px; }
}
```
Copywriting and email cards override to `--gray-3` / `--gray-5` hover.

### Form inputs (underline style)
```css
.contact-form-input {
  padding-left: 0; width: 100%;
  background: transparent; border: none;
  border-bottom: thin solid var(--gray-a7);
  border-radius: 0; box-shadow: none; outline: none;
  &:focus { outline: 2px solid var(--yellow-a8); outline-offset: 2px; }
}
```
Flat, borderless-except-bottom inputs. Labels above. No floating labels, no filled backgrounds.

### Section counters
Sections auto-increment a CSS counter; the number is rendered as a subtle `var(--gray-a10)` numeral next to the H2 title.

### Accordion (FAQs, Process)
- Trigger translates right on hover (+`--space-2`), weight bumps to 500.
- Plus/minus icons swap via `[data-state='open']`.
- Content slide uses `height: var(--radix-accordion-content-height)` with `cubic-bezier(0.87, 0, 0.13, 1)` 300ms.
- Inner content uses container queries: 2-column grid above 60ch, stacked below.

### Vertical feature tabs
- Left-rail list with right-side active indicator: `border-inline-end: medium solid var(--accent-a9)` on active.
- Inactive triggers: `--gray-10` text; hover: `--gray-12`; active: `--accent-12`.
- Stacks to horizontal top-rail below 1024px.

### Dialogs (Radix Dialog)
- Overlay: `var(--black-a9)` with 150ms fade.
- Content: centered via `translate(-50%, -50%)`, max `60ch + 12rem` wide, max `100dvh - 6rem` tall, `box-shadow: var(--shadow-6)`.
- Close button: absolute top-right, **circular** (`border-radius: 999px`), `var(--gray-3)` bg.

### Tables (MDX)
`.mdx-table` — first col narrow (`25cqmin`, `white-space: nowrap`), other cols wrap. Margin-bottom `var(--space-5)` between tables.

### Figures
```css
figure { all: unset; block-size: fit-content; }
figcaption { opacity: 0.75; font-size: var(--font-size-2); }
figure + figure { margin-block-start: var(--space-5) !important; }
```

---

## 10. Page Anatomy

### Home page (yellow-3 hero)
1. **Hero** — 2-col grid. Logo/nav row 1; H1 row 2 col 2; role "Open to new collaborations in 2026" col 1; description (2 paragraphs + primary CTA) col 2.
2. **Selected work** — InnerSection with 1-col grid of ProjectImages + "View more" soft button.
3. **Where I can help** — InnerSection with KeyServicePoints (4 services).
4. **Happy Clients** — InnerSection with 1-col Grid of 4 Testimonials, gap `var(--space-10)`.
5. **The work I do best** — InnerSection, plain prose.
6. **BottomCTA** — `yellow-5` band, "Book a free intro" + "Contact directly".
7. **Footer** — dark olive.

### About page (orange-5 hero)
Same skeleton. Hero uses `orange-5` background. Contact form, tools list, FAQs, sustainability notes.

### Blog / work pages
Same Layout shell; content area uses MainGrid with lists of BlogCard/ProjectImage.

### Hero slot semantics
- `heading`: H1 (spans col 2 on md+)
- `role`: small meta chunk under logo (col 1). Hidden on mobile if `noMobileRole`.
- `description`: supporting copy + primary CTA (col 2).
- `page-content`: main page body.
- `bottom-cta`: full-width CTA band above footer.

---

## 11. Accessibility

- Skip-to-nav on every page with per-page anchors.
- `highContrast` used on all body copy and headings to ensure AA+ contrast.
- Focus outlines explicit and visible (`2px solid var(--accent-a8)`, `2px` offset).
- `scroll-margin-block-start: var(--space-8)` on all `[id]` so anchor jumps don't hide behind fixed elements.
- `prefers-reduced-motion` respected globally.
- All external links include `target="_blank" rel="noopener noreferrer"`.
- External link icon (`ArrowTopRightIcon`) signals new-tab behaviour visually.
- British English throughout (`colour`, `organise`, `behaviour`).

---

## 12. SEO & Metadata

- Structured data: `Person` + `WebSite` JSON-LD on homepage; page-specific JSON-LD via `<Fragment slot="structured-data">`.
- Default OG image: `/assets/images/og-image.png`.
- Page-specific titles follow pattern: `{Page} | Francesco Imola`.
- Descriptions live in `src/constants.ts` under `SEO.pages.*`.

---

## 13. Stack & Build

- **Astro 5.x** with prerendering enabled on marketing pages.
- **React** islands via `client:visible` (Footer, InnerSection, BottomCTA, forms).
- **Motion** (Framer Motion) for scroll-triggered reveals.
- **Lenis** for smooth scroll.
- **Radix UI Themes v3.2.1** + **Radix Icons**.
- **PostCSS** (no Tailwind). Custom properties everywhere.
- Deploy target: Cloudflare (`wrangler.json`).

---

## 14. Rules for Claude Design / Figma Make / external design tools

**Always do:**
1. Set Radix Theme to `accentColor="yellow"`, `grayColor="olive"`, `radius="none"`, `panelBackground="solid"`.
2. Load Ronzino font (or document the substitution clearly). If substituting, use a humanist sans-serif with similar x-height — avoid geometric sans (Inter, Geist) and avoid serifs.
3. Use the existing yellow + orange + olive-gray scales. Do not introduce new colours.
4. Use `weight="medium"` (500) for all headings.
5. Apply `highContrast` to body text and headings.
6. Use fluid `clamp()`-based spacing tokens, not fixed pixel values.
7. Keep layouts 2-column on `md+` with CSS subgrid inner sections.
8. Add `text-wrap: balance` to headings and long-form text.
9. Respect `prefers-reduced-motion`.
10. Use hover translateX with the playful `cubic-bezier(0.34, 1.56, 0.64, 1)` easing on interactive headings/links.

**Never do:**
1. Never add border-radius to cards, buttons, inputs, modals. Sharp edges only.
2. Never use drop shadows, glows, or gradients (beyond the two named edge-blur masks).
3. Never add new colours outside the yellow/orange/olive scales.
4. Never use bold (700) for headings — medium (500) only.
5. Never use geometric or display fonts. Ronzino or system humanist sans fallback.
6. Never use filled form inputs — underline-only.
7. Never use emoji decoration in UI (product-side; allowed sparingly in copy).
8. Never use cross-fade or default page transitions; use the view-transitions + content-enter slide-up.
9. Never introduce hover scales > 1.0 or > `translateX(var(--space-2))`.
10. Never use bright saturated greens, reds, blues. The palette is deliberately warm, earthy, muted.

**Prefer:**
- Whitespace over dividers. If a divider is needed, use `thin solid var(--gray-a6)`.
- Typography-led hierarchy over color-led. Size and weight do the work.
- Left-aligned, asymmetric grids over centered content (except BottomCTA).
- Numbered sections for long pages (counter pattern).

---

## 15. Voice & Copy (pointer)

Full voice spec lives in the user's brand skill at `~/.claude/skills/francesco-imola/SKILL.md`. TL;DR for UI copywriting:

- British English. Contractions. Short paragraphs.
- No em dashes. No corporate speak. No hypey marketing language.
- CTAs invite, never pressure: "Say hello", "Book a free intro", "Drop me a line".
- Disqualify openly. Name problems directly.
- Funny when it serves the point; never performative humour.
- "I" and "you" language. Sounds like a person across a table.

---

## 16. File map (where things live)

```
src/
├── layouts/Layout.astro         # Page shell, hero grid, footer mount
├── styles/global.css            # All tokens, resets, component styles
├── components/
│   ├── Layout atoms             # MainGrid, InnerSection, PageHeading
│   ├── Content                  # BottomCTA, KeyServicePoints, Testimonial
│   ├── Interactive              # ButtonLink, ContactForm, NewsletterForm, FAQ
│   ├── icons/                   # Client + tool SVGs
│   ├── mdx/                     # MDX blog components
│   └── ui/                      # Low-level atoms
├── pages/                       # index, about, work, blog, consultations, ...
├── content/                     # Blog MDX + project MDX (Astro content collections)
└── constants.ts                 # SEO, SITE_DATA, EXTERNAL_URLS
```
