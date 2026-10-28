# CTA card

**Layer:** Section · **Status:** code · **Figma:** `2378:20633` · **Code:** `src/_includes/_cta-card.njk`, `.card.giant.featured`

## Purpose

The closing call to action on Collaborate and both service pages: a large tinted card with a heading, a short body, a book-a-call link and a copy-email link.

## Anatomy

- **Card Heading**: width capped at `layout/content-width`, holds the heading in KC Pelletier Sans, style `site/cta/heading`. Code: `h2` on every page (G18).
- **Body**: `site/body`, width capped at `layout/inline-size`. Code: `p`.
- **Actions**: two [Icon link](icon-link.md) instances, stacked.
  - **Call link**: [Icon/Phone](icon.md), "Book free intro call". Code: `a[data-icon="phone"]`, new tab.
  - **Email link**: [Icon/Copy](icon.md), "Copy email address". Code: `button[data-copy-email][data-icon="copy"]`, with a `role="status"` live region.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| Order | Call first `2355:19680`, Email first `2378:20619` | Only the order of the two links differs (Q7, Q18) |
| Heading | text | Default "I don't bite" |
| Body | text | |

- Collaborate uses Email first (the audience emails more than it books calls). Service pages use Call first.
- Link labels are properties of the nested Icon links.

## Layout

None, fluid only. The card is full width, centred, with the heading and body held to their max widths. In code `.giant` caps its children at `calc(var(--inline-size) - 2 * var(--pad))` so the text holds still at content width while the card spans full width.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Card padding block | `space/3xl-4xl` | 90 → 135 |
| Card padding inline | `space/l-xl` | 30 → 50.63 |
| Gap between parts | `space/m` | 22.5 → 25.31 |
| Heading padding below | `space/xs` | 11.25 → 13.13 |
| Heading size | `step/2-4` | 26.65 → 53.28 (Q20) |
| Heading max width | `layout/content-width` | 330 → 900 |
| Body max width | `layout/inline-size` | 600 → 600 |
| Actions gap / padding top | `space/xs` / `space/2xs` | 11.25 → 13.13 / 7.5 → 8.44 |
| Card fill | `brand/150` | light-dark |
| Card radius | `border-radius` | style value |

Values from [`_tokens.md`](_tokens.md). The heading uses style `site/cta/heading`, bound to `step/2-4`; one style serves all three frames (F36, Q35).

## States & interactions

- Links: see [Icon link](icon-link.md) (hover, nudge).
- Copy email: a click copies the address and announces it through the `role="status"` region (`mailto-copy.js`).
- No scroll animation: `breakout` was removed (#71).

## Content rules

- Heading and body are macro arguments. Service headings: Web design "Let's talk about your website"; Consultations "Book a website consultation and get sound expert advice" (Q34); Collaborate "I don't bite".
- Empty body: omit the `<p>`.
- The heading is always an `h2`, whatever the page outline (G18).

## HTML & accessibility

```html
<section class="card giant featured flow has-gap-xs pretty">
  <h2>I don't bite</h2><p>…</p>
  <div class="flow has-gap-xs has-pt-2xs">
    <button type="button" data-copy-email="…" data-icon="copy">Copy email address</button>
    <a data-icon="phone" href="…" target="_blank" rel="noopener noreferrer">Book free intro call</a>
    <p role="status" class="sr-only" data-copy-status></p>
  </div>
</section>
```

- The visual order and the DOM order match, so the first link in the DOM is the first on screen.
- `.featured` darkens the accent for AA contrast on the tinted card.

## Port notes

- `ctaCard` gains an `emailFirst` param (default false) that swaps the two links (Q18). Collaborate passes `emailFirst = true`.
- The heading uses KC Pelletier Sans at `--step-2-4`, a new pair token (`_tokens.md`). Today `.giant h2` has no KC face.
- Card padding block stays the repo's `--space-xl-4xl` (`.giant`); Figma's `space/3xl-4xl` is a snapshot drift (repo wins).
- **Ported (#28):** `ctaCard(heading, body, …, emailFirst = false)` builds both links once and emits them in the chosen order. Collaborate passes `emailFirst = true`. An empty body drops the `<p>`. `.card.cta-card>h2` sets KC Pelletier at `--step-2-4`, capped at content width, `--space-xs` below. Consultations' heading is now "Book a website consultation and get sound expert advice" (Q34); Work with me keeps its own heading until its page ticket.

## Open questions

None. Settled in Phase 18 (G18).
