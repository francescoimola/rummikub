# FAQ item

**Layer:** Composite · **Status:** figma · **Figma:** `2353:18925` · **Code:** `faqList(items)` macro over `src/_data/faqs.json`, `<details>`

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

- Copy lives in `src/_data/faqs.json` (G26), one list per page: `about`, `design`, `consultations`. Each item has `question` and `answer`.
- `answer` is Markdown, a CMS `text` field. The file is **editable in Pages CMS**, with a `.pages.yml` entry like `artProjects`.
- The `faqList(items)` macro renders the `<details>` list, so the pages stop hand-writing them.
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
- Do not add `aria-expanded`. No `name=` grouping: each item opens independently (G26).

## Port notes

- Add `src/_data/faqs.json` (`about`, `design`, `consultations`) and the `.pages.yml` entry (G26).
- Add a `faqList(items)` macro (a partial, no JS) and use it in `about.njk`, `studio/design.njk` and `studio/consultations.njk`.
- The unclosed `<p>` in the third About answer goes with the hand-written markup.
- Figma's Open frame is the reference for the open spacing.

## Open questions

None. Settled in Phase 18 (G26).
