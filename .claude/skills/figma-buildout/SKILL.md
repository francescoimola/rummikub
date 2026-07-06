---
name: figma-buildout
description: Use when translating or implementing a Figma frame, design, or figma.com URL into HTML for this rummikub portfolio — "build this frame", "implement this design", design-to-code. Enforces reuse of existing cleacss + project classes and gates any new class, media asset, or feature behind sign-off.
user-invocable: true
argument-hint: '[figma-url-or-frame]'
---

# Figma buildout

## Overview

Translate a Figma frame into semantic HTML for this project **by reusing what already exists**, not by inventing. The existing cleacss framework and project SCSS already cover almost everything a frame needs; your job is to map the design onto that surface, map every value to a design token, and refuse to add anything new without the user's explicit say-so.

**Reuse over invent.** Building the visual shell is your job; building behaviour, new classes, or new assets is a request you must clear with the user first.

The deliverable is a **reviewed build plan**, not merged code. You stop before writing markup into the project.

## Non-negotiable rules

- **Resolve ambiguity before building.** When the request's intent, the frame's placement, the content mode/brand, or any element's meaning is uncertain, ask the user first — as multiple-choice questions (`AskUserQuestion`) with 2–4 concrete options, not open-ended prose. Guessing is a violation. See "Ask when uncertain" below.
- **Reuse-only classes.** No new CSS class enters the plan without the user's individual, explicit yes — one class, one direct question. Never list a proposed class in the plan and treat silence as approval.
- **Live CSS is the source of truth.** Read `src/css/vendor/cleacss.css` and `src/css/index.scss` (plus `_colors.scss`, `_scale.scss`) every run before you map anything. Do not trust memory or this skill for the class list — it drifts.
- **Feature behaviour is out of scope.** For anything interactive, build the visual shell with existing classes and hand the behaviour to another agent via a handoff prompt. Never wire up the logic yourself.
- **Media assets are not yours to invent.** When the frame or any child references an illustration or image, stop and ask the user how to source each one. Never fabricate a path or drop a silent placeholder.
- **No hardcoded values.** Anything with a token maps to a token — no raw `px`, hex, or `rem` literals for colour, spacing, or type.
- **Always run the critique pass.** A principal-engineer subagent tears the plan apart before the user sees it.
- **Stop at the plan.** Do not write markup until the user approves.

## Workflow

1. **Ingest the frame.** Call `get_screenshot` (visual truth), `get_metadata` (layer tree), `get_design_context` (structured props), and `get_variable_defs` (Figma variables → tokens).
2. **Clarify intent and placement.** Confirm what you're building and where it lands before touching CSS. If any of it is uncertain, ask multiple-choice questions now (see "Ask when uncertain"). Do not proceed on a guess.
3. **Load the reuse surface.** Read the live CSS files and build your working set: classless-styled elements, utility classes, project component classes, `data-*` hooks, and tokens.
4. **Decompose** the frame into a flat list of inner elements, each tagged with its semantic role (heading, card, list, nav, button, image, icon…).
5. **Classify** every element into exactly one bucket (see table below).
6. **Map tokens** — colours, spacing, type, and icons onto project tokens and utilities.
7. **Draft the markup** using the project idiom: nested `.flow`/`.flow-row` + `.has-gap-*`, `.card` + modifier, the 12-col `.grid`, semantic HTML, a single `<h1>` per page.
8. **Gate the exceptions** — for each genuine new class *and* each media asset, ask the user individually and get a yes before it enters the plan.
9. **Run the critique** — dispatch the principal-engineer subagent.
10. **Revise and present** the final plan: element→class mapping, drafted markup, feature-handoff prompts, and any approved classes/assets. **Then stop.**

## Classification: one bucket per element

| Bucket | What it looks like | What you do |
|---|---|---|
| **Already styled classless** | Heading, `table`, `details`/`summary`, `dialog`, `p`, form control | Write semantic HTML, no class. cleacss already styles it. |
| **Maps to existing class** | Anything a utility or project class covers | Reuse it — name the exact class in the plan. |
| **Interactive feature** | Breadcrumb nav, tabs, accordion logic, search, carousel, filter, live form | Build the static visual shell with existing classes; carve the behaviour out to a handoff prompt. |
| **Media asset** | Illustration, photo, decorative image | Do not invent or placeholder. Ask the user per asset how to source it. |
| **Genuine gap** | No existing class covers it, and it is not just a feature | New-class confirmation gate. |

Icons that match the existing `icon` shortcode / `data-icon` set are **reuse**, not a media-asset ask.

## Token mapping

| Design value | Maps to |
|---|---|
| Colour | `--brand-50..950`, `--neutral-50..950` (+ `-alpha`), or semantic `--color-accent` / `--accent-hover` / `--accent-surface` / `--card-bg` |
| Spacing / gaps | `.has-gap-*`, `.has-p*` / `.has-m*`, or `--space-2xs..4xl` (+ paired steps) |
| Type size | `--step--1..2` or `.has-size-*` |
| Theme / palette | `data-brand`, `data-theme`, `data-content="contrast"` |
| Icons | `data-icon` / `data-icon-before` or the `icon` shortcode |

