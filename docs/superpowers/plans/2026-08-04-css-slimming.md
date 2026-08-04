# CSS Slimming Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove one dead CSS rule, stop the stylesheet loading in two slow steps instead of one, tidy repeated rules, and fold two one-off utility classes into the component that uses them.

**Architecture:** Four independent tasks, smallest and safest first. Task 2 is the only one that changes how the site actually loads, and it is the only one that can break things silently — so it gets its own automated check.

**Tech Stack:** Eleventy 3, Nunjucks, SCSS via `@11tyrocks/eleventy-plugin-sass-lightningcss`, pnpm, vitest.

**Spec:** `docs/superpowers/specs/2026-08-04-css-slimming-design.md`

## Global Constraints

- Never commit to `public/` — it is build output (AGENTS.md non-negotiable rule 3).
- SCSS comments are single-line `//`, one comment per line, never wrapped paragraphs (rule 8).
- All `@use` statements stay above `@import` in `index.scss` (CSS rule 1).
- Breakpoint rules stay in `_responsive.scss` — do not move any into other files (CSS rule 10).
- AGENTS.md must stay at 200 lines or fewer (rule 9).
- Do not subset or edit `src/css/vendor/cleacss.css`. It stays exactly as-is.
- Do not start a dev server unless the user asks.

## Plain-language summary of what changes

| Task | What it does | Risk |
|---|---|---|
| 0 | Sets up the safety net so everything is reversible | none |
| 1 | Deletes 3 lines of CSS nothing uses | none |
| 2 | Makes the stylesheet load as one file instead of two | **high** |
| 3 | Merges rules that were written out twice | medium |
| 4 | Replaces two one-off classes with one component rule | low |

---

### Task 0: Safety net

Nothing here changes the site. This exists so every later task can be undone.

**Why this is needed:** You are on `main`, which tracks `origin/main` and deploys to
production. You also have 12 files with uncommitted edits, including the two SCSS files
this plan modifies. Without this task, "undo the CSS work" would also throw away that
unrelated work in progress.

**Files:**
- No source files modified.

**Interfaces:**
- Produces: a git tag `pre-css-slimming` and a branch `css-slimming`, used by every later task's rollback step.

- [ ] **Step 1: Look at what is currently uncommitted**

```bash
git status --short
git diff --stat
```

Expected: 12 modified files. Read this before continuing — you need to know whether
this work is finished or half-done.

- [ ] **Step 2: Decide what happens to that work — ASK THE USER**

Do not guess. Present the diff and ask which they want:

- **Commit it** — if the work is complete. Cleanest option.
- **Stash it** — if it is half-finished. It is retrievable with `git stash pop`.

Do not proceed until the working tree is clean.

- [ ] **Step 3: Confirm the tree is clean**

```bash
git status --short
```

Expected: no output at all. If anything prints, stop and go back to Step 2.

- [ ] **Step 4: Tag the current state**

This is the restore point. It marks the exact commit the site is in right now.

```bash
git tag pre-css-slimming
git tag -n1 pre-css-slimming
```

Expected: prints `pre-css-slimming` and the commit message.

- [ ] **Step 5: Make a branch so main is never touched**

```bash
git switch -c css-slimming
git branch --show-current
```

Expected: `css-slimming`. Nothing can now reach production without an explicit merge.

- [ ] **Step 6: Save a copy of the current build to compare against later**

```bash
pnpm build
cp -R public /tmp/rummikub-baseline
ls /tmp/rummikub-baseline/css/
```

Expected: `index.css` and a `vendor` directory.

**How to undo everything, at any point:**

```bash
git switch main            # leave the work branch
git branch -D css-slimming # delete it entirely
```

The site returns to exactly the state tagged `pre-css-slimming`. Because all work
happens on a branch and is never pushed, production is unaffected throughout.

---

### Task 1: Delete the unused rule

**Files:**
- Modify: `src/css/index.scss:637-639`

**Interfaces:**
- Consumes: clean working tree on branch `css-slimming` from Task 0.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Prove the class is unused before deleting it**

```bash
grep -rn 'has-justify-between' src/ eleventy.config.js
grep -rn 'has-justify-between' public --include='*.html'
grep -c 'has-justify-between' src/css/vendor/cleacss.css
```

Expected: the first prints exactly one line (`src/css/index.scss:637`), the second
prints nothing, the third prints `0`. If the second command prints anything, **stop** —
the class is in use and this task must be abandoned.

- [ ] **Step 2: Delete the rule**

Remove these three lines from `src/css/index.scss`:

```scss
.has-justify-between {
    justify-content: space-between; // cleacss ships center/end/start/stretch but not between
}
```

- [ ] **Step 3: Rebuild and confirm it is gone**

```bash
pnpm build
grep -c 'has-justify-between' public/css/index.css
```

