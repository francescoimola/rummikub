# Pricing item

**Layer:** Composite · **Status:** code · **Figma:** `2380:19857` · **Code:** `src/studio/design.njk` `<ul class="pricing-list"><li>`, `.pricing-list` in `_components.scss`

## Purpose

One row of a price list: what it is, an optional note and the price. Used 4 times per frame on Web design (12 in all). Consultations has no list: its price stays a bold paragraph (`£225`, G29).

## Anatomy

- **Row** (horizontal): text column on the left, price on the right, bottom rule.
- **Text** (vertical): **Title**, then **Note** (dimmed, optional).
- **Price** (text): dimmed, `from £2,500`, on one line.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| Title | text | e.g. "Website with CMS" |
| Note | text | e.g. "Ideal if you publish often." The third row's note holds a link |
| Price | text | Includes "from" and the currency |
| Show note | boolean (true) | Hides the Note |

## Layout

None, fluid only. The text column fills, the price hugs and does not wrap. Long notes wrap inside the text column.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Gap text ↔ price | `space/m` | 22.5 → 25.31 |
| Padding below | `space/m` | 22.5 → 25.31 |
| Gap title ↔ note | `space/3xs` | 3.75 → 4.69 |
| Bottom rule | `input-border-width` / `input-border-color` | n/a |
| Title | `neutral/950-alpha`, `step/0` | 15 → 16.88 |
| Note, price | `neutral/900-alpha`, `step/0` | 15 → 16.88 |

Values from [`_tokens.md`](_tokens.md). The list gap (`space/m`) and the intro → list gap (`space/xl`) are set by the parent.

## States & interactions

None. Only the link in a note is interactive (global link hover and ring).

## Content rules

- Source today: inline in `design.njk`. Prices are "from £…" because every price is a starting point; the small line under the list says so.
- Currency is £ with a thousands comma.
- A note is optional: use Show note off when empty.

## HTML & accessibility

```html
<ul class="flow has-gap-m pricing-list">
  <li class="flow-row has-gap-m has-items-start has-pb-m">
    <div class="flow has-gap-3xs has-flex-1"><p>Website with CMS</p><p class="dimmed">Ideal if you publish often.</p></div>
    <p class="dimmed">from £2,500</p>
  </li>
</ul>
```

- A `ul` of `li`. A screen reader reads title, note, price in order, which is enough.

## Port notes

- The repo already has this: `.pricing-list>li` (bottom rule) and `.pricing-list>li>p` (`white-space: nowrap` for the price), plus utility classes. Figma matches them. The decision log (Phase 15) called it "new", but it exists in `src/css/_components.scss`.
- No macro: the `<li>` stays inline in `.pricing-list` (G30).
- Consultations' `£225` stays a bold paragraph, not a Pricing item (G29).
- **Ported (#36):** the list sits in a stacked Section (`section--stacked`) on Web design, as in the tablet frame.

## Open questions

None. Settled in Phase 18 (G29, G30).