The live `_colors.scss` and `_scale.scss` are the truth for what exists — read them, do not guess a token name.

## Ask when uncertain

Before building, make sure you actually understand the request. If any of the following is not pinned down, ask the user with an `AskUserQuestion` multiple-choice question (2–4 concrete options) rather than assuming. Batch related questions into one prompt.

| Uncertain about | Ask (example options) |
|---|---|
| Placement | New page · new `_includes/` partial · a section inside an existing page (which one?) |
| Content mode | Default flush layout · `data-content="contrast"` |
| Brand / palette | Default green · `data-brand="pink"` · `data-brand="orange"` |
| Ambiguous element | Which of two plausible readings the element is (e.g. tabs vs. segmented links) |
| Scope | Whole frame now · one section at a time |

If you can name two reasonable interpretations, that is uncertainty — ask. Only skip the question when the answer is unambiguous from the frame or the user's words.

## New-class confirmation gate

Before proposing any new class, prove no existing utility composes it. Most "new" needs are `.flow` + `.has-gap-*` + a `.has-*` helper you missed. If a gap survives that check, ask the user **one direct question for that one class** and wait for a yes.

**Sneaking a class into the plan for the user to notice is a violation.** Violating the letter of this rule is violating its spirit.

| Rationalization | Reality |
|---|---|
| "It's a tiny one-off utility." | Tiny classes still need a yes. Ask. |
| "I'll note it in the plan so they can see it." | That is the banned behaviour. Ask directly, per class. |
| "Reuse would need a wrapper — cleaner to add a class." | Prove no existing utility composes it first. Composition is the default. |
| "The frame clearly needs it, so it's implied approval." | Nothing is implied. Get the explicit yes. |

**Red flags — STOP:** you are writing a class name that is not in the live CSS · you are describing a new class in the plan without a preceding user yes · you are adding a class because reuse felt verbose. All of these mean: stop and ask.

## Media-asset gate

Same discipline as classes. Per asset, ask the user which of these they want:

- **Generate** it (describe what you'd generate).
- **Link an existing asset** (`src/assets/portfolio/`, `src/assets/icons/`, etc.).
- **Export from the Figma node** (`download_assets`).

One asset, one question. Never a fabricated path, never a silent placeholder.

## Feature-handoff prompt

For each interactive feature, emit a self-contained prompt for another agent. It must contain, in order:

1. **What the feature is** — its name and purpose in one line.
2. **Where the shell lives** — the file and anchor/selector, and which classes and markup are already in place.
3. **The expected behaviour** — described as observable outcomes (what the user sees and does), not as an implementation.

Do **not** prescribe the approach, the files to create, or the libraries. The receiving agent does its own thinking. Hand off the behaviour; keep the shell.

## The critique pass

Dispatch a general-purpose subagent as an uncompromising principal frontend engineer. Give it the drafted plan and tell it to read the same live CSS files, then attack:

1. Every proposed new class — is it a missed reuse?
2. Semantic HTML and accessibility — right elements, single `<h1>`, labels, focus order.
3. The feature / visual-shell split — is anything behavioural leaking into the shell, or vice versa?
4. Token mapping — any hardcoded value that should be a token?
5. Responsive and idiom fit — does it match the `.flow`/`.grid`/`.card` patterns and the mobile collapse?

Have it return blocking issues ranked most-severe first. Fold the survivors into the final plan.

## Worked example

Figma fragment: a small card — leaf icon, an "About" heading, a paragraph.

Reused markup (no new classes, all tokens):

```njk
<article class="card flow has-gap-xs">
  <div class="flow-row has-gap-xs has-items-center">
    {% icon "leaf", 'class="icon icon--sm"' %}
    <h3>About</h3>
  </div>
  <p>…</p>
</article>
```

If that same frame also held a **breadcrumb**, the plan would build the static `<nav>` shell and attach a handoff prompt:

> **Breadcrumb navigation.** The static shell is in `src/services.njk` at the `<nav aria-label="Breadcrumb">` above the page `<h1>`, using bare `<ol>`/`<li>`/`<a>` (cleacss styles them). Expected behaviour: the trail reflects the current page's position in the site hierarchy and the final crumb is the current page (not a link). Implementation is yours to decide.

And if the frame referenced a **hero illustration**, the plan would pause on step 7 and ask:

> The hero references an illustration. How should I source it — generate one, link an existing asset in `src/assets/`, or export the node from Figma?

## Common mistakes

- Inventing a class when `.flow` + `.has-gap-*` already composes it.
- Hardcoding `px`/hex instead of mapping to a token.
- Building the behaviour instead of just the shell.
- Listing a new class or asset in the plan without asking first.
- Skipping the live-file read and mapping from memory.
