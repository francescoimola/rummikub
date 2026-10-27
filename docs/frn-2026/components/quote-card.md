# Quote card

**Layer:** Composite · **Status:** code · **Figma:** `2380:19851` · **Code:** `src/studio.njk`, `src/collaborate.njk` `<figure class="card outline"><blockquote>`; `.card:has(blockquote)` in `_components.scss`

## Purpose

A client testimonial: the quote and who said it. Used 15 times on Work with me (5 per frame) and 3 on Collaborate (one testimonial, once per breakpoint: Q38). It replaces the loose frames that were wrongly named "Figure" (F25, Q29).

## Anatomy

- **Card**: outlined, vertical, transparent fill, with an accent bar on the left edge (G27).
- **Quote** (text): the quote in dimmed body text, `<blockquote>`.
- **Attribution** (text): name, then role and company on a second line, `<figcaption>`. The company can be a link.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| Quote | text | Includes the curly quotes |
| Attribution | text | Two lines, name then role |

No variants. Width is set by the parent (Fill).

## Layout

None, fluid only. It fills its column and grows with the text. Stacked quote cards sit in a `flow` with `space/xs` gaps in the repo.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Padding | `space/s-m` | 15 → 25.31 |
| Gap quote ↔ attribution | `space/s` | 15 → 16.88 |
| Radius | `border-radius-s` | (see repo) |
| Border width / colour | `input-border-width` / `neutral/400-alpha` | n/a |
| Quote text | `neutral/900-alpha`, `step/0`, `letter-spacing/m` | 15 → 16.88 |
| Attribution | `neutral/950-alpha` in the repo (`blockquote+figcaption`) | n/a |

Values from [`_tokens.md`](_tokens.md).

## States & interactions

None on the card. The company link inside the attribution uses the global link styles and ring. No motion.

## Content rules

- Source: `src/_data/testimonials.json` (`studio`, `collaborate`; editable in Pages CMS), passed to the `quoteCard` macro (G28). Work with me has 5 quotes, Collaborate has 1.
- Keep quotes as the client wrote them, with `[...]` for cuts.
- The company link is optional (Liv Pennington and Carly Anchal have none).
- Collaborate's repo quote has no curly quotes and no `<p>`; Work with me's has both. Figma uses curly quotes.

## HTML & accessibility

```html
<figure class="card outline flow has-gap-s">
  <blockquote><p>“I have never worked with someone so deeply reliable…”</p></blockquote>
  <figcaption>Cairo Woodward<br>Co-founder, <a href="…" target="_blank" rel="noopener noreferrer">The Loft</a></figcaption>
</figure>
```

- `figure` + `blockquote` + `figcaption` is the correct pairing for an attributed quote.
- External company links follow the cross-cutting rule (README: Icon/External).

## Port notes

- The accent bar `.card:has(blockquote) { box-shadow: inset var(--space-3xs) 0 var(--accent-surface) }` stays, and is drawn in Figma (G27). Add a left bar to the Quote card in Figma.
- Repo cards use `border-radius-s`; Figma matches.
- Add a `quoteCard` macro (e.g. `quoteCard(quote, name, role, link)`) so the markup has one source (G28). The copy lives in `testimonials.json` (moved out of the templates so it is CMS-editable).
- `.case-study>blockquote` (long-form posts) is a separate rule that `@extend`s `.card` and `.outline`. Leave it.
- **Ported (#29):** `_quote-card.njk` exports `quoteCard(quote, name, role, link)`. `link` is `{ url, label }`: with a label it renders "role, <company link>"; without one the name links (Sarah Brown). Links carry `data-icon="arrow-ext"` and open in a new tab. Work with me (5) and Collaborate (1) use it; Collaborate's quote now has curly quotes and a `<p>` like the rest. Repo copy kept where Figma differs (Carly Anchal's role, Sarah Brown's link).

## Open questions

None. Settled in Phase 18 (G27, G28).
