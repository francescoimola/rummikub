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
- **User fixed** The Loft's "Solution" H2 (top padding removed), so the double gap is gone.
- **Template v2 applied to both writing posts** (same `.case-study` shell in the repo): media full-bleed with `space/l` sides and `space/xl-2xl` above/below; text after media at top 0. The flyer guide's two back-to-back image pairs (Hermès + Bienal, bleed before + after) now sit in "Media pair" 2-col grids (gap `space/s`, row = hug).
- **`layout/inline-size` imported:** all 96 long-form text blocks (intro, paragraphs, headings, lists, quotes, rules) across the 4 pages are bound to it. The long-form pages now have no raw widths.
- **Port rule:** consecutive media render side by side as a 2-col grid at any width that fits two columns; single media bleed to the page gutter. This replaces the repo's scroll breakout (`breakout`/`settle` keyframes) unless the user wants both.

## Phase 13: Image ratios, capped post media, user page edits (2026-10-25)

- **Five image ratios (user: "top 5 most used").** Survey of every visible image fill in the WIP section and the components board (228 masters, instances excluded), each snapped to its nearest ratio in log space: **3:2** (110), **2:1** (53), **1:1** (21), **4:3** (19), **16:9** (8). Portraits use the same ratios turned upright: 2:3 (9), 3:4 (5), 9:16 (3). That choice is the agent's, so a 2:3 painting isn't cropped square. 51 images changed height (width kept, image fill = cover); all 224 visible ones now have a locked ratio. Excluded: the two hidden footer "STICKER" rectangles. Component thumbs were already exact (Project item 3:2, Writing item 1:1, Carousel 3:2).
  - Biggest crops: three Exhibition Title Bot art images 2.33 → 2:1 and The Hard Part hero 1.25 → 4:3. The Loft's first media pair now mixes 2:1 + 16:9 (uneven heights).
  - **Port:** add tokens `--ratio-square: 1`, `--ratio-classic: 4/3`, `--ratio-photo: 3/2`, `--ratio-wide: 16/9`, `--ratio-pano: 2/1` (names TBD) and give every `img`/video poster `aspect-ratio` + `object-fit: cover`. Static and CMS-driven pages alike: `figureImg`/`projectVideo` take a `ratio=` param (defaulting to nearest, computed at build from the source size); `artProjects.json` images get a `ratio` field. The writing-post `max-block-size: 50cqw` hack (`_components.scss:618`) goes away.
