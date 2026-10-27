# FRN-2026 pre-migration audit: findings register

Scope: WIP section `2275:725` + Components board `2291:769` (file `UkQphRf7GwINc1c8vORtUm`). Decisions: `decisions.md` Phase 17.

Status: `open` → `settled` (decided, not yet applied) → `fixed` (applied in Figma) · `code` (left for the port) · `closed` (no action).
Owner: `agent` · `user` (KC Pelletier or by hand) · `figma-ai` (prompt in `figma-ai-prompts.md`) · `code`.

## Round 1

| ID | Finding | Decision | Status | Owner |
|---|---|---|---|---|
| F01 | Tablet long-form text fills 774 px; repo caps at `--inline-size` 600 | `layout/inline-size` 600/600; text blocks Fill + max width bound (Q6). 162 blocks in 10 frames | fixed | agent |
| F02 | CTA card call-first flipped Collaborate's email-first order | CTA card `Order=Call first/Email first`; Collaborate ×3 Email first | fixed | agent |
| F03 | Contact card + Footer use loose link rows, not Icon link | Contact card rows → exposed Icon link instances (Icon link gained `Show icon`); 6 old props deleted; Footer before/after identical | fixed | agent |
| F04 | Split row covers the text half only | Keep; doc covers the whole row; Masonry pattern doc (Q9) | code | code |
| F05 | Art project year "not dimmed" | Already `neutral/900-alpha`; log stale (Q10) | closed | — |
| F06 | Writing item Default 174 px (was 169) | Accept hug height (Q11) | closed | — |
| F07 | Collaborate minimal header isn't a component | Header `Type=Minimal`; Collaborate, Accessibility, 404 use it | fixed | agent |
| F08 | Page header has no instances | P4: 18 Page header instances (6 pages × 3 sizes) | fixed | figma-ai |
| F09 | `Breakpoint=Desktop/Mobile` vs `Layout=Split/Stacked` naming | Header + Footer → `Layout=Wide/Narrow` (Q14) | fixed | agent |

## Found by the sweeps (round 2: Q15–Q31)

