# <Component name>

**Layer:** Primitive | Composite | Section · **Status:** planned | figma | code · **Figma:** `<node id>` · **Code:** `src/_includes/_<name>.njk`, `.<name>`

## Purpose

One or two sentences: what it is for, and where it is used.

## Anatomy

Its named parts, in reading order, with the Figma layer name and the matching HTML element or CSS part (`.<name>__<part>`).

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| | | |

## Layout

What changes between the Wide/Split and Narrow/Stacked forms, and what drives it in code (a container query, an intrinsic grid, or a `_responsive.scss` block). Write "None, fluid only" if nothing does.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| | | |

Values from [`_tokens.md`](_tokens.md). Min = the 390/834 frames, Max = the 1512 frames.

## States & interactions

Each state: what changes, the trigger, the timing (see Cross-cutting behaviour in the README), and what happens under reduced motion.

## Content rules

Where the content comes from (frontmatter, `_data/*.json`, macro arguments), length limits, and what happens when a field is empty.

## HTML & accessibility

The element and semantics, ARIA, keyboard behaviour, and focus order. A short markup sketch.

## Port notes

What the redesign changes compared with today's repo file. Delete this section once the doc reaches `code`.

## Open questions

-