Expected: `0`.

- [ ] **Step 4: Confirm nothing else changed**

```bash
diff <(ls -R /tmp/rummikub-baseline) <(ls -R public)
```

Expected: no output. Same files, same names.

- [ ] **Step 5: Commit**

```bash
git add src/css/index.scss
git commit -m "Remove unused .has-justify-between rule"
```

---

### Task 2: Load the stylesheet as one file

**This is the risky task.** Read the whole task before starting.

**What is wrong today, in plain terms:** Your page asks for one stylesheet,
`index.css`. But the first line of that file says "now also go and fetch
`vendor/cleacss.css`". So the browser has to make two trips, one after the other, and
the page cannot paint until both finish. The second trip cannot start early, because
the browser does not know it exists until the first file arrives.

**Why it is like that:** `src/css/index.scss` line 8 ends in `.css`. Sass leaves any
import ending in `.css` alone instead of pasting the file in. Removing the extension
makes Sass paste the contents in, giving one file and one trip.

**The trap:** CSS has "layers", which are priority bands. A layer's priority is set by
the order the names first appear. Right now cleacss is pasted at the very top, so its
layer names appear first, which puts them at the **bottom** of the priority order —
they lose to your styles, which is what you want.

Paste cleacss in at line 8 instead, and your `fonts`/`colors`/`type` names appear
first. cleacss's layers jump to the **top** of the priority order and start overriding
your own colours and fonts, on every page, with no error message.

The fix is one line that states the order explicitly, so it no longer depends on
position. cleacss has **five** layers, not one:

```scss
@layer reset, layout, elements, is, has, fonts, colors, type;
```

**Files:**
- Modify: `src/css/index.scss:8` and add a new first line
- Modify: `eleventy.config.js:54`
- Modify: `AGENTS.md` (CSS rules 2 and 3)
- Create: `src/css/built-css.test.js`

**Interfaces:**
- Consumes: clean tree on `css-slimming`, baseline at `/tmp/rummikub-baseline`.
- Produces: `src/css/built-css.test.js`, an automated guard asserting the built CSS has
  no `@import` and declares the eight layers in the correct order.

- [ ] **Step 1: Record the current layer order, so you can prove it is unchanged**

```bash
grep -o '@layer [a-z]*' /tmp/rummikub-baseline/css/vendor/cleacss.css | awk '!seen[$0]++'
grep -o '@layer [a-z]*' /tmp/rummikub-baseline/css/index.css | awk '!seen[$0]++'
```

Expected: first prints `reset, layout, elements, is, has` in that order; second prints
`fonts, colors, type` in that order. Combined, that is the order the fix must preserve.

- [ ] **Step 2: Write the failing test**

Create `src/css/built-css.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';

const css = () => readFileSync('public/css/index.css', 'utf8');

describe('built stylesheet', () => {
  it('is a single file with no runtime @import', () => {
    expect(css()).not.toMatch(/@import/);
  });

  it('pins layer order so cleacss stays below our tokens', () => {
    const order = [...css().matchAll(/@layer ([a-z, ]+);/g)][0];
    expect(order, 'no @layer order statement found').toBeDefined();
    expect(order[1].split(',').map((s) => s.trim())).toEqual([
      'reset', 'layout', 'elements', 'is', 'has', 'fonts', 'colors', 'type',
    ]);
  });

  it('no longer emits the unused vendor copy', () => {
    expect(existsSync('public/css/vendor/cleacss.css')).toBe(false);
  });
});
```

- [ ] **Step 3: Run it and watch it fail**

```bash
pnpm build && pnpm vitest run src/css/built-css.test.js
```

Expected: all three fail. The first because the `@import` is still there, the second
because no order statement exists yet, the third because `vendor/` is still copied.
**If any test passes here, the test is wrong — fix it before continuing.**

- [ ] **Step 4: Make the three source changes**

In `src/css/index.scss`, add as the **very first line**, above every `@use`:

```scss
// Pins layer priority independently of source order — cleacss must stay below our tokens
@layer reset, layout, elements, is, has, fonts, colors, type;
```

On line 8, drop the extension so Sass pastes the file in:

```scss
@import "vendor/cleacss";
```

In `eleventy.config.js`, delete line 54 — nothing requests that file any more:

```js
eleventyConfig.addPassthroughCopy({ "src/css/vendor": "css/vendor" });
```

- [ ] **Step 5: Run the tests and watch them pass**

```bash
pnpm build && pnpm vitest run src/css/built-css.test.js
```

Expected: 3 passed.

- [ ] **Step 6: Check the full layer order really is unchanged**

The order statement passing is not proof the layers inside the file are intact.

```bash
grep -o '@layer [a-z]*' public/css/index.css | awk '!seen[$0]++'
```

