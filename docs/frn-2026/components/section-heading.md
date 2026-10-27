# Section heading

**Layer:** Primitive · **Status:** figma · **Figma:** `2380:19847` · **Code:** `src/css/index.scss` `[highlight-header]>h2:first-child` today, `h2.highlight-header` after the port

## Purpose

The `h2` that opens a [Section](section.md). **Highlighted** is an accent pill, used on Work with me, the service pages and Collaborate. **Plain** is bare text, used where a section label sits without emphasis (About's "About", Ideas section titles). Q29 asked for an easy switch between the two.

## Anatomy

- **Heading** (text, `site/body` size): the section title. One text layer in both variants.
- **Highlighted** wraps it in a hugging pill (`accent-surface`, rounded). **Plain** is the text alone.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| Style | Highlighted (default), Plain | Highlighted `2380:19844`, Plain `2380:19845` |
| Heading | text | Default "What you get" |

- Instances: 36 on Work with me and the service pages, plus 6 on the service FAQ headings (F27, F34: FAQ headings are now the pill too).

## Layout

None, fluid only. The pill hugs its text. Its column position comes from [Section](section.md).

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Pill padding inline | `space/xs` | 11.25 → 13.13 |
| Pill padding block | `space/3xs-2xs` | 3.75 → 8.44 |
| Pill radius | `border-radius-s` | (see repo) |
| Pill fill | `accent-surface` | follows `--brand-hue` |
| Text fill | `neutral/950-alpha` | n/a |
| Font size | `step/0` | 15 → 16.88 |
| Line height | `line-height/body` | 22.5 → 25.31 |
| Letter spacing | `letter-spacing/xl` | n/a |

Values from [`_tokens.md`](_tokens.md).

## States & interactions

None. It is not interactive and has no hover. The pill colour follows the page brand colour, and dark mode through `light-dark()` (README, Theme).

## Content rules

- Sentence case, short. It is the section's title, not a sentence.
- Highlighted vs Plain is a per-section editorial choice. The flag is a class on the `h2` (G32, see below).

## HTML & accessibility

```html
<section>
  <h2 class="highlight-header">What you get</h2>
  …
</section>
```

- A real `h2` inside a `section`. Plain simply omits the `highlight-header` class. A heading can switch without touching its parent (G32).
- The pill is decoration only. Contrast is the page's `accent-surface` against `neutral/950-alpha` text, as today.

## Port notes

- Today's rule, `[highlight-header]>h2:first-child` in `src/css/index.scss`, already has the right look (same padding tokens, `--border-radius-s`, `--accent-surface`). Re-key it to `h2.highlight-header` (G32) and move the attribute from each `<section>` onto its `h2`.
- Plain is the absence of the class, so nothing else is needed. Add `highlight-header` to the FAQ headings that lack it on the service pages (F34).
- Figma pads the pill with `space/3xs-2xs`, the repo with `--space-3xs-2xs`. They agree.

## Open questions

None. Settled in Phase 18 (G32).
