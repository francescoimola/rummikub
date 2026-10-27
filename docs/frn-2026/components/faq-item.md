# FAQ item

**Layer:** Composite · **Status:** figma · **Figma:** `2353:18925` · **Code:** `<details>` on About and service pages (no partial yet)

## Purpose

One question and its answer as a disclosure. Used in "Infrequently asked questions" on About and in the FAQ section of both service pages.

## Anatomy

- **Summary**: **Question** (`site/body`, `neutral/950-alpha`) and the **Expand** glyph, "+" when Closed and "−" when Open. Code: `summary`; the glyph is drawn by cleacss/our CSS.
- **Answer** (Open only): `site/body`, one or more paragraphs. Code: `p` elements inside `<details>`.
- The `<hr>` between items is a sibling, not part of the component.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| State | Closed `2353:18917`, Open `2353:18923` | |
| Question | text | |
| Answer | text | Paragraphs separated by blank lines |

- Every instance in Figma is Closed (42 of them). Open is kept for reference (F42, Q30).
- The Expand glyph is a text character in Figma. In code it is CSS, not a typed character.

## Layout

None, fluid only. The item fills its column.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Question ↔ answer (Open) | `space/xs` | 11.25 → 13.13 |
| Padding below (Open) | `space/s` | 15 → 16.88 |
| Text size | `step/0` | 15 → 16.88 |
| Radius | `border-radius` | style value |

Values from [`_tokens.md`](_tokens.md). The radius is bound but there is no fill or stroke, so it has no visible effect.

## States & interactions

- Click on the summary toggles Closed ↔ Open. The global `details::details-content` reveal runs over `--dur-medium` with `--ease`; reduced motion makes it instant.
- Hover and focus on the summary change its colour to `--accent-hover` (`summary` rule in `index.scss`); pressed dims it (`--opacity-active`).
- The invisible hit-area (`:is(button, summary)::before`) extends the tap target.
- Focus uses the global ring. No keyboard handling beyond native Enter / Space.

## Content rules

- Copy is authored in the page's HTML, word for word (`about.njk`, `studio/design.njk`, `studio/consultations.njk`).
- Answers can hold links; external ones follow the README rule.
- An item with no answer is not valid.

## HTML & accessibility

```html
<div class="flow has-gap-s">
  <details>
    <summary>How do you think about design?</summary>
    <p>…</p>
  </details>
  <hr>
</div>
```

- Native `<details>` / `<summary>` provides the role and the expanded state.
- Do not add `aria-expanded`. Do not use `name=` grouping unless exclusive opening is wanted; none is designed.

## Port notes

- Today the markup is hand-written per page. A `faqItem(question, answer)` macro would remove the repeats, but only if it saves more than it costs (AGENTS.md rule 10 favours deleting).
- `about.njk` has an unclosed `<p>` in the third answer; fix when touched.
- Figma's Open frame is the reference for the open spacing.

## Open questions

- Add a macro, or keep the hand-written `<details>`?
- Should opening one close the others? Not designed; default no.
