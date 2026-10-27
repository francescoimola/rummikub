# Token values

Resolved Utopia values from the Figma **Utopia** collection (`VariableCollectionId:2271:2222`, 62 variables). Min is the 390 and 834 frames, Max the 1512 frames. In code each one is a fluid `clamp()` from `_scale.scss` / `_cleacss-overrides.scss`, never these px ([port rules](../decisions.md#port-rules-figma-is-a-snapshot-the-repo-stays-fluid-2026-10-25)).

Figma `space/s-m` = CSS `--space-s-m`; `step/2` = `--step-2`; `layout/content-width` and `layout/inline-size` map to the CSS names in the tables.

## Type

| Figma | CSS | Min → Max |
| --- | --- | --- |
| `step/-1` | `--step--1` (also the figcaption size, G12) | 11.25 → 12.66 |
| `step/0` | `--step-0` | 15 → 16.88 |
| `step/1` | `--step-1` | 20 → 22.49 |
| `step/2` | `--step-2` | 26.65 → 29.99 |
| `step/3` | `--step-3` | 35.53 → 39.97 |
| `step/4` | `--step-4 (new, positiveSteps 5)` | 47.36 → 53.28 |
| `step/5` | `--step-5 (new)` | 63.13 → 71.02 |
| `step/2-4` | `--step-2-4 (new pair)` | 26.65 → 53.28 |
| `step/hero` | `--step-hero (new, content width ÷ 5.196)` | 63.51 → 173.21 |
| `type/small` | `small` | 12.5 → 14.06 |
| `line-height/body` | — | 22.5 → 25.31 |
| `line-height/hero` | — | 47 → 128.18 |
| `letter-spacing/hero` | — | -1.91 → -5.2 |

## Space

| Figma | Min → Max |
| --- | --- |
| `space/4xs` | 1.88 → 1.88 |
| `space/3xs` | 3.75 → 4.69 |
| `space/2xs` | 7.5 → 8.44 |
| `space/xs` | 11.25 → 13.13 |
| `space/s` | 15 → 16.88 |
| `space/m` | 22.5 → 25.31 |
| `space/l` | 30 → 33.75 |
| `space/xl` | 45 → 50.63 |
| `space/2xl` | 60 → 67.5 |
| `space/3xl` | 90 → 101.25 |
| `space/4xl` | 120 → 135 |

Pairs run from the first step's Min to the second step's Max:

| Figma | Min → Max |
| --- | --- |
| `space/4xs-3xs` | 1.88 → 4.69 |
| `space/3xs-2xs` | 3.75 → 8.44 |
| `space/2xs-xs` | 7.5 → 13.13 |
| `space/xs-s` | 11.25 → 16.88 |
| `space/s-m` | 15 → 25.31 |
| `space/m-l` | 22.5 → 33.75 |
| `space/l-xl` | 30 → 50.63 |
| `space/xl-2xl` | 45 → 67.5 |
| `space/2xl-3xl` | 60 → 101.25 |
| `space/3xl-4xl` | 90 → 135 |
| `space/3xs-xl` | 3.75 → 50.63 |
| `space/3xs-m` | 3.75 → 25.31 |
| `space/s-l` | 15 → 33.75 |
| `space/s-xl` | 15 → 50.63 |
| `space/s-2xl` | 15 → 67.5 |
| `space/m-xl` | 22.5 → 50.63 |
| `space/l-2xl` | 30 → 67.5 |
| `space/l-3xl` | 30 → 101.25 |
| `space/l-4xl` | 30 → 135 |
| `space/xl-3xl` | 45 → 101.25 |
| `space/xl-4xl` | 45 → 135 |
| `space/2xl-4xl` | 60 → 135 |

## Layout and sizes

| Figma | CSS | Min → Max |
| --- | --- | --- |
| `layout/content-width` | `--grid-width-l` column | 330 → 900 |
| `layout/inline-size` | `--inline-size` | 600 → 600 |
| `layout/gutter` | `--gutter-x` / `--gutter-y` (= `space/s-m`) | 15 → 25.31 |
| `size/hero-illustration` | new, `block-size` | 154 → 220 |
| `size/illustration-wide` | new | 345 → 449.28 |
