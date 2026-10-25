# Variables Plus JSON format (learned 2026-10-25)

Plugin: **Variables Plus** (dynamic variables), https://variablesplus.com/documentation/. Not "Variables Pro".
Source sample: `rummikub/variables (sample-delete-after-creating-custom-version).json` (deleted 2026-10-25; export of the old "Francesco Imola" collection; 49 vars, 1 mode, no aliases, no formulas).

## Structure (from the sample)

```json
{
  "version": 1,
  "collections": [
    {
      "name": "Francesco Imola",
      "modes": [{ "name": "Mode 1" }],
      "variables": [
        {
          "id": "VariableID:64:352",
          "name": "Greyscale/white",
          "resolvedType": "COLOR",
          "description": "",
          "valuesByMode": { "Mode 1": { "r": 1, "g": 1, "b": 1, "a": 0.98 } },
          "expressionsByMode": {},
          "expressionMetadataByMode": {}
        },
        { "id": "VariableID:100:163", "name": "Spacing/space-100", "resolvedType": "FLOAT",
          "valuesByMode": { "Mode 1": 8 }, "expressionsByMode": {}, "expressionMetadataByMode": {} }
      ]
    }
  ]
}
```

- Modes are keyed **by name** inside `valuesByMode` (not by mode id). Modes have no ids in the export.
- Collections have no id. Variables carry a Figma `VariableID:x:y`.
- Colours: `{r,g,b,a}` in 0–1. Floats: bare numbers (px).
- Fields **not** present in the sample: scopes, codeSyntax, hiddenFromPublishing.

## Formulas (from the docs, not yet seen in JSON)

- Reference syntax: `{{Name}}` or `{{Collection:Name}}`. Internally stored by id ("renaming doesn't break formulas").
- Functions: `MIN`, `MAX`, `POWER`, `ROUND`, `FLOOR`, `CEILING`, `ABS`, `SQRT`, `IF`, `SWITCH`, …; no `CLAMP`, so build it from `MIN(MAX(…))`.
- `MODE("Name")` reads another mode's value.
- Limits: 10,000 chars, 15 nesting levels, 100 function calls, 5s timeout.

## Formulas in JSON (learned from `vp-test-variables(delete-after-redesign).json`, 2026-10-25; file since deleted)

- Every value, **constants included**, is a string in `expressionsByMode[modeName]`: `"390"`, `"15"`. `valuesByMode` is `{}` for plugin-managed variables.
- References are **by name**: `{{<URL-encoded collection>::<variable name>}}`, e.g. `{{VP%20test::rem}}`. Double colon. The docs' `{{Collection:Var}}` single colon is the UI form.
- An alias is just a reference expression: `"{{VP%20test::fluid}}"`. In Figma it lands as a real `VARIABLE_ALIAS`.
- Export includes other collections (here the old one, with `variables: []`).
- Figma side after compute: native values per mode id; scopes left at `ALL_SCOPES` (the JSON has no scopes field).
- `id` is present on export (`VariableID:…`). Unknown whether import requires it for new variables; names-only is the hypothesis to pilot.

## Evaluation bug seen

`fluid = MIN(MAX({{rem}}, 0.9712*{{rem}} + 0.001282*{{width}}), 1.125*{{rem}})` stored **16.875 in both modes** (expected 15.07 Mobile / 16.51 Desktop). Cause unknown: stale compute, string `+` concatenation, or a mis-resolved reference. Must be resolved before relying on formulas.

### Hypothesis after second docs read (2026-10-25)

The evaluator appears to ignore `*`-before-`+` precedence and run left to right: `((0.9712*15)+0.001282)*390 = 5682` → `MIN(MAX(15, 5682), 16.875) = 16.875`, exactly the stored value in both modes. Docs never state precedence. **Rule for generated formulas: parenthesise every product**, e.g. `(0.9712*{{rem}}) + (0.001282*{{width}})`. Pending confirmation with a bracketed retest.
- **Bracketed retest (v2 export, 2026-10-25): still 16.875 in both modes.** Precedence is not (solely) the cause. Remaining suspects: decimal-literal parsing (e.g. `0.001282` → 1282), references resolving in the wrong mode, or values not recomputed. Next: piece-by-piece test (t1–t5).

## Proven pattern (open-art-folke `docs/tokens/variables-utopia-formulas.json`, imported 2026-10-20, working)

- One collection **"Utopia"**, modes **`Min` / `Max`** = the Utopia endpoints. No width interpolation in Figma; fluid = different value per mode.
- **Drivers are numbers in `valuesByMode`** (`Type/Base` Min 14 / Max 18, `Type/Ratio` 1.2 / 1.25), with `expressionsByMode: {}`.
- Derived values: `valuesByMode: {}` + a formula string per mode.
  - steps: `{{Utopia::Type%2FBase}} * POWER({{Utopia::Type%2FRatio}}, n)`, negatives via `/ POWER(...)`
  - space: `{{Utopia::Step%2F0}} * 0.25` … `* 6`
  - pairs: Min references one step, Max another (`Space pair/S-M`: Min `{{…Space%2FS}}`, Max `{{…Space%2FM}}`)
  - line heights: `CEILING({{…Step%2F0}} * 3 / 2, {{…Space%2F2XS}})`; letter spacing `* -5 / 100`
- **Decimals beyond simple ones are written as integer fractions** (`* 11 / 10`, `* 380412 / 270000`). No `MIN`/`MAX` anywhere.
- References: `{{<collection>::<URL-encoded name>}}`, `/` → `%2F`, space → `%20`.
- `description` carries the human rationale (DRIVER: …, Min = …, Max = …).
- Every variable in the export has an `id`; whether import needs one for new variables is still unconfirmed. Plan: generate without ids; a failed import only means deleting the new collection.

## Rules for generated files

1. Drivers → numbers in `valuesByMode`; never string constants in `expressionsByMode`.
2. No `MIN`/`MAX` clamp rebuilding; use Min/Max modes.
3. Integer fractions instead of long decimals.

## Import result (2026-10-25)

- Import with **no ids** worked: Variables Plus created "Utopia" (Min/Max, 56 vars).
- Pure reference expressions (`{{…::type%2Fbase}}`) land as real Figma aliases.
- **Bug:** arithmetic on a variable that is a pure alias evaluates to **0** (`step/0 * 3 / 2` → 0). Arithmetic on drivers or computed formulas works. Rule 4: never do maths on an alias variable; reference the driver or a computed formula instead.
- `ROUND(x, 0)`, `POWER`, `*`, `/` all confirmed working.
