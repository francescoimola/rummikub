# Illustration

**Layer:** Primitive · **Status:** code · **Figma:** `2357:19402`, `2357:19404`, `2357:19426`, `2357:19428`, `2381:19752` · **Code:** `src/assets/icons/*.svg`, `{% icon "<name>" %}` shortcode

## Purpose

The drawings. Four **hero** illustrations sit above the heading in [Page header](page-header.md). One **footer** drawing sits in the [Footer](footer.md). One doc covers all five.

## Anatomy

| Figma | ID | Repo file | Size | Used on |
| --- | --- | --- | --- | --- |
| Illustration/runner | `2357:19402` | none (new) | 267 × 220 | Work with me |
| Illustration/meditating | `2357:19404` | `meditating.svg` | 249.1 × 220 | Ideas |
| Illustration/deskgarden | `2357:19426` | `deskgarden.svg` | 256.8 × 220 | Web design service (default of Page header) |
| Illustration/websitevisit | `2357:19428` | `websitevisit.svg` | 192.8 × 220 | Website consultations |
| Illustration/footer | `2381:19752` | none | 986.9 × 569.4 | Footer, 53 instances |

- Hero drawings are one vector (meditating: a frame of 19 paths) filled `neutral/950-alpha`.
- Footer is four vectors filled `brand/900`. In code it is an inline SVG with `fill="currentColor"`, coloured by the footer CSS (G10). It was rebuilt on the board from the orphaned page-level "Illustration" main.
- Repo files not in Figma: `bathcomputer` (Work with me) and `mailstorm` (the footer). `graphdrawing`, `rainy` and `stuckin` were unused and deleted (#52).

## Props & variants

None. A hero is chosen through the Illustration swap on Page header. Instances today: runner 3, meditating 3, deskgarden 4, websitevisit 3.

## Layout

None, fluid only.

- **Hero:** height is bound to `size/hero-illustration` and the aspect ratio is locked, so the width follows (Q21). In code this is `block-size` with `inline-size: auto`. The padding hack in `_page-header.njk` goes.
- **Wide Work illustration:** three `Icon` frames inside `Icon:margin` (nodes `2275:1904` at 449, `2305:4188` and `2305:4955` at 345) are bound to `size/illustration-wide` (Q36). That token is a width. These are the page illustrations that aren't heroes.
- **Footer:** fills its column. In Wide the instance is 986.9 wide inside a 478.7 frame (it overflows). In Narrow it fills the width in flow.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Hero height | `size/hero-illustration` | 154 → 220 |
| Wide illustration width | `size/illustration-wide` | 345 → 449.28 |
| Hero fill | `neutral/950-alpha` | colour |
| Footer fill | `brand/900` | colour |

Values from [`_tokens.md`](_tokens.md).

## States & interactions

- Static. Hero inside Page header uses `settle` on scroll (README, Cross-cutting behaviour). Footer: none.
- Fills use theme tokens, so colour follows light/dark and the page colour.

## Content rules

- Hero pairing is by page: see the table. A new page needs a new drawing or a reused one.
- The drawing is decorative: empty alt, never conveys information.

## HTML & accessibility

```html
<svg aria-hidden="true" focusable="false" viewBox="0 0 1104 946">…</svg>
```

- The `icon` shortcode inlines the SVG file. Keep `fill="currentColor"` so it follows the theme.
- If used as `<img>`, `alt=""`.

## Port notes

- Add `runner.svg` and a footer SVG to `src/assets/icons/`. Hero SVGs should export from Figma without a fixed width and height.
- **Ported (#24, #27):** `runner.svg` added (exported from `2357:19402`, 52 paths, `currentColor`). The footer drawing is the existing `mailstorm.svg`. Hero sizing lives in `.page-header svg`; the padding hack is gone.
- **Ported (#35):** node `2275:1904` is the existing `bathcomputer.svg`. Wide illustrations take `{% icon "name", 'class="illustration-wide"' %}`; `main svg.illustration-wide` sets the width from `--size-illustration-wide`, capped at 100%, with no padding.
- Existing `{% icon iconName %}` stays. `_page-header.njk` sets the height from `--size-hero-illustration` (new fluid token, 154 → 220).
- The old footer markup has no illustration. The new one inlines the SVG (not `<img>`, which can't follow the theme) with `currentColor` (G10).
- Hero illustrations keep `currentColor` too (G10).

## Open questions

None. Settled in Phase 18 (G10).
