# Ordered list

**Layer:** Composite · **Status:** planned · **Figma:** (pattern) examples `2349:17050` (Web design), `2350:17422` (Consultations), `2350:17760` (Web design, tablet), `2350:18549` (mobile) · **Code:** `<ol class="flow">` inside `section.text`

## Purpose

A numbered list of steps or inclusions: "Always included" on Web design, "Things we can cover" and similar on Consultations. 27 rows in all (Web design 15, Consultations 12).

## Anatomy

- **Ordered list** (vertical): the rows.
- **List item** (horizontal): **Marker** ("1.") then the item text.
- **Item text**: a bold title, a line break, a dimmed description (mixed-style text).

## Props & variants

None. Number of rows is free.

## Layout

None, fluid only. The marker hugs (about 10 to 14 wide) and the text fills. Lines wrap inside the text.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Row gap (both service pages) | `space/s` (G35) | 15 → 16.88 |
| Marker ↔ text (Figma only) | `space/xs` | 11.25 → 13.13 |
| Marker, title | `neutral/950-alpha`, `step/0` | 15 → 16.88 |
| Description | `neutral/900-alpha` | n/a |

Values from [`_tokens.md`](_tokens.md).

## States & interactions

None.

## Content rules

- Title in bold, description dimmed on the next line. The description is optional.
- Figma types the markers by hand ("1."), because separate Figma text nodes cannot continue numbering (Phase 15). In code the browser numbers them.

## HTML & accessibility

```html
<ol class="flow has-gap-s">
  <li><strong>Research</strong><span class="dimmed"><br>Tailored to your project…</span></li>
</ol>
```

- A real `ol`, so the count is announced. Do not draw the marker in CSS unless it also keeps list semantics (`list-style: decimal` or `::marker`).
- `:where(.text ol, .text ul)` sets `padding-inline-start: var(--space-s)`.

## Port notes

- Already in the repo (`design.njk`, `consultations.njk`). The browser `::marker` stays (G35). Figma's marker ↔ text gap `space/xs` is a snapshot, since a marker cannot take a `gap`.
- One row gap, `has-gap-s`, on both pages (G35). Change Consultations from `has-gap-m`, and the Figma Consultations list to `space/s`.
- Bulleted lists use native bullets in Figma and the repo; no change.

## Open questions

None. Settled in Phase 18 (G35).
