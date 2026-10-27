# Card

**Layer:** Primitive · **Status:** planned · **Figma:** (pattern) examples `2322:9190` (Collaborate), `2292:1548` (Service card), `2380:19851` (Quote card), `2339:9812` (Accessibility) · **Code:** `.card` in `src/css/_components.scss`

## Purpose

A padded, rounded surface that groups related content. The base of [Service card](service-card.md), [Quote card](quote-card.md), [Contact card](contact-card.md), [CTA card](cta-card.md) and the Artmaking image cards. Figma has no generic Card component: 39 loose "Card" frames across pages, with varying padding (Q29).

## Anatomy

- **Surface**: fill `card-bg`, radius, padding.
- **Content**: text, links, or a direct-child image.
- Optional **media** as a direct child, which bleeds to the edges.

## Props & variants

Repo modifiers, all on `.card`:

| Class / element | Effect |
| --- | --- |
| `.outline` | Transparent with a 1px `neutral-400-alpha` border |
| `.featured` | `accent-surface` fill, darker accent for contrast (AA) |
| `.link-card` / `a.card` | Whole card is a link, nudges up on hover |
| `details.card` | Accordion card ([Service card](service-card.md) Accordion) |
| `.flow-row` | Row direction instead of column |
| `.has-counter>.card h3::before` | Numbered `01`, `02`… titles |

## Layout

None, fluid only. `inline-size: 100%`, so it fills its parent. Stacks and grids belong to the parent.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Padding (`--pad`) | `space/s-m` | 15 → 25.31 |
| Fill | `card-bg` | follows theme |
| Radius | `border-radius-s` (some Collaborate cards use `border-radius`) | repo wins |
| Inner gap | `space/3xs` to `space/s`, per use | see the component |

Values from [`_tokens.md`](_tokens.md).

## States & interactions

- `a.card`: hover moves it up 1px (`--dur-fast`), active returns it. Under reduced motion, durations are 0s.
- Forced colours: a 1px `CanvasText` border; link cards turn `LinkText`/`ActiveText`.
- Focus: the global ring (`:focus-visible`).

## Content rules

- **Full-bleed rule:** an `img`, `picture`, `figure` or `video` that is a **direct child** of `.card` bleeds to the edge: width `calc(100% + 2 * var(--pad))`, margin `calc(-1 * var(--pad))`, radius 0. The first child also pulls up, the last child pulls down. Wrapping the image in anything restores the padding.
- `--pad` is the single source for padding and the bleed maths. Change it there only.
- `figure .project-video-wrapper` is squared off inside a card.

## HTML & accessibility

```html
<article class="card">
  <img src="…" alt="…">
  <h3>Title</h3><p>Text</p>
</article>
```

- Use `article` for a self-contained card, `li` inside a list, `a` for a link card. A card is not a landmark.
- Link cards: one link per card, with the CTA as an inert `span` so the card is the only tab stop.

## Port notes

- Figma cards vary (Collaborate fixed heights were fixed in F32; Accessibility has a Card inside a Card). Build instances from the repo class, not from the loose frames.
- Collaborate "What I do" cards use `border-radius` in Figma, not `-s`. Repo wins: `border-radius-s`.

## Open questions

- Should Figma get a real Card component with `Outline` and `Featured` variants?
- Collaborate card radius `border-radius` vs `border-radius-s`: confirm `-s`.
