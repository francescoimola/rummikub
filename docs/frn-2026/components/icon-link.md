# Icon link

**Layer:** Primitive · **Status:** figma · **Figma:** `2352:18813` · **Code:** `a[data-icon]` / `a[data-icon-before]` in `src/css/_icons.scss`

## Purpose

A text link with a trailing glyph. It is the one link-with-icon in the system: external links, "more" links, and the call and copy actions. Used by [CTA card](cta-card.md), [Contact card](contact-card.md), [Split row](split-row.md) and About ("More about me").

## Anatomy

- **Label**: text, style `site/link`, fill `color-accent`.
- **Icon**: an [Icon/*](icon.md) instance, `step/0` square, exposed through the Icon swap. Trailing.

Code: `<a data-icon="name">Label</a>`. The glyph is `::after`.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| Label | text, default "Book free intro call" | The inner layer name keeps this default in every instance (cosmetic) |
| Icon | instance swap, default `Icon/Phone` (`2293:1224`) | Any Icon/*. No preferred values are set |
| Show icon | boolean, default true | Hides the glyph (a plain accent link) |

No variants. No Hover or Focus state is drawn.

## Layout

None, fluid only. The row hugs: label, then icon after `space/2xs`.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Label ↔ icon gap | `space/2xs` | 7.5 → 8.44 |
| Label size | `step/0` | 15 → 16.88 |
| Icon size | `step/0` | 15 → 16.88 |
| Label colour | `color-accent` | colour |

Values from [`_tokens.md`](_tokens.md). Repo: the gap is `--icon-gap` (default `--space-2xs`); `arrow-ext` uses `--space-4xs`.

## States & interactions

- **Hover and focus (code):** `--icon-gap` grows to `--space-xs`, so the glyph nudges away, over `--dur-fast`. This is in `_icons.scss` and Figma doesn't draw it. Reduced motion: no movement.
- Focus uses the global ring.

## Content rules

- Pick the glyph by meaning: [External](icon.md) for links that open a new tab, [Arrow-right](icon.md) for internal "more", [Phone](icon.md) for call, [Copy](icon.md) for copy to clipboard.
- External links need `target="_blank" rel="noopener noreferrer"`.
- Labels are short, sentence case.

## HTML & accessibility

```html
<a href="https://cal.com/…" data-icon="phone" target="_blank" rel="noopener noreferrer">Book free intro call</a>
<button type="button" data-copy-email="…" data-icon="copy">Copy email address</button>
```

- The glyph is a CSS mask with no text, so the name is the label alone.
- The copy action is a `<button>`, not a link. It keeps the same look.
- Copy feedback goes to a `role="status"` live region (as in today's footer).

## Port notes

- Today the leading form `data-icon-before` is used in the footer (`copy`, `phone`). The redesign puts every glyph after the label: switch to `data-icon`.
- Figma has no Hover state; the gap nudge already exists in `_icons.scss`.

## Open questions

- Should the copy action stay a `<button>` styled as an Icon link, or become a link to a `mailto:`? Figma treats it as the same component.