Expected: `reset, layout, elements, is, has, fonts, colors, type` — cleacss's five
first, yours after.

- [ ] **Step 7: Check the size moved the way it should**

```bash
echo "before: $(wc -c < /tmp/rummikub-baseline/css/index.css) + $(wc -c < /tmp/rummikub-baseline/css/vendor/cleacss.css)"
echo "after:  $(wc -c < public/css/index.css)"
```

Expected: "after" is meaningfully smaller than the two "before" numbers added together,
because cleacss gets minified for the first time. If "after" is roughly 167,000, the
minifier did not run — investigate before continuing.

- [ ] **Step 8: Confirm the HTML did not change**

```bash
diff -r /tmp/rummikub-baseline --exclude=css public
```

Expected: no output.

- [ ] **Step 9: Look at the site — ASK THE USER TO DO THIS**

The test suite cannot catch a cascade regression. It has no idea what the site looks
like. A human must check.

Ask the user to run `pnpm start` and compare these four pages against the live site, in
**both light and dark mode**:

- `/` — sidebar, nav, theme switch
- `/studio/design/` — the pricing list, which uses the most cleacss utilities
- any page under `/work/` — case study spacing and image bleed
- `/art/` — masonry and split rows

What a regression looks like: wrong body font, wrong background, wrong accent colour,
lost spacing. Those are the signs cleacss's reset has jumped above your tokens.

**If anything looks wrong, stop and roll back:**

```bash
git switch main && git branch -D css-slimming
```

- [ ] **Step 10: Update AGENTS.md**

Two corrections. In CSS rule 2, the claim that extensionless imports force pass-through
is backwards — extensionless *inlines*. Replace that parenthetical with a note that the
import is extensionless so Sass inlines it into one file.

In CSS rule 3, the layer list currently reads `reset`, `fonts`, `colors`, `type`. It
omits cleacss's `layout`, `elements`, `is` and `has`. Correct the list and note that
order is pinned by the `@layer` statement at the top of `index.scss`.

- [ ] **Step 11: Check AGENTS.md is still within its line limit**

```bash
wc -l AGENTS.md
```

Expected: 200 or fewer. If over, trim elsewhere in the file.

- [ ] **Step 12: Commit**

```bash
git add src/css/index.scss eleventy.config.js AGENTS.md src/css/built-css.test.js
git commit -m "Bundle cleacss into one stylesheet, pin layer order"
```

---

### Task 3: Merge rules written out twice

**In plain terms:** in several places a `:hover` rule and a `:focus-visible` rule are
written separately with identical contents. They can be one rule.

**Files:**
- Modify: `src/css/index.scss`, `src/css/_icons.scss`, `src/css/_components.scss`

**Interfaces:**
- Consumes: passing `src/css/built-css.test.js` from Task 2.
- Produces: nothing later tasks depend on.

Confirmed duplicate pairs:

| Contents | Selectors that share it |
|---|---|
| `--color-accent: var(--accent-hover)` | `a:hover, button:hover` / `a:focus-visible, button:focus-visible` |
| `color: var(--accent-hover)` | `nav li:hover` / `summary:hover` / `summary:focus-visible` |
| `margin-inline-start: var(--space-xs)` | four icon rules in `_icons.scss` |

- [ ] **Step 1: Merge one pair only**

Start with the `a`/`button` pair. Replace the two rules with one:

```scss
:is(a, button):is(:hover, :focus-visible) {
    --color-accent: var(--accent-hover);
}
```

- [ ] **Step 2: Rebuild and check the rule survived**

```bash
pnpm build && grep -c 'accent-hover' public/css/index.css
```

Expected: a number greater than 0. If it dropped to 0, the selector is malformed.

- [ ] **Step 3: Check specificity did not change**

This matters. `:is()` takes the specificity of its most specific argument, so merging
selectors of *different* specificity silently changes which rule wins.

Both `a:hover` and `button:hover` are (0,1,1), so the merged form is also (0,1,1) —
unchanged. Confirm the same is true for any other pair before merging it. **If a pair's
two selectors differ in specificity, skip that pair.**

- [ ] **Step 4: Look at it — ASK THE USER**

Ask the user to hover and keyboard-tab links and buttons on `/` and confirm the accent
colour still changes in both cases.

- [ ] **Step 5: Commit this pair before starting the next**

```bash
git add src/css/index.scss
git commit -m "Merge duplicate hover/focus-visible rule for links and buttons"
```

- [ ] **Step 6: Repeat steps 1-5 for the remaining pairs, one commit each**

One pair per commit. If a merge looks wrong, `git revert` that single commit without
losing the others.

---

### Task 4: Fold two one-off classes into their component

**In plain terms:** `.has-nowrap` and `.has-row-divider` exist as general-purpose
utilities but are only ever used on four sibling list items on one page. Those four
`<li>`s carry five classes each. One rule scoped to that list replaces both utilities.

