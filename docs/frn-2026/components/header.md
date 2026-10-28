# Header

**Layer:** Section · **Status:** code · **Figma:** `2291:838` · **Code:** `src/_includes/_header.njk`, `.site-banner` + `.nav-menu`

## Purpose

The site banner, the same on every page: the site name, the primary nav and the [Look toggles](look-toggles.md). The **Minimal** variant (Collaborate, Accessibility, 404) was removed in code (#72, G52); those pages get the full header too.

## Anatomy

**Full, Wide** (one row):

- **Navigation - Primary** (`nav[aria-label="Primary"]`), width `layout/content-width`, aligned to the page column:
  - **brand/francesco-imola**: the site name, linking home.
  - **List** (`ul`): six [Nav link](nav-link.md) instances: Start here, Work with me, Ideas, Artmaking, About, Say hello.
- **Look toggles**: pinned to the right edge, outside the column (G2).

**Full, Narrow** (`details.nav-menu`):

- **Navigation - Primary**: the bar (`summary.nav-menu__bar`) holds the **Brand Name** and **Menu**, which is the label "Menu" plus [Icon/Plus](icon.md).
- **Menu panel** (`.nav-menu__panel`, Open only): Look toggles on the left, **Links** (the same six Nav links, stacked) on the right.

## Props & variants

| Type | Layout | State | Shows | Variant ID |
| --- | --- | --- | --- | --- |
| Full | Wide | Closed | Name + nav list + Look toggles | `2291:827` |
| Full | Narrow | Closed | Name + "Menu +" | `2291:837` |
| Full | Narrow | Open | Bar ("Menu ×") + panel: toggles \| six links | `2378:20306` |

- Wide is used on the 1512 frames, Narrow on the 834 and 390 frames. Wide has no Open state.
- Figma still holds the retired `Type=Minimal` variants (`2378:20352`, `2378:20378`, `2378:20385`); code no longer has them (G52).
- The current page is set on the matching nested Nav link (`State=Current`). Case study pages, Collaborate, Accessibility and 404 mark nothing.

## Layout

- **Wide ↔ Narrow** is a structural change: the inline list becomes a disclosure. In code there is one `<nav>` and one list for both. The Narrow bar is shown, and the panel collapsed, below one `_responsive.scss` block, the same mechanism as today's `.nav-menu`.
- The redesign replaces today's desktop **sidebar** (the 2×2 grid of name + footer | links + toggles) with a top bar. The `.sidebar` grid and its subgrid rules go.
- Gutters follow the page: `space/l` on tablet and `space/m` on mobile (Q22).

## Tokens

| Use | Figma variable | Min → Max |
| --- | --- | --- |
| Padding block | `space/s` | 15 → 16.88 |
| Padding inline, Wide | `space/s` start, `space/l` end | 15 → 16.88 / 30 → 33.75 |
| Padding inline, Narrow | `space/m` (tablet frames: `space/l`) | 22.5 → 25.31 |
| Nav column width | `layout/content-width` | 330 → 900 |
| Nav list gap (Wide) | `space/s`, wrap gap `space/xs` | 15 → 16.88 |
| Nav list gap (Narrow panel) | `space/xs` | 11.25 → 13.13 |
| Toggles ↔ nav | `space/l` | 30 → 33.75 |
| "Menu" ↔ icon | `space/2xs` | 7.5 → 8.44 |
| Menu icon size | `step/0` | 15 → 16.88 |
| Panel padding below | `space/s` | 15 → 16.88 |

Values from [`_tokens.md`](_tokens.md).

## States & interactions

- **Menu (Narrow):** a click toggles Closed ↔ Open. In Figma this is wired as a prototype with smart animate. Icon/Plus rotates −45° to read as ×, and the panel opens below the bar. In code this is the native `<details>` toggle, with `::details-content` animated over `--dur-medium`. Under reduced motion the durations are 0s.
- **Nav links:** see [Nav link](nav-link.md) for Default, Hover and Current.
- **Focus:** the global `:focus-visible` ring (2px `--color-accent`, offset 2px) on the summary, the links and the toggles.

## Content rules

- Nav labels are fixed in the partial: Start here `/`, Work with me `/studio/`, Ideas `/writing/` (G1; the old repo label was "Ideas & guides"). The `/writing/` page `<title>` is "Ideas & Guides" and its hero "Ideas and Guides" (#68), Artmaking `/art/`, About `/about/`, Say hello `#contact` (the footer's Contact section, on every page).
- **"Case studies" leaves the nav** (Q16, Q32). Anything that linked to `/work/` points at `/#case-studies`, the homepage's Featured heading.
- Current page: `/writing/…` posts and type pages mark Ideas; `/studio/…` service pages mark Work with me; case studies mark nothing.

## HTML & accessibility

```html
<header class="site-banner">
  <nav aria-label="Primary">
    <a href="/" class="site-banner__name">Francesco Imola</a>
    <details class="nav-menu">
      <summary class="nav-menu__bar">Menu <i class="nav-menu__icon" aria-hidden="true"></i></summary>
      <div class="nav-menu__panel">
        <ul> <li><a href="/" aria-current="page">Start here</a></li> … </ul>
        <div class="nav-menu__toggles">{% include "_look-toggles.njk" %}</div>
      </div>
    </details>
  </nav>
</header>
```

- One `<nav aria-label="Primary">`. The current link carries `aria-current="page"`.
- `<summary>` is the disclosure button. Its text stays "Menu" and the icon is decorative, so `<details>` exposes the expanded state itself.
- The skip link (`#main-content`) comes before the header.

## Port notes

- Drop the "Case studies" `<li>`.
- **Full ported (#22):** the sidebar is gone; `_base.njk` renders skip link → banner → `.layout` (main, then the old footers as a stopgap until the Footer ticket). Wide is an `@container banner (width >= $bp-xl)` block in `_responsive.scss`: nav and panel share a `1fr minmax(0, --grid-width-l) 1fr` grid, so the name sits at the column start, links at its end and the toggles in the right track. Narrow is the base: name overlays the `<details>` bar in one grid cell, so the panel spans the full width.
- "Say hello" links to `#contact` (the footer's id).
- **Minimal removed (#72, G52):** ported in #23, then dropped after recurring layout bugs (a stretched theme toggle among them). The `header: minimal` front matter, the template branch, `.site-banner--minimal` and `.nav-menu__exit` are gone; every page renders the full header.
- Rename the nav label "Ideas & guides" to "Ideas" (G1).

## Open questions

None. Settled in Phase 18 (G1 label, G2 toggles).
