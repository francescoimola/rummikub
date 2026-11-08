# Figma

The code is the source of truth. Design tweaks happen in the code, so Figma falls behind between redesigns. That is expected. Realign it only when a redesign is coming.

- **File key:** `UkQphRf7GwINc1c8vORtUm`
- **Where to work:** page `2246:754`, WIP section `2275:725`, Components board `2291:769`. Section `2260:2139` is an archive: read it, never edit it.
- **Frames:** desktop 1512, tablet 834, mobile 390. These match the Utopia maximum and minimum.

## Realigning Figma with the code

1. Start from the map at [#106](https://github.com/francescoimola/rummikub/issues/106). The order is [#107](https://github.com/francescoimola/rummikub/issues/107) (list every difference), [#108](https://github.com/francescoimola/rummikub/issues/108) (rhythm in Figma), [#109](https://github.com/francescoimola/rummikub/issues/109) (the Components board), the page groups, then [#110](https://github.com/francescoimola/rummikub/issues/110) (a handoff prompt for a fresh agent).
2. Treat `development` as right whenever Figma and the code disagree. Bind every value in Figma to a variable.
3. Those tickets predate the docs cleanup. Where one names a file in `docs/frn-2026/`, read it from the archive tag.

## The archive

The tag `docs-archive-2026-11-08` holds the one-per-component docs, the decisions record, the Figma gotchas, the node ID list and the variable exports. For example:

```bash
git show docs-archive-2026-11-08:docs/frn-2026/figma-gotchas.md
git show docs-archive-2026-11-08:docs/frn-2026/figma-state.json
```

The Figma helper scripts were never in git. They are in `.private/figma-tools/`.
