# FRN-2026 redesign: decisions log

Figma file: UkQphRf7GwINc1c8vORtUm (FRN-2026), page `v2`, section `2260:2139` "francescoimola.com - new design".
Repo: /Users/francescoimola/Repositories/rummikub (read-only this session; no branch, commit or PR).

## Session scope (2026-10-24)

- Figma only. Skip figma-to-code. No repo files touched.
- Work on a duplicate of the section; the original stays untouched until approved.
- Ask before deleting or renaming anything.

## Phase 0: Orient (2026-10-24)

| Question | Answer |
|---|---|
| Baseline for the change inventory | Repo as baseline (templates + CSS, read-only), not the Exploration captures |
| Token source of truth | Repo CSS tokens (`--brand-*`, `--neutral-*`, `--neutral-*-alpha`, `--step-*`, `--space-*`) |
| Old "Francesco Imola" collection (49 vars) + 8 text styles | Leave untouched; create new collections/styles alongside |
| Decisions log location | `docs/frn-2026/decisions.md` |

### Facts read (not decisions)

- Section frames: Homepage 390 / 834 / 1512, About, Work with me, Ideas & Guides, Artmaking (all 1512).
- 2,353 nodes; 1,775 unbound solid fills; 0 of 379 text runs use a text style; 2 auto-layout frames use spacing vars.
- Repo root font size is **15px** (`index.scss:15`), so every rem token resolves at 15px/rem.
- Type scale: Utopia 16→18px, ratio 1.333, 360→1920, `relativeTo: container` (cqi), steps -1..2.
- Space scale: Utopia 16→18px, 360→1920, cqi, steps 0.125–8 + custom pairs.

## Phase 1: Change inventory (2026-10-24)

Inventory file: `docs/frn-2026/change-inventory.md`.

| Question | Answer |
|---|---|
| Colours | No new colours. Every colour snaps to an existing repo token ("we just match the original colours") |
| Exclusions | Illustration greens (`#345900` / `#5c7c01`) get bound to `--brand-900` / `--brand-800` so they re-tint. Stickers, logos, thumb swatches, image fills stay raw |
| Components | Repeated blocks only: Header, Footer, Project item, Writing item, Contact card, Service card (names matched to repo partials) |
| Placeholder content | Home **Index** repeats the 3 Featured projects as stand-in content; the real Index has more, different projects (as on `/studio/` today). **Explorations** is a new image-only section (no pages); stock images from the site stand in for now |
| Mobile/tablet | Homepage 390 / 834 frames are temporary, there to show behaviour. Both lack the hero. **New scope:** migrate the hero to both, then create tablet + mobile variants for every page |
| Fluid vs breakpoints | Code will rely mostly on fluid scales, few breakpoints. Breakpoint frames are for visual checking |
| Font | KC Pelletier Sans is an intentional new font |
| Footer | Redesign is intentional; the footer illustration bleeds off-screen on purpose |
| Review format | Go through every inventory item as an individual yes/no question |

### Item-by-item review: round 1 (2026-10-25)

