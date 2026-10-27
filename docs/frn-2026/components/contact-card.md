# Contact card

**Layer:** Composite · **Status:** code · **Figma:** `2293:1269` · **Code:** `src/_includes/_footer.njk` (no partial yet), `.card`

## Purpose

One block in the [Footer](footer.md)'s Contact column: a prompt, an optional detail line, and one or more link rows. Four instances sit in each Footer.

## Anatomy

- **Prompt**: text, style `site/heading`, `neutral/950-alpha`. Code: `h3` (G6).
- **Detail** (Action only): text, style `site/body`, hidden when Show detail is off.
- **Action** (Action) or **List** (Links): the rows. Each row is an exposed [Icon link](icon-link.md) instance (F03, Q19), not a loose frame.

The card is a `.card`: `card-bg` fill, `border-radius-s`, padding `space/s-m`.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| Type | Action (default), Links | Variant ID: `2293:1240`, `2293:1268` |
| Prompt | text, default "Send me a good 'ol email" | Both types |
| Detail | text, default "hi at francescoimola dot com" | Action only |
| Show detail | boolean, default true | Action only |

Rows are edited on the nested instances, not as card properties (the six old row props were removed under Q19):

- **Action:** one row, "Action". Defaults to Icon/Copy, "Copy email address". Other cards swap the icon and label.
- **Links:** a **List** with Link 1 to 3, each defaulting to Icon/External: Sublime, Substack, Linkedin.

Footer usage: Send me a good 'ol email (detail shown), Put a face to the name, Not sure what to say? (detail hidden), and Feeling social? (Links).

## Layout

None, fluid only. The card fills its column. Stack gap is `space/3xs` (Action) or `space/2xs` (Links). Height hugs.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Padding, all sides | `space/s-m` | 15 → 25.31 |
| Gap, Action | `space/3xs` | 3.75 → 4.69 |
| Gap, Links and List | `space/2xs` | 7.5 → 8.44 |
| Radius | `border-radius-s` | — |
| Fill | `card-bg` | colour |
| Text size | `step/0` | 15 → 16.88 |

Values from [`_tokens.md`](_tokens.md).

## States & interactions

Only the rows react: see [Icon link](icon-link.md). The card itself is static.

## Content rules

- The email is spelled "hi at … dot com" on the page to dodge scrapers. The real address sits only in `data-copy-email`.
- Detail is shown on the first card only. Hide it elsewhere.
- Links rows: external, so each opens in a new tab with the [External](icon.md) glyph.

## HTML & accessibility

```html
<div class="card flow has-gap-3xs">
  <h3>Send me a good 'ol email</h3>
  <p>hi at francescoimola dot com</p>
  <button type="button" data-copy-email="…" data-icon="copy">Copy email address</button>
  <p role="status" class="sr-only" data-copy-status></p>
</div>
```

- The prompt is an `h3` styled `site/heading`. The Footer's "Contact" title is the `h2` above the cards (G6).
- Links cards: a `<ul>` of links under the prompt.
- The copy button announces success through the status region.

## Port notes

- No partial exists. Today's `_footer.njk` has one flat "Up for a chat?" block plus a nav. Add `_contact-card.njk` with a `contactCard(prompt, detail, rows)` macro, and render four cards from front matter or `_data`.
- The copy action stays a `<button>` (G9). Icon colour is `currentColor` (G8).
- Rows move from `data-icon-before` to trailing `data-icon` (see [Icon link](icon-link.md)).
- **Ported (#24):** `_contact-card.njk` exports `contactCard(prompt, detail)`; the rows are the `{% call %}` body, so the button, link, dialog or `<ul>` stay plain markup in `_footer.njk`. Classes `card contact-card`. **Icons (#57):** every action row has a trailing icon: `copy` on both copy buttons (the dialog's too), `email` on "Copy this template email".

## Open questions

None. Settled in Phase 18 (G6 prompt heading, G8 icon colour, G9 copy button).
