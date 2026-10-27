# Quote card

**Layer:** Composite · **Status:** figma · **Figma:** `2380:19851` · **Code:** `src/studio.njk`, `src/collaborate.njk` `<figure class="card outline"><blockquote>`; `.card:has(blockquote)` in `_components.scss`

## Purpose

A client testimonial: the quote and who said it. Used 15 times on Work with me (5 per frame) and 3 on Collaborate (one testimonial, once per breakpoint: Q38). It replaces the loose frames that were wrongly named "Figure" (F25, Q29).

## Anatomy

- **Card**: outlined, vertical, transparent fill.
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

- Source today: inline in the page. There is no data file. Work with me has 5 quotes, Collaborate has 1.
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

- Repo wins on existing values: the accent bar `.card:has(blockquote) { box-shadow: inset var(--space-3xs) 0 var(--accent-surface) }` is in the repo but is **not drawn in Figma**. See Open questions.
- Repo cards use `border-radius-s`; Figma matches.
- Wrap the markup in a macro (e.g. `quoteCard(quote, name, role, link)`) so the 6 pages' copies share one source. Not done yet.
- `.case-study>blockquote` (long-form posts) is a separate rule that `@extend`s `.card` and `.outline`. Leave it.

## Open questions

- Should the left accent bar (`box-shadow: inset … var(--accent-surface)`) be drawn in Figma, or dropped from the repo?
- Do we want a `quoteCard` macro and a `testimonials.json`, or keep the copy in each page?
