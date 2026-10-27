# DevTools probes

For bugs only a browser shows (Firefox-only glitches, animation timing, scroll behaviour). Agents can't drive a browser here (AGENTS.md, browser automation blocklist), so the loop is: the agent hands over a console snippet, Francesco runs it, and pastes the output back. A snippet that logs **state per frame** beats a screenshot because it shows what changed and when.

## Handing results back

- Print the result as text in the console, then right-click → **Copy All Messages**, or select the lines and copy. Paste into the chat.
- `copy()` inside an `async` snippet fails after a delay in Firefox (no user gesture). Store the output on `window`, then run `copy(window.__log)` by hand.
- Files in `~/Downloads` are unreadable to agents and to `!` commands (macOS privacy). Paste the text, or drag the file into `.docs/` in Finder.

## Transition probe: does it animate, and when does the layout change?

Used for #63 (FAQ accordions in Firefox): showed no transition events on `::details-content`, opacity jumping 0 to 1 in one frame, and a 12px gap lingering for exactly `--dur-medium`. Change the selector and the properties to suit the element under test.

```js
(async () => {
  const d = document.querySelector('details:not(.nav-menu)');
  d.scrollIntoView({ block: 'center' });
  const pc = () => getComputedStyle(d, '::details-content');
  console.log('FIRST LINE >>', 'interpolate-size:', CSS.supports('interpolate-size', 'allow-keywords'),
    '| ::details-content display:', pc().display);
  const log = [], t0 = performance.now(), ms = () => Math.round(performance.now() - t0);
  ['transitionrun', 'transitionstart', 'transitionend', 'transitioncancel'].forEach(t =>
    d.addEventListener(t, e => log.push(`${ms()}ms ${t} ${e.propertyName} pseudo=${e.pseudoElement}`)));
  let on = true, last = '';
  (function loop() { if (!on) return;
    const s = `open=${d.open} h=${Math.round(d.getBoundingClientRect().height)} opacity=${(+pc().opacity).toFixed(2)} cv=${pc().contentVisibility}`;
    if (s !== last) { log.push(`${ms()}ms ${s}`); last = s; }
    requestAnimationFrame(loop); })();
  const wait = t => new Promise(r => setTimeout(r, t));
  d.open = true;  await wait(700);
  d.open = false; await wait(700);
  on = false;
  window.__log = log.join('\n');
  console.log(window.__log);
})();
```

Reading the log: it only prints when something changes, so a smooth animation shows many rows with in-between values, and a snap shows one jump. No `transitionrun` rows means no transition ran at all.

## Is the dev server serving current CSS?

A fast check that needs no browser: `curl -s localhost:8080/css/index.css | grep -o '<selector>{[^}]*}'` and compare with the source. Partial edits (`_components.scss`) can be missed until `pnpm start` restarts.