- **Post media capped (user edit on both posts + Mega Seating Plan):** the opening image, and any single image between paragraphs, is capped at `layout/content-width` (Figure FIXED width bound, `space/l` sides, `space/xl-2xl` above/below). The agent applied the same to the flyer guide's remaining full-bleed single (Proprietors' Club). Media pairs stay full-bleed grids. The Loft (case study) keeps full-bleed singles unless the user says otherwise.
- **Writing type pages:** the user's new `Layout=Expanded` Writing item variant (`2329:9090`, used on Essays/Guides/Notes) had unbound text, so every item showed the default "I hope someday…" title. Fixed: Title/Source/Date text and Source visibility bound to the set's existing properties. All 13 items show their own title, date and source. The section structure (H1, blurb, breadcrumb, items, back link) already matched across the three pages.
- **Collaborate (user redesign, record for port):** simplified header (no site nav, so visitors aren't pulled away); new hero + a post-hero H2 in the hero face; sections repositioned; some copy changed; the section before the footer is now a large CTA. Copy changes are Figma-only until ported to `src/collaborate*`.
- **Accessibility statement → writing-post template (user):** rebuilt on the post shell. Intro H1 + dim line "Last updated 4 August 2026" (moved up from the old closing section); 3 paragraphs; H2s with bulleted lists (body style, not links); email card in an inline-size wrapper. Copy is word for word from `src/accessibility.njk`. Old main content kept **hidden** in the frame ("Main Content (old layout, hidden)"), to be deleted on approval. Port: render with `.case-study text` (no `writing-post`).
- **404 (user edit, record for port):** hero H1 added at the top, copy updated, spacing tweaked.
- **Image component (user, 2026-10-25):** every content image is now an instance of **`Image`** (`2341:9739`, components board), so the crop is one dropdown. Variant property **Ratio**: 3:2, 2:1, 1:1, 4:3, 16:9 + portraits 2:3, 3:4, 9:16. Structure: hug-height auto-layout root → `Media` rectangle (Fill width, locked ratio, placeholder `neutral/200`). The picture is the `Media` fill override and survives a variant swap. Width comes from the layout, height follows the ratio.
  - **Swapped:** 144 page images in the WIP section, plus 40 inside components: Project item (both layouts), Writing item (both), and all 36 Carousel slides. Inside components the Image instance is **exposed**, so its Ratio can be changed from the outer instance. Every instance's picture override was carried over (Project item 39/39, Carousel 18/18). Radius/stroke styling (post media: `border-radius` + `media-edge`) is kept as overrides on `Media`.
  - **Incidents, fixed:** three placements failed on auto-positioned grids after the originals were removed: Passing Notes Zine (Artmaking desktop + tablet) and the Collaborate duotone portrait. The zine was restored from the mobile copy; the portrait was re-uploaded from `src/assets/images/francesco-bw.png` and placed first in its row (repo order). The Writing item thumb lost its grid span; restored (Default: cols 0–2, Expanded: cols 0–1) and both variants set to hug height (Default 174, was a fixed 169).
  - **Port:** maps to one image partial/shortcode param (`ratio=`) feeding `aspect-ratio` + `object-fit: cover`; see the ratio tokens above.

## Phase 14: User sign-off + tablet/mobile for the new pages (2026-10-25)

- **User decisions:** WIP copy approved. The original section `2260:2139` stays as an **archive**. Portrait ratios kept. The old Accessibility layout was deleted. Case studies follow the posts: The Loft's four single media (opening video, colour-system image, mobile walkthrough, logo video) are now capped at `layout/content-width`. Media pairs stay full-bleed grids.
- **Tablet 834 + Mobile 390** for all 10 new pages (20 frames, row at y 11995 under each desktop frame, Utopia Min), built with the Phase 10 recipe: Mobile header/footer variants, `space/l` / `space/m` gutters, width-bound blocks set to Fill, mobile stacks ≥ 800 grids/rows in reading order. Long-form media also drop their `space/l` side padding, since the page gutter now does the inset.
  - **Known gap:** Fill makes the tablet text column 774 px, against `--inline-size` 600 in code. Figma can't express that cap in Min mode, so the code step keeps `max-inline-size: var(--inline-size)`.
  - **Collaborate:** the simplified header's nav is stretched within the header padding (absolute, STRETCH constraint) on tablet. On mobile it becomes an in-flow wrapping row (`flex-wrap`, gap `space/s`, row gap `space/2xs`), and the toggles drop to a second line. Featured work items use `Layout=Stacked` on mobile, like the homepage.
  - **Hero text:** the KC Pelletier headings (Collaborate, 404) keep desktop line breaks, for the user to tweak.
  - **Bindings:** raw grid gaps from the desktop edits are now bound to the grid's own `itemSpacing` token: Collaborate Section → `space/3xs-m`, Theme toggle (incl. the Header component) → `space/3xs`, so 5.09 → 4.69 on desktop. Audit: 0 unbound gaps/paddings in the 20 frames.
- **Fix (user report, 2026-10-25): stretched toggles and icons in the responsive frames.** Two bugs in the Phase 10/14 responsive script, which built all 28 tablet/mobile frames:
  1. It unbound **every** width variable, not just `layout/content-width` / `layout/inline-size`. Icons (`step/0`) and colour swatches (`line-height/body`) lost their size token and turned non-square in Min mode. **Fixed:** 58 widths rebound to their desktop variable (52 `step/0`, 6 `line-height/body`); the vector paths of 44 icon frames were rescaled from desktop geometry. Instance icons (Copy, Phone, External) rescale on their own once the width is bound.
  2. When it filled a text block, it also forced the block's hug-sized ancestors to fill, so link rows, toggle groups and nav lists stretched across the column and the icons went with them. **Fixed:** every stretched non-text row and its contents are restored to their desktop sizing: Collaborate + Accessibility (47 layers), About (12), Artmaking (33). Text blocks still fill on small screens, as intended.
  - Verified: Collaborate header (tablet + mobile), Copy / Phone / link arrows, About and Artmaking link rows.
  - **Rule for future responsive passes:** only unbind the two layout widths, and never promote a parent from hug to fill.

## Phase 15: Service pages (2026-10-25)

- **Built** `/studio/design/` ("Service - Web design") and `/studio/consultations/` ("Service - Website consultations"): desktop to the right of 404 at y 1762, tablet + mobile below at y 11995. Copy is word for word from `src/studio/*.njk`.
- **Shell = Work with me** (header with Work with me current, hero, footer). The hero illustration is swapped for the repo's `deskgarden` / `websitevisit` SVG: flattened, `neutral/950-alpha`, height bound to `size/hero-illustration`, ratio locked. The `pageHeader` blurb sits under the heading in body text, centred.
  - **Hero heading placeholder:** the KC Pelletier layer still reads Work with me's line, because the agent can't edit that font. The user retypes "Unapologetically simple websites" / "Like a doctor's check-up, but for your website". The same applies to the CTA card heading ("I don't bite" → "Let's talk about your website" / "Learn what’s holding your website back").
- **Blocks reused:**
  - Sections: Work with me's highlighted `Heading 2` pill (= `[highlight-header]`) | content column, with grid rows set to hug.
  - Figures: the Image component; OAF homepage at 16:9 with a link caption, The Collective at 3:2.
  - CTA: the user's Collaborate card. Call link first, as in `ctaCard`; label "Book a consultation" on Consultations.
  - FAQs: the About `Details`/rule list (collapsed).
  - Cards: Collaborate's "What I do" card (now hugging height).
- **New element (port: `.pricing-list`):** "Pricing item" rows. Title + dimmed description (Fill, gap `space/3xs`) | dimmed price (hug, no wrap), gap `space/m`, bottom padding `space/m`, bottom border `input-border-width` / `input-border-color`. The list gap is `space/m` and the intro → list gap `space/xl`, from the repo's `has-gap-*` classes.
- **Lists:** ordered lists ("Always included", "Things we can cover") are rows with a number marker, because separate Figma text nodes can't continue numbering. Bulleted lists use native Figma bullets, with a line separator between the bold title and the dimmed line.
- **Responsive:** built with the corrected recipe: only the layout widths are unbound, and a parent is promoted to fill only if it's wider than the screen itself. Audit: 0 unbound gaps/paddings in all 6 frames, no overflow, no misshapen icons.

## Phase 16: Code-mapped components (2026-10-25)

Eight components that map 1:1 to a repo template, shortcode or glyph system; loose copies on the pages swapped for instances. Audit: 0 unbound gaps/paddings in all eight.

| Component | ID | Repo | Props | Swapped in |
|---|---|---|---|---|
| Icon link | `2352:18813` | `[data-icon]` (`_icons.scss`) | Label, Icon (Phone / Copy / External / Arrow-right) | 97 page link rows (22 →, 45 ↗, 15 copy, 15 phone); label style/colour kept as overrides |
| FAQ item | `2353:18925` | `<details>` | State=Closed/Open, Question, Answer | 42 rows (About + both service pages × 3 sizes), answers word for word from the repo; `<hr>` stays a sibling |
| Breadcrumb | `2353:19355` | `_breadcrumb.njk` | Parent, Current | 9 (writing type pages × 3) |
| Look toggles | `2353:19425` | `_look-toggles.njk` | (none) | Header Desktop variant + Collaborate desktop/tablet |
| Figure | `2355:19174` | `figureImg` / `projectVideo` | Type=Image/Video, Caption, Show caption, Show control; Image exposed | 48 wrappers (posts, case studies, Work with me, service pages); ratio, picture, radius/stroke, padding, width binding kept |
| CTA card | `2355:19680` | `_cta-card.njk` | Heading, Body; Call link + Email link exposed | 9 (Collaborate + service pages × 3) |
| Page header | `2357:19433` | `_page-header.njk` | Illustration (swap), Heading, Blurb, Show blurb (off) | none yet, see below |
| Split row | `2357:19451` | `_split-row.njk` (text half) | Layout=Split/Stacked, Title, Description, Year, Show link; Link exposed | 39 (Artmaking × 3) |

- **New icons:** `Icon/Arrow-right` (`2352:18808`, glyph `arrow-right`) and `Icon/Chevron-right` (`2352:18809`, glyph `chevron-right`, uploaded from `_icons.scss`). The 51 loose ↗ frames (`icon/link`, `icon/list-link`) now use the existing `Icon/External`.
- **Illustrations:** `Illustration/runner` (new), `meditating`, `deskgarden`, `websitevisit` (`2357:19402/19404/19426/19428`), height bound to `size/hero-illustration`.
- **KC Pelletier limit:** a KC text can be bound to a TEXT property, but the agent can't set it on an instance ("component uses a font that isn't available"). So:
  - **CTA card:** its heading defaults to "I don't bite" and is edited in the Figma app.
  - **Page header** is **not** swapped into any page, because instances would reset the user-tuned hero headings. The user can swap heroes by hand.
- **Look toggles** follow the Header/original archive width (theme switch 86 px). Collaborate's copy had drifted to 47 px.
- **CTA order** follows the macro: call link first. This flips Collaborate's original copy-first order.
- **Split row** covers the text half only: Figma components can't hold a variable number of images, so the masonry stays a frame of Image instances.
- **Noticed, untouched:** the service-page hero blurbs were gone from all six frames (looks like a user edit), so Page header ships with Show blurb off. The user also simplified the Collaborate mobile header (name + Menu).
- **Not converted (inside other components):** the Contact card and Footer still hold their own link rows, so their instance overrides stay intact.

## Phase 17: Pre-migration audit (2026-10-26)

Findings register: `docs/frn-2026/audit.md` (IDs F01…, status, owner). Facts come from read-only subagent sweeps of every WIP frame, the components board and the repo. Component docs go in `docs/frn-2026/components/` once the audit is done.

### Round 1 (2026-10-26)

| # | Question | Answer |
|---|---|---|
| Q1 | Where Figma component docs link | GitHub blob URL on `development` (repo is public) in the component's documentation link; one-line description with purpose + repo path |
| Q2 | Where findings live | `docs/frn-2026/audit.md` register; decisions here as Phase 17 |
| Q3 | When fixes happen | After each round, agent-fixable Figma fixes in the WIP section; KC Pelletier items go on the user's list in `audit.md` |
| Q4 | Doc status meaning | Tracks the **redesign**: `planned` (pattern, no component) → `figma` → `code` (redesign ported). Old partials don't count. Docs keep OAF's Layer line |
| Q5 | `GLOSSARY.md` | **Deferred** to the very end of the refactor. Component names stay canonical meanwhile |
| Q6 | Tablet long-form text 774 vs 600 | **Fix.** `layout/inline-size` = 600 in both modes (repo constant); tablet/mobile text blocks Fill + max width bound to it |
| Q7 | CTA card link order | **Collaborate keeps email first, deliberately.** Service pages keep call first (macro default). Mechanism: round 2 |
| Q8 | Contact card / Footer links | Swap loose rows for nested Icon link instances, labels bound to the existing props |
| Q9 | Split row covers the text half | Keep; the doc describes the whole row; Masonry gets its own pattern doc |
| Q10 | Art year not dimmed | Already bound to `neutral/900-alpha` (log was stale). Closed |
| Q11 | Writing item Default 174 vs 169 | Accept 174 (hug). Closed |
| Q12 | Collaborate minimal header | Becomes a Header variant, after re-reading the latest desktop + tablet edits |
| Q13 | Page header swap | Agent writes **Figma AI prompts** to swap the heroes to Page header instances, rather than the user swapping by hand |
| Q14 | Variant property names | Header + Footer `Breakpoint=Desktop/Mobile` → `Layout=Wide/Narrow` (approved rename) |

- Q6 done in the generator: `gen_vp.py` `layout/inline-size` 330/600 → 600/600; `variables-plus-import.json` regenerated (60 vars).

### Round 2 (2026-10-27)

| # | Question | Answer |
|---|---|---|
| Q15 | Narrow header open state | Add `State=Closed/Open`. Open is simple, modelled on the main header's open state in Figma: Look toggles left, links right |
| Q16 | Current-page marker | Accessibility + 404 use the **Minimal** header (no nav, nothing to mark). **"Case studies" leaves every nav**: the index lives on the homepage; any link to it points at the homepage anchor where Featured case studies begin. Posts/type pages → Ideas; services → Work with me |
| Q17 | Minimal header contents | Site name · "To main site →" link · Look toggles grouped (theme + colour), modelled on the current Collaborate header. Narrow keeps the Menu; Open = toggles left, the one link right |
| Q18 | CTA order | `Order=Call first/Email first` on CTA card; Collaborate = Email first (audience emails more than it books calls). Code: `ctaCard` gets an `emailFirst` param |
| Q19 | Contact card → Icon link | Read the 204 instances' values, swap rows to exposed Icon link instances, write the values back, delete the 6 old props. One-Footer trial first |
| Q20 | Section hero size | New Utopia pair `step/2-4` (26.7→53.3). Section heroes + CTA heading bind to it; home hero binds `step/hero`. Binding by Figma AI (KC text) |
| Q21 | Hero illustration | Keep `size/hero-illustration` 154→220 as a height; code ports it as `block-size` and drops the padding hack |
| Q22 | Gutters | Header, Footer, Home hero follow the page gutter (tablet `space/l`, mobile `space/m`); desktop Footer column aligns to the 900 column |
| Q23 | Footer site note | Default: "This site has been designed by hand with love and a healthy dose of anxiety. It runs on servers powered by renewable energy." Per-page overrides cleared |
| Q24 | Service pages | Tablet/mobile copy is canonical; desktop brought in line (agent: non-KC; Figma AI: KC heroes + CTA headings) |
| Q25 | Artmaking row | Figma's text-above-images row is the new design. Code: prefer an intrinsic grid / container queries over a viewport breakpoint |
| Q26 | Intro → first media | Accept `space/xl-2xl` |
| Q27 | Home profile photo | Add to tablet + mobile, roughly following the user's latest edits |
| Q28 | Hero copy | User fixed it in Figma |
| Q29 | Uncomponentised patterns | Components: Quote card, Pricing item, Section heading (with an easy Highlighted ↔ Plain switch). Pattern docs: Section, Card, Ordered list, Media pair, Masonry, Data list. Work's "Figure" frames → "Quote card" |
| Q30 | Deletes | Approved: `site/hero-display/*` styles, hidden STICKER images, empty "Placeholder for Italic Text", Collaborate's hidden nav links. Kept: FAQ Open, Figure Video |
| Q31 | Bulk drift | Approved as listed in the round (F10, F12, F13, F18, F19, F25, F26, F29, F32, F34, F35, F37, F38, F39, F40, F43, F44, F45) |

- Round 2 applied 2026-10-27 (details per finding in `audit.md`). Also: the "To main site" link the user added inside Look toggles showed in every Wide header and overlapped the nav; it is now a `Main-site link` boolean (off by default, on for Collaborate). New Utopia var `step/2-4` (generator + Figma). KC work queued as Figma AI prompts P1–P4 in `figma-ai-prompts.md`.

### Round 3 (2026-10-27)

| # | Question | Answer |
|---|---|---|
| Q32 | Case studies in the nav | No "Case studies" nav item anywhere (already absent in Figma). Code: add an anchor on the homepage Featured heading (`/#case-studies`); case study pages mark no nav item |
| Q33 | "To main site" link | Not part of Look toggles. Header Minimal holds a horizontal `Controls` row: Look toggles + the link, gap `space/l` (same as theme ↔ colour). Neutral link style as designed. Look toggles' boolean deleted |
| Q34 | Consultations CTA heading | Keep Figma: "Book a website consultation and get sound expert advice" |
| Q35 | Per-size KC styles | Merge after P1 (prompt P5) |
| Q37 | Section frames built three ways | Leave the Figma frames as they are. The Section pattern doc defines the one construction (2 columns, heading \| content, stacked when narrow); code has one Section |
| Q36 | Work illustration width | New driver `size/illustration-wide` 345 → 449.28, bound at all 3 sizes |
| Q38 | Collaborate testimonial | One testimonial (the sweep's "3" was one per breakpoint); now a Quote card instance ×3 |
| Q39 | Home mobile photo position | Intentional |
| Q40 | Carousel icon size | `step/0` |

### Audit closed, component docs written (2026-10-27)

- Figma AI ran P1, P3 and P4; the user did P2 by hand; the agent did P5 (style reassignment needed no font). Three KC styles remain: `site/hero`, `site/homepage/hero`, `site/cta/heading`. Verified: no size, line-height or width changed.
- User confirmed the audit is done. Every finding in `audit.md` is fixed, closed or left for code.
- `components/` written: README (index, conventions, cross-cutting rules, open questions), `_template.md`, `_tokens.md` (resolved Min → Max), and 28 docs (22 components, 6 patterns).
- Every Figma component links to its doc (GitHub `development` blob URL) with a one-line description. Descriptions use curly quotes and no angle brackets, because the plugin API re-escapes them (F45).
- Open questions from the docs are listed in `components/README.md`, to be settled in a grilling round before the port.

## Phase 18: Component grilling (2026-10-27)

Settles the open questions in `components/README.md`. Numbered G1… so they don't clash with Phase 17's Q1–Q40.

### Round 1

| # | Question | Answer |
|---|---|---|
| G1 | Nav label | "Ideas" in header, breadcrumb and any footer link. The `/writing/` heading and `<title>` stay |
| G2 | Wide Look toggles | Pinned to the right edge, as drawn |
| G3 | Nav hover bullet | Superseded by G49: no bullet; underline instead |
| G4 | Footer nav | Dropped: the footer is Contact cards + colophon only |
| G5 | Badges | Design Declares → `https://designdeclares.com/`; Creatives for Climate → `https://www.creativesforclimate.co/about` |
| G6 | Contact card prompt | Re-asked (the repo's "Up for a chat?" footer sits in Explorations, which is out of scope) |
| G7 | Theme switch glyph | Repo wins: sized with `--space-s-m`; bind the Figma glyph to it |
| G8 | Icon colour | `currentColor` in code; Figma glyphs rebound to `color-accent` |
| G9 | Copy email | Stays a `<button>` |
| G10 | Illustrations | Footer drawing inline SVG with `currentColor`; hero illustrations keep `currentColor` |
| G11 | Image ratios | Token names state the ratio (`--ratio-3-2`, `--ratio-2-1`, `--ratio-1-1`, `--ratio-4-3`, `--ratio-16-9`, portraits `--ratio-2-3`, `--ratio-3-4`, `--ratio-9-16`). No `ratio=` → natural shape, no crop, no build-time measuring |
| G12 | `font-size-7` | Don't keep it: snap to the nearest Utopia step (see round 2) |
| G13 | Scroll animation | `settle` stays on hero media (case studies, writing posts). `breakout` stops on case studies, including where used today; it runs only on writing posts and where a developer opts in with `view-animation="breakout"`. Media pairs sit at content width |
| G14 | Carousel controls | CSS only: scroll-snap + `::scroll-button()`. No JS; browsers without support swipe/scroll |
| G15 | Carousel content | Six slides from `src/_data/explorations.json`, no links, no auto-advance, **editable in Pages CMS** |
| G16 | Page header illustration | Add a "Show illustration" boolean |
| G17 | Page header blurb | Dropped (macro param + Figma property) |
| G18 | CTA heading | `h2` everywhere |
| G20 | Project item `$bp-2xl` row | Dropped; vertical at every width |
| G22 | Service card accordion CTAs | Glyph by link type (↗ external, email glyph for `mailto:`) |
| G23 | `adhoc` service type | Deleted from the macro |
| G25 | Art year | Dimmed (`neutral/900-alpha`), body size |
| G26 | FAQ items | Hand-written `<details>` replaced by data, **editable in Pages CMS** (see round 2); each item opens independently |
| G27 | Quote card bar | Drawn in Figma |
| G28 | Quote card data | `quoteCard` macro, copy inline per page |
| G29 | Consultations £225 | Stays a bold paragraph, not a Pricing item |
| G30 | Pricing item markup | Inline `<li>` in `.pricing-list` |
| G31 | Section column gap | `space/s` everywhere |
| G32 | Highlight flag | A class on the `h2`, not an attribute on `<section>` |
| G33 | Ideas type sections | Use the Section grid |
| G34 | Card | Real Figma component (`Style=Outline/Featured`); Collaborate radius `border-radius-s` |
| G35 | Ordered list | One gap `space/s`; browser `::marker` |
| G38 | Data list | Figma's layout (year column beside label over value), fold as `@container` |

Re-asked in round 2: G6, G19, G21, G24, G36, G37.

### Round 2

| # | Question | Answer |
|---|---|---|
| G39 | "Explorations" | Two things were sharing the name. The Figma idea-testing area is now **"Trial and error"** (`2246:3661`, hidden, out of scope, like the archive). The real site is designed under the francescoimola.com section. **Explorations** means only the homepage carousel: self-initiated or experimental work with no client attached. Data in `src/_data/explorations.json` |
| G6 | Footer headings | The footer's "Contact" title is the `h2`; each Contact card prompt is an `h3`, styled `site/heading` as now |
| G19 | Project item arrow | No arrow. **Arrow rule:** an arrow marks a link that leaves the page only when the label doesn't already say so. "Read case study" implies a new page, so no arrow; "More about me" could be an in-page action, so it gets →. Applies site-wide |
| G21 | Writing item thumb | Fluid: the thumb scales with its container. The narrower thumb on tablet/mobile is intentional, so the text doesn't wrap onto too many lines. Code approach: round 3 |
| G24 | Split row text | Two columns as drawn (title left, description right), folding to one column on a `@container` query against its parent. The year sits under the description, dimmed, at every size (Figma, corrected in review #45) |
| G36 | Media pair | Change the existing two-column class so it stacks on narrow containers. About and Collaborate change with it |
| G40 | Media pair authoring | New paired shortcode `{% mediaPair %}` in `shortcodes.js` (approved by the user) |
| G37 | Masonry | Dropped, `display: grid-lanes` included. A plain two-column grid, children top-aligned (`align-items: start`), every image at its **natural** ratio (no preset ratio) |
| G12 | Caption size | `step/-1` (11.25 → 12.66) replaces `font-size-7` |
| G26 | FAQ data | `src/_data/faqs.json`, one list per page (`about`, `design`, `consultations`); items have `question` + `answer` (Markdown, CMS `text` field); `faqList(items)` macro renders the `<details>` |

### Round 3

| # | Question | Answer |
|---|---|---|
| G41 | Writing item thumb in CSS | One grid: thumb `3fr` \| body `5fr`, thumb a square filling its column. One `@container` rule switches to `1fr 3fr` when the row is narrow; type pages add `.writing-item--compact` (always `1fr 3fr`). Roughly 75 px mobile, 150 px `/writing/` desktop, 210 px type pages |
| G42 | `.grid-cols-2-fixed` | Renamed `.grid-cols-2` (it stacks now, G36) |
| G43 | Art image ratios | Figma keeps its Phase 13 crops as an approximation; code shows natural ratio; `artProjects.json` gets **no** `ratio` field |
| G44 | Arrow rule, applied | Arrows stay on "More about me", "Here's what I can offer you", "How this website is built", "Learn about its accessibility", the Service card Default CTA, and **"To main site"**: it leaves the page in a way that's hard to undo, which also earns an arrow. "See what I've done" exists only in the repo (`index.njk`, `collaborate.njk`), not in the redesign, so it goes with the port |
| G45 | Carousel crop | Slides crop to 3:2, the one exception to "natural ratio", so CMS uploads of any shape line up |

### Applied (2026-10-27)

- **Docs:** every component doc, the README and `_tokens.md` updated to G1–G45; no open questions remain. `masonry.md` kept as a "Dropped (G37)" note. Doc-writer calls to check at port: `::scroll-button()` has no wrap-around, so the carousel stops at 6 instead of looping to 1; the G32 h2 class is drafted as `highlight-header`.
- **Figma (WIP + Components board):**
  - Theme glyphs bound to `space/s` and button padding to `space/2xs`. The code's `--space-s-m` is capped at `1rem`, so `space/s` is its effective value (G7).
  - Icon/External and Icon/Arrow-right strokes now `color-accent`. Chevron and Plus stay neutral (G8).
  - `site/figcaption` font size bound to `step/-1` (G12).
  - Page header: new `Show illustration` boolean, off on the 9 instances that had no illustration (Artmaking, 404, **Web design**). The Blurb layer and its two properties are deleted (G16, G17).
  - Quote card's inner-shadow bar bound to `accent-surface` and `space/3xs` (G27).
  - Badges link to Design Declares and Creatives for Climate (G5).
  - New **Card** set `2403:20009` (`Style=Default/Outline/Featured`, padding `space/s-m`, radius `border-radius-s`). The Components board now hugs its content (G34).
  - Project item: no arrow existed, so nothing changed (G19).

### Round 4 (2026-10-27)

| # | Question | Answer |
|---|---|---|
| G46 | Page header heading width | On tablet, `layout/content-width` (330 in Min) is too narrow. The cap becomes the wider of `layout/inline-size` (600) and `layout/content-width`, with no breakpoint. Neither the API nor the UI can bind a text layer's `maxWidth`, so Figma gets a `Layout=Tablet` variant (set `2405:19762`, variant `2405:19759`): the heading is wrapped in an "Introduction cap" frame capped at `layout/inline-size`. All six tablet instances (Work with me, Ideas, Artmaking, 404, Web design, Consultations) use it. Code has no variant, only the `max()` cap. The user also restored the Web design illustration |
| G47 | Carousel ends | No wrap-around. First slide shows only Next, last slide only Previous, the slides between show both |
| G48 | Badge frames | Renamed "Creatives for Climate" (`2293:1553`, `2293:1825`) |
| G49 | Nav marker | Hover and focus underline the link; the current page is underlined and takes `--brand-900`. No bullet, no slide-in (#42). Supersedes G3 |
| G50 | Work with me closing CTA | The featured CTA card "See what other brands left with" is removed, as in Figma (#43). Work with me ends on its own contact CTA |
| G49 | Long-form intro | Case studies and writing posts: the intro (h1 + dimmed line) is centred, and it has as much space above it (`space/2xl-3xl` padding-top) as below it (margin-bottom, same token). Before, the title sat close under the header and far above the image. Code: `.case-study__intro` in `_components.scss`. **Figma (applied):** the local `Intro` frame in the 15 long-form frames (desktop 1512, tablet, mobile; Loft `2319:6594` and the rest) has `paddingTop` and `paddingBottom` bound to `space/2xl-3xl` (101.25 desktop, 60 tablet/mobile), and its text centred. `Main Content` top padding is set to 0, because the intro now supplies the top space. The first `Figure` (or `Paragraph` on Accessibility) after the intro has padding-top 0, because Figma has no margin collapse. Figma ships these as instance and frame overrides, not component changes. Intro is a plain frame, so there is no Code Connect map. Tablet and mobile frames were checked by numbers only, not by screenshot |

- User re-imported `variables-plus-import.json` (62 variables).
