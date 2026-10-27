# Footer

**Layer:** Section · **Status:** figma · **Figma:** `2293:2112` · **Code:** `src/_includes/_footer.njk`

## Purpose

The site footer on every page: a Contact column with an illustration, then the colophon.

## Anatomy

Both layouts have a **Contact row** and a **Colophon**, on a `brand/150` fill.

- **Contact row**
  - **Footer Illustration**: [Illustration/footer](illustration.md), in a frame.
  - **Contact**: a **Header** (the "Contact" title and the intro, "Ready to talk shop or want to discuss an idea? Get in touch and I'll reply within a day.") then four [Contact card](contact-card.md) instances.
- **Colophon**, in this order (F43):
  1. **Site note**: `site/body` paragraph.
  2. **Badges**: Design Declares logo and a linked badge.
  3. **Copyright**: "© Francesco Imola, 2026".

Both Footer variants use the same colophon order.

## Props & variants

| Layout | Shows | Variant ID |
| --- | --- | --- |
| Wide | Contact row is a 2-column grid: illustration left, Contact right. Colophon is a grid too | `2293:1805` |
| Narrow | One column: Contact, then illustration, then Colophon | `2293:1806` |

| Property | Values | Notes |
| --- | --- | --- |
| Layout | Wide (default), Narrow | Renamed from Breakpoint=Desktop/Mobile (Q14). Wide on the 1512 frames, Narrow on 834 and 390 |
| Site note | text | Default: "This site has been designed by hand with love and a healthy dose of anxiety. It runs on servers powered by renewable energy." (Q23). Per-page overrides are cleared |

The earlier 168-character override ("…dedicate it to Ciociaria…") is gone from the default.

## Layout

- **Wide ↔ Narrow** is structural: grid to single column, and the illustration moves under the cards. In code use a container query on `main` or an intrinsic grid, with a `_responsive.scss` block as fallback (Q25).
- Desktop columns align to the 900 column (Q22). Gutters follow the page: `space/l` on Wide, `space/m` on Narrow.
- The Colophon is a grid on Wide and a column on Narrow.

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Padding top | `space/xl-2xl` | 45 → 67.5 |
| Padding bottom | `space/3xl-4xl` | 90 → 135 |
| Padding inline, Wide | `space/l` | 30 → 33.75 |
| Padding inline, Narrow | `space/m` | 22.5 → 25.31 |
| Gap Contact row ↔ Colophon | `space/3xl-4xl` | 90 → 135 |
| Contact row and Colophon gap | `space/s-m` | 15 → 25.31 |
| Contact column gap | `space/xs` | 11.25 → 13.13 |
| Contact header padding below | `space/s` | 15 → 16.88 |
| Contact row / Colophon width, Wide | `layout/content-width` | 330 → 900 |
| Fill | `brand/150` | colour |

Values from [`_tokens.md`](_tokens.md). The Design Declares logo fill is raw on purpose.

## States & interactions

Static. The links and the copy button inside use the global hover and focus ring.

## Content rules

- Site note is one paragraph set in the Footer's `Site note` property. Keep the default site-wide.
- Contact cards and their rows come from [Contact card](contact-card.md).
- The Copyright year is "2026". Use the build year in code.

## HTML & accessibility

```html
<footer class="site-footer">
  <section aria-labelledby="contact-title">
    <h2 id="contact-title">Contact</h2> <p>…</p> <!-- contact cards -->
  </section>
  <div class="site-footer__art">…svg…</div>
  <div class="site-footer__colophon"><p>Site note</p> <ul>badges</ul> <p>© …</p></div>
</footer>
```

- `<footer>` is the page's contentinfo landmark. The illustration is decorative (`aria-hidden`).
- Badge links need names (Design Declares and the second badge).
- Tab order follows the DOM: cards, badges.

## Port notes

- Today there are two footers (`desktop-only`, `mobile-only`) holding "Up for a chat?" plus a "Looking around?" nav. The redesign has one footer in two layouts and no footer nav: drop the `nav[aria-label="Footer"]`.
- The footer sits under `main` on the page. The old `.sidebar footer` rule goes with the sidebar.
- Replace the duplicated desktop and mobile markup with one footer driven by a container query.

## Open questions

- The nav list ("Looking around?") is gone from Figma. Confirm the footer carries no links beyond the contact cards.
- The badges' second link (`2293:1553`) has no destination recorded in Figma. What does it link to?
