# Breadcrumb

**Layer:** Composite · **Status:** figma · **Figma:** `2353:19355` · **Code:** `src/_includes/_breadcrumb.njk`

## Purpose

Shows where a writing page sits: a dimmed parent link, a chevron, then the current page. It appears on the three writing type pages (Guides, Essays, Notes) at each frame size, 9 instances in total.

## Anatomy

- **Parent**: link text, style `site/small`, `neutral/900-alpha`.
- **Icon/Chevron-right**: [Icon](icon.md) instance, the separator.
- **Current**: text, style `site/small`, `neutral/950-alpha`.

Code: `<ul class="small flow-row has-gap-2xs">` with an `<li>` per crumb and a separator `<li>`.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| Parent | text, default "Ideas & guides" | The link |
| Current | text, default "Essays" | The page title |

No variants. Two levels only.

## Layout

None, fluid only. One row, hug width. Gap `space/2xs`.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Gap | `space/2xs` | 7.5 → 8.44 |
| Text size | `type/small` | 12.5 → 14.06 |
| Chevron size | `step/0` | 15 → 16.88 |
| Parent and chevron colour | `neutral/900-alpha` | colour |
| Current colour | `neutral/950-alpha` | colour |

Values from [`_tokens.md`](_tokens.md).

## States & interactions

- The parent is a link with the global link hover and focus ring. Current is plain text.
- No motion.

## Content rules

- Built from the Eleventy navigation tree (`eleventyNavigationBreadcrumb`, `includeSelf`). The home crumb is skipped.
- Labels are capitalised by the template (`capitalize`). Figma shows "Ideas & guides" with sentence case: see Open questions.

## HTML & accessibility

```html
<nav aria-label="Breadcrumb">
  <ol class="small flow-row has-gap-2xs">
    <li><a href="/writing/" class="dimmed">Ideas &amp; guides</a></li>
    <li aria-hidden="true"><span data-icon-before="chevron-right"></span></li>
    <li aria-current="page">Essays</li>
  </ol>
</nav>
```

- Today's partial is a bare `<ul>` with no `<nav>`. Wrap it in `<nav aria-label="Breadcrumb">` and use `<ol>`.
- The separator is decorative: hide it from assistive tech.

## Port notes

- `_breadcrumb.njk`: add the `<nav>` wrapper and `<ol>`, hide the separator.
- Drop `capitalize` so the labels read as authored (sentence case).
- Separator stays `data-icon-before="chevron-right"`; `_icons.scss` already zeroes the gap for an empty glyph.

## Open questions

- Is the parent label "Ideas & guides" (Figma, repo) or "Ideas" like the header nav? See the Header's open question.
