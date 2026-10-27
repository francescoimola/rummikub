# Figma AI prompts: KC Pelletier text

The agent can't load KC Pelletier Sans, so it can't edit those text nodes or the styles that use them. Paste each prompt into Figma AI (Make / "Ask AI" on the FRN-2026 file, page 2246:754). Run them in order; each one is self-contained. After a run, tell the agent so it can verify and tick the finding off in `audit.md`.

Variables named below live in the local **Utopia** collection. Desktop 1512 frames use mode Max; tablet 834 and mobile 390 frames use mode Min.

## P1 · Bind the hero and CTA text styles to Utopia (F21, F36, Q20)

```
In this file, edit these local text styles. Don't change their font family, weight, line breaks or the text of any layer.

1. Bind the font size of each of these styles to the variable "step/2-4" (Utopia collection):
   site/hero/Desktop, site/hero/Tablet, site/hero/Mobile, site/cta/heading/Desktop, site/page-header/hero/Desktop.
2. Bind the font size of each of these styles to the variable "step/hero":
   site/homepage/hero/Desktop, site/homepage/hero/Tablet, site/homepage/hero/Mobile.
3. Bind the line height of the three site/homepage/hero/* styles to "line-height/hero" and their letter spacing to "letter-spacing/hero".
4. For the five step/2-4 styles, keep the line height and letter spacing proportional to the size: if they're set in pixels, convert them to percent of the font size so they keep the same look at the new size.

Then list every text layer that uses one of these styles but has a local font-size, line-height or letter-spacing override, and clear those overrides.
```

Expected result: section heroes read 53.3 on desktop and 26.7 on tablet/mobile; every CTA heading follows its frame's mode instead of staying at 55.17; the home hero stays at 173.2 desktop and 63.5 on tablet/mobile.

## P2 · Hero widths (F21, F16)

```
Edit only these KC Pelletier text layers' sizing, not their text or style:

- Homepage - Tablet, layer 2336:19998, and Homepage - Mobile, layer 2336:20004: change width from Fixed to Fill container.
- Every layer that uses a site/hero/* or site/page-header/hero/* style and has a max width of 982: bind the max width to the variable "layout/content-width" instead (layers 2312:6265, 2312:6266, 2312:6267, 2312:6271–2312:6276, 2349:16622, 2350:16965, 2350:17744, 2350:18533, 2350:19313, 2350:20082, 2357:19432).
- Ideas & Guides (desktop) layer 2312:6268: width Fill container, max width bound to "layout/content-width".
- 404 - Page not found (desktop) layer 2334:9294: width Fixed 900 → Fill container, max width bound to "layout/content-width".
- In the CTA card instance on "Service - Website consultations - Tablet" (instance 2355:19786), reset any width override on the heading layer so it matches the other CTA cards.
```

## P3 · Service page copy (F33, Q24)

```
Change only the text of these KC Pelletier layers; keep their style and line breaks natural (no manual line breaks):

- Service - Web design (desktop), layer 2349:16622 → copy the exact text of layer 2350:17744 (Service - Web design - Tablet).
- Service - Website consultations (desktop), layer 2350:16965 → copy the exact text of layer 2350:19313 (Service - Website consultations - Tablet).
- The heading of the CTA card instances on Service - Web design, Service - Web design - Tablet and Service - Web design - Mobile (instances 2355:19730, 2355:19758, 2355:19772) → "Let's talk about your website".
```

## P4 · Swap the heroes to Page header instances (F08, F23, Q13)

Run this after P1–P3, so the instances inherit the bound styles.

```
The component "Page header" (2357:19433, on the Components board) is an illustration above a KC Pelletier heading. Replace the loose hero blocks on these frames with Page header instances:
Work with me, Ideas & Guides, Artmaking, 404 - Page not found, Service - Web design, Service - Website consultations, plus each one's "- Tablet" and "- Mobile" frame.

For each frame:
1. Insert a Page header instance at the hero block's position (same parent, same order), width Fill.
2. Set its heading text to the hero's exact current text (Artmaking has two hero paragraphs: put both in, in order).
3. Swap its illustration to the matching Illustration/* component (Illustration/runner, Illustration/meditating, Illustration/deskgarden or Illustration/websitevisit) for whichever drawing the hero shows. If the hero's drawing has no Illustration/* component, keep the loose drawing and tell me which frame.
4. Delete the old loose hero block only after the instance looks the same.
Don't change any text style, font or copy.
```

## P5 · Merge the per-size KC styles (Q35)

Run only after P1, once the sizes come from variables.

```
These local text styles are now identical within each group, because their size is bound to a Utopia variable:
- site/hero/Desktop, site/hero/Tablet, site/hero/Mobile, site/page-header/hero/Desktop
- site/homepage/hero/Desktop, site/homepage/hero/Tablet, site/homepage/hero/Mobile
- site/cta/heading/Desktop

1. Rename site/hero/Desktop → "site/hero", site/homepage/hero/Desktop → "site/homepage/hero", site/cta/heading/Desktop → "site/cta/heading".
2. Apply "site/hero" to every layer that uses site/hero/Tablet, site/hero/Mobile or site/page-header/hero/Desktop; apply "site/homepage/hero" to every layer that uses site/homepage/hero/Tablet or /Mobile.
3. When no layer uses them any more, delete site/hero/Tablet, site/hero/Mobile, site/page-header/hero/Desktop, site/homepage/hero/Tablet and site/homepage/hero/Mobile.
Don't change any font, size, text or line break. Report anything that looks different afterwards.
```
