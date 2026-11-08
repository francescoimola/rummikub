# Long-form pages (work + writing)

Case studies and writing posts share **one** branch in `_base.njk` → `<main class="case-study text">`, writing adding `writing-post`. It renders a `.case-study__intro` (h1 + one dimmed line: `services` on work, `<time>` + type on writing) and nothing else — the opening image is authored as the first `figureImg` **in the body**, not by the template. `image:`/`alt:` frontmatter is listing-thumbnail and OG duty only; a post without one just leads with the intro then text. A standalone page opts into the same shell with `longForm: true` (Accessibility): no `writing-post` class, and the intro line reads "Last updated" from `updated`.

Media rhythm (`.case-study` in `_components.scss`) and the scroll animation (`_responsive.scss`) both key off `.case-study__intro`: the first media after it gets `settle` (bleeds on load, pulls in over 50vh of scroll). Later media never animate. Figures and media pairs sit at the 60rem column (`--grid-width-l`), wider than the 40rem text, on every page; media ending the page carries no trailing margin. Removing the intro div silently kills `settle`. Browsers without `animation-timeline` (Firefox) get the same keyframes scrubbed from JS: `app-core.js` dynamically imports `scroll-fallback.js`, which finds targets by the `--scroll-fallback` custom property the CSS sets and writes `--scroll-p` — so target selectors and the breakpoint live only in `_responsive.scss`.

**Always use `figureImg` for body images — never markdown `![]()`.** Markdown compiles to `<p><picture>`, and two images on adjacent lines land in the *same* `<p>`, so they stack with no gap and support no caption. `figureImg` emits a real `<figure>` that the spacing and animation selectors match.

```njk
{% figureImg "/assets/writing/x.png", "Alt text" %}
{% figureImg "/assets/writing/x.png", "Alt", caption="Optional caption" %}
{% figureImg "/assets/writing/x.png", "Alt", href="https://…" %}   {# wraps img in a target=_blank link #}
{% figureImg "/assets/writing/x.png", "Alt", class="extra" %}      {# extra class on the <figure> #}
{% figureImg "/assets/writing/x.png", "Alt", imgClass="extra" %}   {# extra class on the <img> itself #}
{% figureImg "/assets/writing/x.png", "Alt", position="62% 18%" %} {# object-position crop #}
{% figureImg "/assets/writing/x.png", "Alt", ratio="3:2" %}        {# crop to --ratio-3-2 (also projectVideo); unknown ratio fails the build #}
{% mediaPair %}{% figureImg … %}{% figureImg … %}{% endmediaPair %} {# two figures side by side, stacking below $bp-s #}
```

**Object-position picker (dev only):** under `pnpm start`, Alt/Option+click any img or video (videos need a poster) to drag its focal point live and copy the CSS or `position=` value. Lives in `src/dev/focal-picker.js`, copied and linked only in serve mode; `built-landmarks.test.js` asserts it never ships.