| Item | Answer |
|---|---|
| A1 Header | Yes. Sidebar removed, top bar instead. Mobile header ≈ the repo's current mobile header (spot on). Desktop: all pages on one line + theme toggles to the side (frames 2246:6918, 2246:959, 2246:813). When the **header's container** gets small enough it switches to the mobile version (likely tablet too, no room for toggles). Use **container queries**, not viewport |
| A2 Nav | "Case studies" removed: its content now lives in the first two homepage sections, plus the new Explorations section. Page title stays "Ideas & Guides"; menu label shortens to "Ideas". The current-page `•` marker floats beside the text (text doesn't shift), and the text changes colour slightly, like today's hover. **Mobile does NOT become a 3-column grid**: keep the current repo-style disclosure menu (see A1) |
| A3 Hero | Yes, as described |
| A4 Surface | Keep **contrast mode**, no colour change. Figma `#ffffff` main band binds to `--content-light` (contrast-mode surface, `index.scss:125`), and those pages get `contentMode: contrast` at port time |

### Item-by-item review: round 2 (2026-10-25)

| Item | Answer |
|---|---|
| A5 Footer | Yes. It's nearly element-for-element the old `/contact/` page, moved into the footer, with more visual creativity and logos underneath |
| A6 Rows | Yes. One label/content pattern; reuse `.split-row` |
| A7 Toggles | Yes. Theme + brand picker sit at the right of the header on desktop and inside the mobile disclosure panel on narrow containers |
| A8 Home | Yes. User has since **removed "See all case studies"** from Explorations (node 2246:6979, edited in the original section on 2026-10-25). The duplicate must be taken after this edit |

### Item-by-item review: round 3 (2026-10-25)

| Item | Answer |
|---|---|
| A9 Work with me | Yes, as described |
| A10 Ideas & Guides | Yes. User has since **removed "Blog"** from the hero (node 2246:2832); it now reads "Ideas & Guides". The rest is element-for-element the current `/writing/` page, just in the split layout |
| A11 Artmaking | Yes. Only 3 works are shown, to demo the layout; **the list must be completed with all existing works** from `artProjects.json` (open: in Figma this session, or at code port) |
| A12 About | Yes, as described |

### Item-by-item review: round 4, colours (2026-10-25)

| Item | Answer |
|---|---|
| B1 Bands/chips | Yes. `#e6f4bd` → `--brand-150`, `#ecf8ca` → `--brand-100` |
| B2 Text | Yes, but **use the alpha versions for all text**: solid `#383e2a` headings/display also → `--neutral-950-alpha` (not `--neutral-950`). Body → `--neutral-950-alpha`, years → `--neutral-900-alpha`, org/publication → `--neutral-800-alpha` |
| B3 Surfaces/borders | Yes. Cards `@5%` → `--neutral-100-alpha`; strokes `@3%` → `--neutral-50-alpha`, `@22%` → `--neutral-400-alpha`, `@33%` → `--neutral-500-alpha`; white band → `--content-light` |
| B4 Accent | Yes. `#5c7c01` → `--brand-800`, `#345900` → `--brand-900` (incl. illustration greens) |

### Item-by-item review: round 5, type (2026-10-25)

| Item | Answer |
|---|---|
| B5 Service numbers `#3c3c43 @60%` | User: "use what the repo uses in that same section". Repo service cards have no numbers (they're new); the page's secondary text is `.dimmed` → **`--neutral-900-alpha`** |
| B6 Step-0 | Yes. 15.07 / 15.53 / 16.05 / 16.51 / 16.76 → one `--step-0` variable |
| B7 Weights | Open: user wants to clarify |
| B8 Small sizes 13.97 / 14.74 | Open: user wants to clarify |

### Item-by-item review: round 6, type follow-up (2026-10-25)

| Item | Answer |
|---|---|
| B7 Weights | No question needed: **repo wins**. Figma's Ronzino Medium/Bold map to `--font-weight-medium` (425) / `--font-weight-bold` (550); Figma just can't show variable weights |
| B8 Small sizes | Repo wins, no new tokens. 13.97 = `<small>` (`smaller` = step-0 ÷ 1.2 at C 1709). 14.74 = cleacss `figcaption` `--font-size-7` (`clamp(.85rem, .8rem + .16vw, 1rem)` at 1710 vw, 15px root) |
| Principle | Anything the repo already defines snaps silently. Only genuinely new design elements (KC Pelletier sizes) get questions |
| Display sizes | **Extend the existing `--step-*` scale** (more positive steps), not a new display scale. Step choice for the home hero + mobile behaviour: open (next round) |
| Colour modes | Light + Dark (from `light-dark()` in `_colors.scss`); only Light bound/checked this session |

### Round 7: display + fluid setup (2026-10-25)

| Item | Answer |
|---|---|
| Home hero (192px) | **Custom size, not a scale step.** The hero's line width must match the inline width of the split sections below it (visual alignment; not necessarily `max-inline-size`). Find a custom size (clamp, or even a power function) that fits that width as closely as possible |
| Section heroes (55px) | Use the extended `--step-*` scale (e.g. `--step-4`). At most **one** breakpoint for section heroes, if needed |
| Fluid modes in Figma | Open. User thinks Variables Pro can handle formulas, so fixed per-width modes may not be needed. Decide after reading the user's Variables Pro JSON |
| Collections | Yes in principle (Color, Radius via use_figma; Type, Space via Variables Pro; names = repo minus `--`), **but wait for the user's sample Variables Pro JSON first** |

### Round 8: Variables Plus (2026-10-25)

- Plugin is **Variables Plus** (dynamic variables), not Variables Pro. Its formulas support `MIN`/`MAX`/`POWER` + `{{Collection:Var}}` refs, so a Utopia `clamp()` can be reproduced as `MIN(MAX(min, a·rem + b·width), max)` against a per-mode `width` variable.
- Sample export received (old collection only: no formulas, no aliases). Format notes: `docs/frn-2026/variables-plus-format.md`.
- Waiting on a second export containing a formula + an alias, to learn how expressions are stored in JSON before generating anything.
- The sample file sits untracked in the repo root; the user deletes it (not touched by Claude).
- Formula test export received (2026-10-25). Format learned (see format file). **Bug:** `fluid` evaluated to 16.875 in both modes instead of 15.07 / 16.51.
- Home hero target width: the split sections are **982px** wide at 1512 (hero widest line 1000px). Not a repo token (`--max-inline-size` = 1800px). Open: new layout width, decide during layout/port.
- Second docs read: likely no operator precedence in Variables Plus (left-to-right reproduces 16.875 exactly). Retest with every product in brackets pending.
- Bracketed retest also gave 16.875 (2026-10-25). Precedence hypothesis rejected as sole cause; piece-by-piece test requested.
- User supplied a working Variables Plus file from open-art-folke (2026-10-25). Adopt its proven pattern: Min/Max modes, number drivers in `valuesByMode`, formulas with `*`, `/`, `POWER`, `CEILING`, integer fractions, no `MIN`/`MAX`. VP-test failure likely came from string constants + `MIN`/`MAX`; no further debugging needed.

## Phase 2: Variables Plus handoff checkpoint (2026-10-25)

| Question | Answer |
|---|---|
| Modes | **Min / Max** (proven pattern). Phone + tablet frames → Min, desktop frames → Max. Desktop renders ~2% larger than the mockups (accepted) |
| Collections | One **"Utopia"** collection (type, space, pairs, line heights, letter spacing) owned by Variables Plus. Color + Radius are separate, created by Claude via use_figma |
| Big headings | Extend the step scale to **both step 4 and step 5** (may swap between them across mobile/desktop in the final site). Home hero custom size `step/hero` = content width ÷ 5.196 (Min 330 → Max 982), proposed and not objected to: confirm at review |
| Names | Copy the code minus `--`: `step/0`, `space/s-m`, `line-height/body`, `letter-spacing/m` |
- **Import file generated** (2026-10-25): `docs/frn-2026/variables-plus-import.json`. 1 collection "Utopia", modes Min/Max, 56 variables (8 drivers incl. 2 font strings, 48 formulas). No ids. Generator + checker in `tools/`; expected per-mode values in `variables-plus-expected-values.txt`.
- Validation: all references resolve; all 37 `--step-*` / `--space-*` tokens match the built CSS clamp bounds ×15px within 0.02px. Space steps use `ROUND(…, 0)` in 16px-root config units to mirror Utopia's whole-px rounding (affects 3xs, xs, 4xs, 2xs-xs, 4xs-3xs).
- Not in this file (Claude creates via use_figma after import): Color (Light/Dark), Radius. Scopes: the JSON has no scopes field; Claude to set scopes on Utopia vars after import (metadata only), pending user OK.

## Phase 3: Variables Plus import (2026-10-25)

- Docs moved into the repo at user's request: `docs/frn-2026/` (was `~/figma-redesign/frn-2026`, now removed). Overrides the earlier "outside the repo" rule for documentation. Keep future docs here.
- User imported `variables-plus-import.json`: 56 vars created, Min/Max. Verified from Figma: everything matches expected **except** `line-height/body`, `letter-spacing/l`, `letter-spacing/xl` = 0 (maths on the `step/0` alias). Generator fixed to use `type/base`; the user needs to fix those 3 formulas in Figma.

### Round 9: follow-ups (2026-10-25)

| Item | Answer |
|---|---|
| 982px content width | Borrow **`--grid-width-l` (60rem = 900px)**; nearest existing token, 8% narrower. `layout/content-width` Max 982 → 900, so `step/hero` Max 189 → 173.2 |
| Artmaking list | Complete from `src/_data/artProjects.json` (12 projects; Figma shows 3). Add the other 9 in the duplicate during layout work |
| Test files | Keep both test JSONs (repo root) + `VP test` collection until the refactor is complete; **ask at the end** before deleting |
- Re-import confirmed safe by user (no duplicates; tested on open-art-folke). Regenerated file (type/base fix + content-width 900) handed over for re-import (2026-10-25).
- Re-import verified (2026-10-25): 1 Utopia collection, 56 vars, all 54 numeric values match expected within 0.005px; 2 font strings correct.

## Phase 4: Figma foundations (2026-10-25)

- **Duplicate** section created: `2275:725` "francescoimola.com - new design (tokens WIP)", placed right of the original (which is untouched). Includes the user's latest edits (Mobile/Tablet frame renames, "Blog" removed, "See all case studies" removed). IDs in `figma-state.json`.
- **Color** collection (`VariableCollectionId:2276:645`, Light/Dark): 78 primitives (brand 50–950 incl. 150, neutral, neutral-alpha, success/warning/error/info) + 12 semantic (`color-accent`, `accent-hover`, `accent-surface`, `card-bg`, `body-bg`, `content-light`, `color-accent-light`, `color-success/warning/error/info`, `input-border-color`). Semantics alias primitives except colour-mix results (`content-light`, `card-bg` Dark). Code syntax `var(--…)`; scopes set. Converted with `tools/colors_to_figma.py`; 19 mode values chroma-reduced to fit sRGB (Figma) and listed in `colors-figma.json`.
- **Binding rule (repo wins):** bind to the semantic token where the repo uses one: links → `color-accent`, active nav/footer links → `accent-hover`, chip → `accent-surface`, cards → `card-bg`, white band → `content-light`. Header/hero/footer bands → `brand/150` (repo sets that inline; no semantic token). Text → `neutral/*-alpha`.
- **Radius** collection (`VariableCollectionId:2276:736`): `border-radius-s` 2, `border-radius` 4, `border-radius-rounded` 4096.

### Round 10: text styles (2026-10-25)

| Item | Answer |
|---|---|
| KC Pelletier Sans | User says it's installed on the machine, but the Figma runtime reports it missing (`hasMissingFont: true`, `loadFontAsync` fails). Needs a Figma-side fix (font installer / restart) before display styles + hero edits |
| Text styles | Approved: `body`, `heading` (h1/h2, repo 550), `heading-sm` (h3–h6, repo 425), `headline`, `small` (`<small>`), `small-step` (`.small`), `figcaption`, `display` (step/4), `display-hero` (step/hero). Figma weights = Medium/Regular as in the file; repo weights in descriptions |
| New Utopia vars | `type/small` (base × 5/6) and `font-size-7` (12.75 → 15) added to the import file (now 58 vars); needs re-import |
| Utopia filters (scopes) | Yes: step/type/font-size → font size; space → gap + padding; line-height → line height; letter-spacing → letter spacing; drivers hidden. Re-apply after any re-import |
- Text styles live under a **`site/`** group: the old v1 file already has `body` / `small` styles (left untouched). Created: site/body, site/heading, site/heading-sm, site/headline, site/small-step (bound to Utopia size / line-height / letter-spacing). Pending re-import: site/small, site/figcaption. Pending font: site/display, site/display-hero.

## Port rules: Figma is a snapshot, the repo stays fluid (2026-10-25)

User asked to guarantee the port uses Utopia's full features. Figma-only compromises **must not leak into code**:

| Figma compromise | What the code keeps / gets |
|---|---|
| Min / Max modes with fixed px | Every size stays a `clamp()` from `utopia-core-scss` (`generateTypeScale` / `generateSpaceScale`, `relativeTo: container`, cqi). Changes go into the Utopia **config**, never as px |
| `step/4`, `step/5` | `positiveSteps: 2` → `5` in `_scale.scss` (generated, not hand-written) |
| `step/hero` = content-width ÷ 5.196 | One fluid custom property (clamp or `calc(min(100cqi, var(--grid-width-l)) / 5.196)`-style), designed at port time |
| `space/*` ROUND() trick | Not ported: Utopia already rounds |
| sRGB colours (19 chroma-reduced) | Colours stay the repo's OKLCH `light-dark()` tokens with `--brand-hue` / `--brand-chroma` knobs, P3-wide. Figma hex values are never copied into CSS |
| Ronzino Medium/Bold named styles | Variable-font weights 425 / 550 from the repo |
| `content-light` / `card-bg` dark literals | Stay `color-mix()` in CSS |
| Breakpoint frames (390/834/1512) | Visual checks only. Layout uses fluid scales + container queries; at most one breakpoint for section heroes |

- KC Pelletier Sans: installed locally (`~/Library/Fonts/KCPelletierSans.otf`) but the Figma MCP runtime runs server-side and only sees Figma-provided fonts, so it can't load local fonts. Restart didn't help (2026-10-25).
- Re-import verified: same collection/IDs, 58 vars, text-style bindings intact.
- KC Pelletier: **leave hero headings for later** (user, 2026-10-25). No display styles yet; the 5 KC Pelletier text layers stay untouched.
- Created `site/small` (type/small) and `site/figcaption` (font-size-7). Utopia scopes set (FONT_SIZE 10, GAP 34, LINE_HEIGHT 3, LETTER_SPACING 5, FONT_FAMILY 2, WIDTH_HEIGHT 1, hidden 3) + WEB code syntax where a CSS name exists. Re-apply after any re-import.

## Phase 5: Binding the duplicate (2026-10-25)

- Content check (user request): original vs duplicate diffed node-by-node (2,356 nodes: text, names, visibility, structure, images). **Identical.** From now on edits go in the duplicate, or are reported so they can be replayed.
- Frame modes: Mobile + Tablet → Utopia **Min**; 1512 frames → **Max**; Color → Light everywhere.
- Colours: **633 paints bound** (`brand/150` 18, `accent-surface` 3, `content-light` 16, `card-bg` 46, `color-accent` 104, `accent-hover` 10, `brand/800` 82, `brand/900` 34, `neutral/950-alpha` 255, `-900-alpha` 30, `-800-alpha` 4, `-500-alpha` 5, `-400-alpha` 5, `-50-alpha` 21) + theme icon → `neutral/50`. Left raw as agreed: sticker/illustration art, `#061308` logo, `#000`, thumb swatches, brand-picker pink/orange swatches (previews of other hues).
- Radius: 96 nodes bound (2 → `border-radius-s`, 4 → `border-radius`).
- Spacing: **809 gaps/paddings bound** to `space/*`. Frozen capture values mapped by origin; whole numbers snapped to nearest step in the frame's mode (≤20%). Unbound, for review: 6px gaps (×9: nav marker, copy-email icon gap), 7.54 / 5.09 / 11.78 / 23.28 (grid gaps), 26.69 (Work with me card top padding ×4), layout widths 360/392/397/437.
- Text: `site/link` added (body + underline, = `a`). Styles applied to all 381 Ronzino runs: body 183, link 91, heading 53, heading-sm 35, small 10, figcaption 9. Ronzino Bold (1 run) → `site/heading` (repo h1/h2 weight 550 ≈ Medium). 5 KC Pelletier layers untouched (font unavailable).
- Content width: 52 desktop nodes at 982px bound to `layout/content-width` (900 Max); home nav centred. Fixed a header collision: bound gaps grew to fluid Max values and pushed the toggles under "Say hello"; the 900 width restores the margin (nav ends 1206, toggles start 1222).
- Note: "See all case studies" still present in the Mobile/Tablet homepage frames (removed only from desktop, same as the original).

### Round 11 (2026-10-25)

| Item | Answer |
|---|---|
| Unbound values | **Rule: every value is called from a variable, no leftovers.** Odd gaps snap to the nearest token in the frame's mode; space-filling gaps become auto (space-between) or a layout variable; never leave a raw number |
| KC Pelletier | Plan can't share fonts. User OK with building the hero from screenshots / the existing rendered text instead |
| See all case studies | User removed it from Mobile + Tablet in the **original** too. Replay in the duplicate |
- Replayed the user's Explorations restructure (original → copy) by swapping 3 blocks for fresh clones: `2283:771` (Mobile), `2283:777` (Tablet), `2283:783` (Desktop). Then a full idempotent binding pass: **audit = 0 unbound gaps/paddings, 0 unstyled Ronzino text.** Policy used: frozen values via the origin map; anything else → nearest space step in the frame's mode (6 → 3xs/2xs, 1–2px → 4xs, 26.69 → m, …); `itemSpacing` on space-between rows is Figma "Auto" (number ignored), so not bound.
- **Fixed sizes → fluid like the code** (approved): containers/links/list items → Hug/Fill; images → Fill + locked aspect ratio; icons → a size variable (repo em-based); strokes → `border` variables (1px = `--input-border-width`; 0.5 media edge → repo 0.25 = width/4).
- **Mobile/Tablet hero** (approved): outlined copy of the desktop KC Pelletier heading (exact glyphs, not editable), scaled to content width; named "Hero heading (outlined, KC Pelletier)". Feasibility tested and passed.

## Phase 6: No raw values (2026-10-25)

- **Border** collection (`VariableCollectionId:2286:645`): `input-border-width` 1 (`var(--input-border-width)`), `media-edge` 0.25 (`calc(var(--input-border-width) / 4)`). 21 strokes (0.5 in capture → repo 0.25) + 9 + 2 rules bound.
- **Fluid sizes:** 44 text+icon frames rebuilt as horizontal auto layout (gap `space/2xs` after / `space/3xs` before, per `_icons.scss`); 61 icons → `step/0` (1em), `type/small` (source icon), `step/1` (gallery arrows); 9 writing thumbs → `space/2xl` (`_components.scss:579`); 3 brand swatches → `line-height/body`; 30 images → Fill + locked aspect ratio; 56 → Hug, 21 → Fill; gallery overlay → stretch constraints.
- Closed accordions (Work with me "Smaller projects"): content was hidden by clipping a fixed height; now the content container is **hidden** (= closed `<details>`), the text set to Fill for when opened.
- Text overflow fix: 2 writing-item titles set to Fill + wrap.
- **Mobile + Tablet hero** added: copy of the desktop hero band (brand/150, fluid padding) with "Hero heading (outlined, KC Pelletier)" (outlines, not editable), Fill + locked 0.709 ratio, colour `neutral/950-alpha`. Mobile heading 300×213, Tablet 744×527 (hero padding `xl-2xl` Min = 45).
- **Final audit = 0 raw values** (spacing, sizes, strokes, radii, UI colours, text styles), except the 5 KC Pelletier layers' type size/line height/tracking (font not loadable by the agent). Their colours are bound. Excluded by design: artwork/sticker/logo internals, thumb swatches, brand-picker previews, the simulated viewport widths 390/834/1512.

## Phase 7: Components (2026-10-25)

All built on the duplicate, on a **Components** board (`2291:769`, Utopia Max / Color Light) inside the WIP section. Every old block was replaced by an instance; the original section is untouched.

| Component | Repo partial | Variants / properties | Instances |
|---|---|---|---|
| Header | `_header.njk` | Breakpoint=Desktop/Mobile (tablet uses Mobile); nested **Nav link** exposed | 7 |
| Nav link | `<li>` in `_header.njk` | State=Default/Current, Label | 6 per desktop header |
| Footer | `_footer.njk` (+ old contact page, A5) | Breakpoint=Desktop/Mobile (tablet uses Mobile); Site note | 7 |
| Contact card | old contact page blocks | Type=Action/Links; Prompt, Detail, Show detail, Action label, Icon (swap), Show icon, Link 1–3 | 4 per footer |
| Project item | `_project-item.njk` | Layout=Split/Stacked; Title, Services, Show CTA; image fill overridden | 18 |
| Writing item | `_writing-item.njk` | Title, Source, Show source, Date; Thumb fill = cover image or swatch; 8-col grid, thumb spans 3 (see Phase 10 follow-up) | 27 |
| Service card | `_service-card.njk` | Type=Default/Accordion; Title, Description, CTA label, Number, Open | 6 |
| Icon/Copy, Icon/Phone, Icon/External | `_icons.scss` glyphs | — | used by Contact card |

- **Current page fixed:** every captured desktop header marked "Start here". Each page's header now marks its own page (About, Work with me, Ideas, Artmaking).
- **Nav marker floats** (A2): absolute, left of the label, like `inset-inline-start: calc(-1 * var(--nav-indent))`. Its offset is a position, not a token.
- **Header rebalanced** (user feedback): the captured paddings/gaps (15.4 / 30.8 / 31.4) were phone-width values, so binding them to the s-m / m-l pairs inflated desktop. Now padding `space/s` (right `space/l`), toggle gap `space/l`, nav list gap `space/s`; nav aligned to the toggles. Nav width stays `layout/content-width` (900, not the captured 982).
- **Project images locked to 3:2.** Figma can't override a nested layer's size per instance; all source images are ~3:2 (1200×800 / 1200×763), matching `block-size: auto`. The captured 361px-tall rows were cropped crops of the same images.
- **Mobile/tablet footers** now use the desktop design stacked (contact, illustration, colophon), replacing the temporary capture layout.
- Audit: 0 unbound gaps/paddings on the board.
- Not componentised (not in the agreed list): About FAQ `<details>`, testimonials, "Typical clients" cards.

### Phase 7 follow-up: nav marker in flow (2026-10-25, supersedes A2 "floats")

- **User:** a floating bullet sat in the gap between the previous link and the current one, so it was unclear which page it belonged to.
- **Now:** Default links have no bullet and reserve no space. **Current** and **Hover** put the bullet in flow before the label (gap `space/3xs`), so the normal list gap (`space/s`) sits to its left and the row nudges open. This is the repo's current behaviour, laid out horizontally instead of stacked.
- **Figma:** Nav link has a third variant, State=Hover. Default → Hover is wired on hover with a gentle smart-animate, previewable in prototype mode.
- **Port:** in code, the shift gets an eased transition (a gentle nudge, not a jump) on current/hover. Respect `prefers-reduced-motion`.
- **User edit, kept:** the Footer Mobile illustration now fills its parent in flow, not absolutely positioned, with equal space above and below.

## Phase 8: Artmaking list completed (2026-10-25)

- Added the **10** missing projects from `src/_data/artProjects.json` (13 in the repo, 3 already in Figma; earlier notes said 9 / 12). They follow the repo order, after Passing Notes.
- Each one copies the user's Passing Notes layout: title | description + year + link (removed when `link` is absent: Exhibition Title Bot), then a 2-column image grid.
- 33 images were uploaded from `src/assets/art/`. Each frame is locked to its source file's aspect ratio (via `sips`), and each layer name carries its alt text.
- The grid rows align (row height = tallest image), as in the user's existing sections. The repo's `.masonry` packs short images under tall ones, which is a port-time detail.

## Phase 9: Homepage Index + Explorations carousel (2026-10-25)

- **Index:** the 3 duplicated featured projects are replaced with the repo's `workIndex`: every non-featured project, `endDate` desc. Not Bad has `eleventyExcludeFromCollections`, so it's skipped. That's 9 items × desktop / tablet / mobile = 27 Project item instances.
  - "Read case study" shows only where the project has a `permalink`: Make & Mind, Mega Seating Plan, Blueberry, Film & TV. `work.json` sets `permalink: false`, so the rest have no page.
  - Images are the repo's listing images, resized to 1600px JPEG for upload and cropped to the component's 3:2.
- **Carousel component** (`2299:3910`): one variant per slide (Slide=1…6) on a 3:2 viewport, images cropped to cover.
  - The Track and slides use SCALE constraints, so one component works at 900 / 774 / 345.
  - The controls overlay stretches with it. Its width was unbound from `layout/content-width`; it's an overlay that follows the carousel, not a layout width.
  - Next / Previous run CHANGE_TO with smart animate (ease-in-out, 0.45s) and wrap 6 → 1.
- **Test images (placeholders):** OAF outdoor hero, Make & Mind workshop, concert photo, Three Years reading, OAF leaflet, New Alumni '19.
- Replaced the 3 Explorations blocks (desktop, tablet, mobile) with instances.

## Phase 10: Tablet + mobile frames for the inner pages (2026-10-25)

- New frames: About, Work with me, Ideas & Guides and Artmaking, each at Tablet 834 and Mobile 390. They sit in a row below the desktop frames (Artmaking's below its long desktop frame), Utopia **Min** mode.
- **Rules applied** (repo container breakpoints at 15px root: `$bp-s` 480, `$bp-l` 735, `$bp-xl` 960):
  - Header and Footer use their Mobile variants.
  - Page gutters are `space/l` (tablet) and `space/m` (mobile), matching the homepage frames.
  - Blocks bound to `layout/content-width` were unbound and set to Fill.
  - **Tablet** keeps the two-column sections (`.grid-responsive-cols` ≥ 480) and the 2-up galleries (`.masonry` ≥ 480).
  - **Mobile** stacks every wide grid or row (the source's ≥ 800 px desktop blocks), in grid reading order, keeping the bound gap. Galleries go 1-up with images at full width and their locked ratio.
- **Writing item fix (component):** the thumb had become Fill width + ratio lock and squeezed the text on tablet. It's now a fixed `space/2xl` square, as in `_components.scss`. *(Superseded by the user's grid redesign below.)*
- Audit: 0 unbound gaps/paddings in the 8 new frames. The WIP section was resized to contain them.
- **Open:** the KC Pelletier hero headings (Work with me, Artmaking × tablet/mobile) can't re-wrap through the API (font not loadable server-side), so they render with their desktop line breaks and overflow on mobile. Their size is still raw 55px. This belongs to the deferred display-type work (`step/4`), and the user's Figma app re-wraps them once the text is touched.

### Phase 10 follow-up: Writing item redesigned by the user (2026-10-25, supersedes the fixed `space/2xl` thumb)

- **User change:** the card is now an **8-column grid** (equal `1fr` tracks, one hug row). The thumb spans columns 1–3 (Fill width, locked 1:1, radius `border-radius-s`) and the body spans 4–8. The thumb scales with the card: about 136 px on desktop, 120 on tablet, 109 on mobile.
- **Check:** structure, text styles, colour and padding bindings, and properties (Title, Source, Show source, Date) are all intact. All 27 instances update.
- **Fixed:** the grid column/row gap was a raw 25.31 px (the desktop value of `space/s-m`), so tablet and mobile kept the desktop gap. It's now bound to `space/s-m` (15 px at Min).
- **Port:** `.writing-item` becomes `display: grid; grid-template-columns: repeat(8, 1fr); gap: var(--space-s-m)`, with `.writing-item__thumb { grid-column: span 3; inline-size: 100%; block-size: auto; aspect-ratio: 1 }` and `.writing-item__body { grid-column: span 5 }`. This replaces the fixed `var(--space-2xl)` square in `_components.scss:577`.

## Phase 11: Hero headings as real, styled text (2026-10-25)

- **Deleted** the `VP test` variable collection (user request). Checked first: no layer on page v2 and no variable alias used it. The 3 test JSON files in the repo root are still there.
- **Approach (font workaround):** the agent runtime still can't load KC Pelletier Sans. The display styles therefore use a **stand-in family** (Ronzino, `site/heading` weight) with uppercase and every metric bound. The user swaps the family on the two styles once in their Figma app, and every hero switches font and re-wraps.
  - `site/display`: size `step/4` (47.4 → 53.3; the captured 55.2 snaps to it), line-height `line-height/display` (new, `step/4 × 0.74`; 74% until the re-import lands), tracking 0.
  - `site/display-hero`: size `step/hero`, line-height `line-height/hero`, tracking `letter-spacing/hero`.
- **Replaced** all 13 KC Pelletier text layers (desktop + the new tablet/mobile frames) and the 2 outlined homepage mobile/tablet vectors with real text named "Hero heading", colour `neutral/950-alpha`.
  - Section heroes: centred. Desktop width is bound to `layout/content-width` (900; the captured `maxWidth` 982 can't be bound on text). Tablet and mobile fill the hero.
  - Home hero: hug, keeping the user's line breaks and spacing (5 visual lines, as captured).
- **Generator:** `tools/gen_vp.py` adds `line-height/display`. `variables-plus-import.json` is regenerated (59 vars) and needs a **re-import**.
- **Until the swap:** Ronzino is wider than KC, so the home hero overflows (desktop 1337 vs 900 content; mobile 490 vs 345). `step/hero` is calibrated to KC's widest line (5.196 em), so this resolves after the swap. Verify then.
- **Re-import done** (59 vars). `site/display` line-height is now bound to `line-height/display` (53.28 / 39.43 desktop, 47.36 / 35.05 mobile). Scope set to `LINE_HEIGHT`, like `line-height/hero`. No code syntax: new token, named at port. Hero headings now have zero raw values.
- **Remaining user step:** switch the family of `site/display` and `site/display-hero` to KC Pelletier Sans Regular, then verify the home hero fits the content width.
- **REVERTED (user, same day):** the user doesn't want the hero font changed, even temporarily. Undone:
  - The 13 KC Pelletier text layers are restored from the original section (cloned, colour re-bound to `neutral/950-alpha`). Desktop keeps its original `maxWidth` 982; tablet/mobile fill the hero.
  - The homepage mobile and tablet headings are outlined KC Pelletier vectors again (Fill + locked ratio).
  - `site/display` and `site/display-hero` styles deleted; `line-height/display` removed from Figma and from `gen_vp.py`; import file regenerated (58 vars).
  - **State is back to the pre-Phase-11 rule:** KC Pelletier layers keep raw size/line-height/tracking because the font can't be loaded by the agent. The tablet/mobile KC text still shows desktop line breaks until it's touched in the user's Figma app.
  - **Lesson:** never replace a typeface, even as a stand-in, without explicit approval.
- **Hero ownership (user, 2026-10-25):** the user fixed the homepage hero (desktop, tablet, mobile) by hand and will tweak the other pages' heroes the same way. Agent rule: put the KC Pelletier heading in as a placeholder (copy of the desktop layer) and leave hero typography to the user.
- **Cleanup (2026-10-25):** the 3 Variables Plus test/sample JSON files (moved by the user to `docs/frn-2026/test files/`) were deleted with approval, and the empty folder removed. The `VP test` Figma collection was deleted earlier.
- **Hero heading size (user, 2026-10-25):** not modelled in Figma. Utopia fluid sizing is applied in code after the merge, likely `--step-4` or `--step-5` as agreed in Round 7. The user tunes the Figma hero text by hand meanwhile.
- **Hero illustrations (done):** fluid height via one new Utopia variable `size/hero-illustration` (Max ≈ 220 = today's desktop; Min = **70% → 154**, chosen by the user from a side-by-side preview), bound to the illustration height with a locked ratio. Port: `block-size: var(--size-hero-illustration); inline-size: auto`. Comparison board deleted. Added to `gen_vp.py` as a driver (154 / 220); import regenerated (59 vars), re-imported. All 6 illustrations (Work with me + Ideas & Guides × desktop/tablet/mobile) have height bound and ratio locked: 220 desktop, 154 tablet/mobile (both Min mode); widths follow (runner 267/187, meditator 249/174). The Ideas meditator GROUP is wrapped in frame `illustration/meditation` with scale constraints. Variable scope `WIDTH_HEIGHT`.

## Phase 12: Repo pages not yet in Figma (2026-10-25, desktop only)

- **Scope (user):** two examples per template, plus the writing type pages, Collaborate, Accessibility and 404. Service pages (`/studio/design/`, `/studio/consultations/`) are out. `/work/` and `/contact/` are **retired** (content now on the homepage Index and in the footer); redirect them at port. Desktop only for now; tablet/mobile later via the Phase 10 pass.
- **Built** (new row at y 38000), copy word for word from the repo via `tools/repo_pages.py` (Markdown + `figureImg`/`projectVideo` → block specs):
  - Case studies: **The Loft** (media-heavy: 3 images + 5 video posters) and **Mega Seating Plan** (text-heavy).
  - Writing posts: **3 things a designer would tweak on your flyer** (8 images) and **The hard part isn't the no** (text + rules).
  - **Writing type pages** (Essays 6, Guides 4, Notes 3 items, repo order, hidden posts excluded). Ideas section pattern: label as H1 on the left; blurb, breadcrumb, Writing item instances and "← All writing" on the right.
  - **Collaborate, Accessibility statement, 404**, in the About section pattern (section title | content), with cards, the CTA card, and Contact/link icons from the component icons.
- **Long-form layout** (repo `.case-study`): intro (h1 `site/headline` + dimmed services or date · type), text column = `--inline-size` (40rem = 600), media at `layout/content-width` (the scroll "breakout" state). Per-block top spacing mirrors `_components.scss:525`: p→p `space/s-m`, headings `space/l-xl`, around media `space/xl-2xl`, media→media `space/s-m`, intro→body `space/2xl-3xl`. Blockquote = card with accent-surface left bar.
- **Media:** images from `src/assets` (resized to 1600 px JPEG for upload). Videos are shown as their first frame (ffmpeg), named "Video poster (…)". Collaborate photos are flagged "duotone": the `.duotone` blend is a port-time CSS effect, shown as plain photos here.
- **Known gaps:** Ronzino has no italic, so `*why*` / `*shakes his head*` render upright (asterisks removed). Header current page: Ideas on posts and type pages; none elsewhere.
- **Pending:** `layout/inline-size` (new driver, 330 / 600, = `--inline-size`) is in `gen_vp.py` and the regenerated import (60 vars). After re-import, the long-form text blocks (still a raw 600) get bound. Audit otherwise: 0 unbound gaps/paddings in the 10 new frames.
- **Case-study template v2 (user edit on The Loft, 2026-10-25):** media is full-bleed (Fill, `space/l` side padding, `space/xl-2xl` above and below); back-to-back media sit in a 2-col grid (gap `space/s`); text right after media has top padding 0. Applied to Mega Seating Plan (single hero figure). Not yet applied to the two writing posts (same repo shell). Note: The Loft's "Solution" H2 keeps `space/xl-2xl` top after a media grid (double gap), maybe unintended.