**Files:**
- Modify: `src/studio/design.njk:49-75`
- Modify: `src/css/index.scss` (delete both utility rules)
- Modify: `src/css/_components.scss` (add the scoped rule)

**Interfaces:**
- Consumes: passing `src/css/built-css.test.js` from Task 2.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Confirm both classes are used nowhere else**

```bash
grep -rn 'has-nowrap\|has-row-divider' src --include='*.njk' --include='*.md'
grep -rc 'has-nowrap\|has-row-divider' public --include='*.html' | grep -v ':0$'
```

Expected: every hit is in `src/studio/design.njk`, and the only built page listed is
`public/studio/design/index.html`. **If any other file appears, stop** — this task
assumes a single consumer.

- [ ] **Step 2: Understand the markup structure — this determines the selector**

The list is `src/studio/design.njk:48-77`. Each of the four `<li>` elements looks like:

```njk
<li class="flow-row has-gap-m has-items-start has-pb-m has-row-divider">
    <div class="flow has-gap-3xs has-flex-1">
        <p>Website with CMS</p>
        <p class="dimmed">Ideal if you publish often.</p>   {# description #}
    </div>
    <p class="dimmed has-nowrap">from £2,500</p>            {# price #}
</li>
```

**The critical detail:** there are **two** `.dimmed` paragraphs per row — the
description and the price. Only the price gets `has-nowrap`. A descendant selector like
`.pricing-list .dimmed` would wrongly hit the descriptions too and force those sentences
onto one line.

The price is the only `<p>` that is a **direct child** of the `<li>`; the description is
nested inside the `.flow` div. So the direct-child combinator distinguishes them.

The `<ul>` is `class="flow has-gap-m"` — no distinguishing class, so one must be added.

- [ ] **Step 3: Add the scoped rule to `_components.scss`**

```scss
// Pricing rows: bottom rule matching <hr>, which can't sit between <li>
.pricing-list>li {
    border-block-end: var(--input-border-width) solid var(--input-border-color);
}

// Direct child only — the nested .dimmed description must stay wrappable
.pricing-list>li>p {
    white-space: nowrap;
}
```

- [ ] **Step 4: Remove the classes from the markup**

In `src/studio/design.njk`:

- line 48: `<ul class="flow has-gap-m">` becomes `<ul class="flow has-gap-m pricing-list">`
- lines 49, 56, 63, 70: drop `has-row-divider` from each `<li>`
- lines 54, 61, 68, 75: drop `has-nowrap` from each price `<p>`, keeping `dimmed`

Leave every other class untouched.

- [ ] **Step 5: Delete the two now-unused utilities from `index.scss`**

Remove the `.has-row-divider` and `.has-nowrap` rules (around lines 629-635).

- [ ] **Step 6: Rebuild and confirm both are fully gone**

```bash
pnpm build
grep -rc 'has-nowrap\|has-row-divider' public | grep -v ':0$'
```

Expected: no output at all — gone from both the CSS and the HTML.

- [ ] **Step 7: Look at it — ASK THE USER**

Ask the user to check `/studio/design/`, narrow the window, and confirm three things:

1. All four pricing rows still have a bottom rule.
2. The prices ("from £2,500") still sit on one line.
3. **The descriptions ("Ideal if you publish often.") still wrap normally onto multiple
   lines.** If they have gone to one line and are overflowing, the selector caught the
   wrong element — revert and re-read Step 2.

- [ ] **Step 8: Commit**

```bash
git add src/studio/design.njk src/css/index.scss src/css/_components.scss
git commit -m "Fold pricing-row utilities into a scoped component rule"
```

---

## Finishing up

- [ ] **Run the whole suite**

```bash
pnpm test
```

Expected: all pass, including the new `built-css.test.js`.

- [ ] **Compare final size against the baseline**

```bash
echo "before: $(( $(wc -c < /tmp/rummikub-baseline/css/index.css) + $(wc -c < /tmp/rummikub-baseline/css/vendor/cleacss.css) )) bytes, 2 requests"
echo "after:  $(wc -c < public/css/index.css) bytes, 1 request"
```

- [ ] **Merging is the user's decision**

This branch is not production until it is merged into `main` and pushed. Ask before
doing either. Do not push.

## Honest expectations

Tasks 1, 3 and 4 move roughly 200 bytes between them. Their value is a tidier codebase,
not a faster site — treat any byte saving there as incidental.

Task 2 is the only change a visitor could notice: one network round trip removed from
first paint, and a 129 KB file minified for the first time.

## What is deliberately not covered

There is no automated test for how the site *looks*. vitest covers JS config and
scripts only. Every visual check in this plan is a manual step for the user, and that is
the real safety net for Task 2 — not the test suite.
