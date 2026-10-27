# Service card

**Layer:** Composite · **Status:** figma · **Figma:** `2292:1547` · **Code:** `src/_includes/_service-card.njk`, `.card.link-card`

## Purpose

An offer on Work with me. **Default** links to a service page. **Accordion** is a compact card that opens to a description and one action.

## Anatomy

**Default** (`a.card.flow.link-card`):

- **Heading**: **Number** (`site/body`, `neutral/900-alpha`) + **Title** (`site/heading-sm`). Code: `h3`; the number comes from CSS (`.has-counter`).
- **Description**: `site/body`. Code: `p`.
- **CTA**: label (`site/link`, `color-accent`) + [Icon/Arrow-right](icon.md) instance. Code: `span[data-icon="arrow-right"]`.

**Accordion** (`details.card.link-card`):

- **Summary**: Title (`site/body`) + **Expand** glyph "+". Code: `summary > h3`.
- **Panel** (shown when `Open`): Description, then the CTA with Icon/Arrow-right. Code: `div.flow` inside `<details>`.

## Props & variants

| Property | Values | Notes |
| --- | --- | --- |
| Type | Default `2292:1534`, Accordion `2292:1546` | |
| Title | text | |
| Description | text | |
| CTA label | text | "Learn more" in Default; "Enquire" or "See the offer" in Accordion |
| Number | text, "01" | Default only |
| Open | boolean, false | Accordion only; shows the Panel |

The repo also has `type="adhoc"` (a link card ending in an email action). Figma has no variant for it.

## Layout

None, fluid only. Cards fill their grid cell. The pages place them in a grid that folds by container query.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Card padding | `space/s-m` | 15 → 25.31 |
| Default gap | `space/xs` | 11.25 → 13.13 |
| Number ↔ title | `space/2xs` | 7.5 → 8.44 |
| Summary gap (minimum) | `space/xs` | 11.25 → 13.13 |
| Panel gap | `space/s` | 15 → 16.88 |
| Panel padding top / bottom | `space/m` / `space/xs` | 22.5 → 25.31 / 11.25 → 13.13 |
| CTA icon gap | `space/2xs` | 7.5 → 8.44 |
| CTA icon size | `step/0` | 15 → 16.88 |
| Card fill, radius | `card-bg`, `border-radius-s` | style values |

Values from [`_tokens.md`](_tokens.md).

## States & interactions

- **Default:** `a.card` lifts 1px on hover; the arrow nudges (`--icon-gap: var(--space-xs)`) on hover and focus.
- **Accordion:** a click on the summary toggles `<details>`. The global `::details-content` reveal runs over `--dur-medium`; under reduced motion it is instant. The summary text takes the hover colour `--accent-hover`.
- The Accordion CTA is a real link, so it nudges itself (`_icons.scss`).
- Figma has no reactions; `Open` is a property.

## Content rules

- Title, description and CTA are macro arguments in `studio.njk`.
- Accordion link kinds: `https://…` opens a new tab with Icon/External (`arrow-ext`); `mailto:` uses the email glyph. Figma draws the arrow-right in both (F39). Repo wins on existing glyphs unless the design says otherwise.

## HTML & accessibility

```html
<details class="card link-card">
  <summary><h3>Graphic Design</h3></summary>
  <div class="flow has-gap-s"><p>…</p><a data-icon="email" href="mailto:…">Enquire</a></div>
</details>
```

- Default: the whole card is the link, with an inert CTA `<span>`. Accordion: `<summary>` is the button; its expanded state is native.
- The "+" is drawn by CSS and is decorative.

## Port notes

- Figma's Accordion hides the Number; the repo counter applies only to Default. No change.
- The Accordion CTA icon is Arrow-right in Figma but `arrow-ext` or `email` in the repo. Decide per link kind (Open question).
- Summary gap is now a bound minimum, not a fixed 392 (F39).

## Open questions

- Should the Accordion CTA use the arrow for every link, or keep external ↗ and email glyphs by link type?
- Should the `adhoc` type get a Figma variant, or be removed from the macro?
