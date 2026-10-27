# Audit kickoff prompt

Paste this after typing `/ask-matt` in a fresh session. It starts the pre-code audit of the FRN-2026 Figma file and the component docs. Expect it to route to `/grill-with-docs`.

```
I'm preparing the FRN-2026 Figma redesign of my portfolio (this repo, rummikub) to be built into code. Before any code, I want to (1) audit the Figma file for inconsistencies and settle each one with me, and (2) document every component, the way I did for Open Art Folke. Help me pick the right flow. I expect a question-heavy grilling session first.

Context to read first:
- docs/frn-2026/decisions.md: the full decision log (Phases 1–16). Treat it as what was intended, but expect it to be wrong or incomplete in places; that's what we're checking.
- docs/frn-2026/figma-state.json: all Figma IDs.
- AGENTS.md: repo rules (Eleventy + Nunjucks + SCSS, Utopia tokens, cleacss, CSS rule 10 for breakpoints).
- Component doc template: ~/Repositories/open-art-folke/docs/components/README.md, _template.md, header.md. Same structure here (Purpose, Anatomy, Props & variants, Layout, Tokens, States & interactions, Content rules, HTML & accessibility, Figma ID, repo file, status planned/figma/code). The output goes in docs/frn-2026/components/ with a README index, and each Figma component description links to its doc.

Figma: file UkQphRf7GwINc1c8vORtUm, page 2246:754. Work only in the WIP section 2275:725. The original section 2260:2139 is an archive: read it, never edit it. Components board: 2291:769. Desktop frames use Utopia Max; tablet (834) and mobile (390) use Utopia Min.

Rules: ask before deleting or renaming anything. Every spacing/size value must be bound to a variable. When Figma and the repo disagree on an existing value, the repo wins. Never swap a typeface. The agent can't load KC Pelletier Sans (hero and CTA headings), so those are mine to edit. No code changes or commits until the audit and docs are done.

Things to audit (start here, but surface anything else you find):
- Tablet/mobile frames that differ from their desktop: reordered or missing elements, intentional or not. Known example: I removed the service-page hero blurbs and simplified the Collaborate mobile header.
- The header: Desktop vs Mobile variants, the Collaborate minimal header (not a component), current-page marker on every page, Menu behaviour.
- Illustration sizing (size/hero-illustration 154→220). The Page header component exists but isn't used on any page yet.
- KC hero text: raw sizes and line breaks per breakpoint. Utopia --step-4/5 is planned for code.
- Known gaps from the log:
  - tablet long-form text fills 774 px, against --inline-size 600;
  - Look toggles 86 vs 47 px;
  - the CTA card puts the call link first, flipping Collaborate's original order;
  - Footer and Contact card still use loose link rows, not Icon link;
  - Split row covers the text half only;
  - the art project year isn't dimmed (it is in the repo);
  - the Writing item Default variant is 174 px tall (was 169).
- Things we've already settled (image ratios, media pairs, capped images, nav marker, the writing item grid): sanity-check them anyway.
- Anything that has no repo counterpart yet, or any repo template with no Figma component.

Components to document (IDs in figma-state.json):
- Site chrome: Header, Nav link, Footer, Contact card, Look toggles, Breadcrumb.
- Content items: Project item, Writing item, Service card, Carousel.
- Media: Image, Figure.
- Text and actions: Icon link, FAQ item, CTA card, Page header, Split row.
- Icons: Icon/* and Illustration/*.
Also the uncomponentised patterns (Section with highlighted heading, Pricing item, Quote card). We'll decide whether they get docs or components.
```