| ID | Finding | Pages | Status |
|---|---|---|---|
| F10 | Odd & Wonderful year empty at all breakpoints (repo "2024 – Present") | Artmaking | fixed |
| F11 | Split row = Split on tablet; repo stacks below the `$bp-xl` container fold. Desktop rows stack text above images vs repo 1fr/2fr | Artmaking | code · grid/container query, no viewport breakpoint (Q25) |
| F12 | Tablet/mobile masonry inset `space/xs` from the text edge | Artmaking | fixed |
| F13 | The Loft videos are loose frames, not Figure Type=Video; pairs named "Frame 2/3", not "Media pair" | The Loft | fixed |
| F14 | Intro → first media is `space/xl-2xl`, log says `2xl-3xl` | Long-form | closed (accepted, Q26) |
| F15 | Current-page marker: case studies mark nothing; Narrow header has no nav to mark | Case studies, all tablet/mobile | fixed · Minimal header on Accessibility + 404; case studies mark nothing (Q32) |
| F16 | Gutters: tablet Header `space/m` vs page `space/l`; Footer padding L `s-m` / R `l-xl`; desktop Footer column x 293 vs 306; Home tablet hero `space/m` | All | fixed · Home tablet KC hero width → P2 |
| F17 | Footer site note has two different texts | Home/About/Art vs Work/Ideas/long-form | fixed · new default, 35 overrides set |
| F18 | Home tablet/mobile main spacing `xl / 2xl / 2xl` vs `xl-2xl / 2xl-3xl` everywhere else | Home | fixed |
| F19 | Home "More about me" (tablet/mobile) and Carousel controls use remote-library icon instances, not Icon link / local Icon/* | Home | fixed |
| F20 | Home intro profile photo exists on desktop only | Home | closed · already on T/M; mobile position intentional (Q39) |
| F21 | KC heroes: Home 173.22 / 151.86 / 66.59 (fixed 789 / 346 wide); section heroes 55.17 / 38.39 / 27.40; Work keeps stale max width 982 on tablet/mobile; Ideas spans 1377 on desktop | Home, Work, Ideas | fixed · P1 (styles bound) + P2 (Fill, max width `layout/content-width`) |
| F22 | Hero copy: Ideas reads "Ideas and guides" (log: "Ideas & Guides"); Work "Together ." (stray space) | Ideas, Work | closed · user fixed |
| F23 | Work + Ideas hero illustrations are loose layers, not Illustration/* instances | Work, Ideas | fixed · P4; Artmaking + 404 Page headers have no illustration (repo has none either) |
| F24 | Narrow header: open menu (nav, current marker, Look toggles) not modelled | All tablet/mobile | fixed · `State=Open`, prototype wired |
| F25 | Work testimonials: 5 loose frames named "Figure" with invisible white fill | Work | fixed · Quote card component: Work ×15, Collaborate ×3 |
| F26 | Work tablet collaboration illustration unscaled (449 wide) | Work | fixed · bound to `size/illustration-wide` (Q36) |
| F27 | Label \| content sections built three ways (grid / horizontal / vertical) | About, Work, service pages | fixed · Section heading component (36 + 6 instances); section frames left as built; Section pattern doc defines the one construction (Q37) |
| F28 | Unused text styles `site/hero-display/*` (`site/page-header/hero/Desktop` is used by Page header) | File | fixed · 9 deleted; 3 still used kept |
| F29 | About "Section label" title fixed width | About | closed · already hug |
| F30 | Collaborate header is loose at all 3 sizes: Wide = name + Look toggles (no nav); Narrow = name + detached Menu, no toggles; gutters 15/30; toggles stop short of the right edge | Collaborate | fixed |
| F31 | Collaborate CTA card is call-first at all sizes (user wants email first) | Collaborate | fixed |
| F32 | Collaborate: desktop H1 unstyled raw 19.995; "What I do" cards fixed 153 high; CTA inside Main on desktop, sibling on tablet/mobile; mobile portrait moves into Main | Collaborate | fixed |
| F33 | Service pages: desktop out of sync with tablet/mobile (hero KC copy is Work's placeholder on desktop; "What you get" copy + pills differ); CTA headings are placeholders | Services | fixed · P3 (desktop hero = tablet copy; Web design CTA "Let's talk about your website") |
| F34 | Service pages: FAQ section headings are plain text, not the highlighted pill (6) | Services | fixed |
| F35 | Consultations tablet: one list fixed 380 wide; CTA heading 774 wide vs 330 elsewhere | Services | fixed · P2 |
| F36 | CTA card + Page header KC text use the Desktop style (55.17) at every size | Collaborate, Services | fixed · P1; P5 merged styles to `site/hero`, `site/homepage/hero`, `site/cta/heading` |
| F37 | Nav link Hover variant's Label isn't bound to the Label property | Components | fixed |
| F38 | Writing item Expanded: raw 24 item spacing; variant description copy-pasted from Default (says span 3/5, is 2/6) | Components | fixed |
| F39 | Service card: Accordion summary raw 392 gap; Accordion CTA uses the external glyph; Default CTA arrow is loose vectors; Writing item source icon loose | Components | fixed |
| F40 | Outside-the-board dependencies: Narrow Menu "+ Icon" lives in the Exploration capture; Footer art is page-level "Illustration" 2246:1280; Carousel controls bind a remote library (`Space/XS`, `Icon/Large`) + remote arrow | Components | fixed · Icon/Plus, Illustration/footer (main was orphaned), Carousel local |
| F41 | Hidden leftovers: "STICKER 2 1" image in both Footer variants; empty "Placeholder for Italic Text" in Header Narrow; 5 hidden Nav links in Collaborate's loose header | Components, Collaborate | fixed |
| F42 | FAQ Open and Figure Type=Video variants are never used; Illustration/* has 0 instances | Components | closed (kept, Q30) |
| F43 | Footer Narrow colophon order Copyright → Site note → Badges vs Wide Site note → Badges → Copyright | Footer | fixed |
| F44 | Look toggles theme switch stays 86 in Min mode (page-colour swatches scale) | Look toggles | fixed · theme switch hugs (51 Max) |
| F45 | Component descriptions store literal HTML entities (`&lt;`, `&quot;`) | Components | fixed · descriptions rewritten with curly quotes and no angle brackets (the plugin API re-escapes `" < > '`); every component links to its doc |
| F46 | Writing type pages: Back link vertical on mobile | Type pages | closed |

## User's list

-

## Figma AI list

All done (2026-10-27): P1, P3, P4 by Figma AI; P2 by hand; P5 by the agent (style reassignment didn't need the font). Verified in Figma: no size, line-height or width changed. Note: P1 set the `site/hero` and `site/cta/heading` line height to Auto.
