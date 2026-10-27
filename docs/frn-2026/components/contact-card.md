# Contact card

**Layer:** Composite · **Status:** figma · **Figma:** `2293:1269` · **Code:** `src/_includes/_footer.njk` (no partial yet), `.card`

## Purpose

One block in the [Footer](footer.md)'s Contact column: a prompt, an optional detail line, and one or more link rows. Four instances sit in each Footer.

## Anatomy

- **Prompt**: text, style `site/heading`, `neutral/950-alpha`.
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
  <p>Send me a good 'ol email</p>
  <p>hi at francescoimola dot com</p>
  <button type="button" data-copy-email="…" data-icon="copy">Copy email address</button>
  <p role="status" class="sr-only" data-copy-status></p>
</div>
```

- Links cards: a `<ul>` of links under the prompt (use a heading level that fits the Footer outline).
- The copy button announces success through the status region.

## Port notes

- No partial exists. Today's `_footer.njk` has one flat "Up for a chat?" block plus a nav. Add `_contact-card.njk` with a `contactCard(prompt, detail, rows)` macro, and render four cards from front matter or `_data`.
- Rows move from `data-icon-before` to trailing `data-icon` (see [Icon link](icon-link.md)).
- Needs sign-off before a new partial is added (AGENTS.md rule 10 covers JS and tests, not partials, but keep the surface small).

## Open questions

- Colour tokens differ between glyphs: Copy and Phone fill `color-accent`, External and Arrow-right stroke `brand/800`. Same hue, two token families. Which is canonical in code (`currentColor` from the link)?
- Is the Prompt a heading (which level) or a paragraph? Figma styles it `site/heading` only.
