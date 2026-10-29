---
name: site-to-panda-preset
description: Given a website URL (or a saved HTML page), study its design — colours, typography, spacing, radii, shadows, motion, dark mode, buttons/inputs/cards — and write a complete Panda CSS preset that reproduces it (tokens, semantic tokens, textStyles, layerStyles, recipes, globalCss), then verify it compiles and measure how faithfully it matches. Use whenever the user wants to clone, replicate, reverse-engineer, copy or "learn" a site's design system, turn a website into a Panda CSS / pandacss preset or theme, extract design tokens from a URL, or says things like "复刻这个网站的设计系统", "把这个网站做成 panda preset", "按这个网站的风格生成 token", even if they don't say "preset".
---

# Site → Panda CSS preset

Turn a live website into a Panda CSS design system: a `definePreset` package whose tokens, semantic colours,
type styles, surfaces and component recipes reproduce the site's look.

The work splits cleanly in two. **Scripts do the measuring** (computed styles are facts: they don't hallucinate,
and they scale to thousands of elements). **You do the judgement** (which of 40 greys is "border", what the
type scale is called, which button is the primary variant). Keep that split: never eyeball values the extractor
already measured, and never let a script name things.

All paths below are relative to this skill's folder. Scripts need Node ≥ 18; run them with `node`.

## Workflow

Track these as tasks; step 6 is the one people skip and the one that catches the most mistakes.

### 1. Preflight

* `playwright` must be importable: `npm i -D playwright && npx playwright install chromium` if not.
* Pick a working folder `./<slug>-panda-preset/` (slug from the site's name). Ask nothing the URL doesn't already answer;
  if the user gave several URLs, treat the first as the design source and pass the rest as `--pages`.

### 2. Extract

```bash
node scripts/extract.mjs <url|file.html> --out <work>/extract [--pages /pricing,/docs] [--width 1440]
```

Produces `report.md` (compact tables), `analysis.json` (same, structured), `raw.json`, and `screenshots/`
(`desktop-light`, `desktop-dark`, `mobile`). It captures computed styles over every visible element, weights colours by
how much text/area/interaction they carry, clusters near-duplicates, reads the site's own CSS variables, detects *how*
dark mode is switched, samples buttons/inputs/cards/badges with their hover/focus diffs, and records breakpoints, fonts,
shadows, motion.

Then **read `report.md` in full and open the screenshots with Read.** Form a picture of the design before deciding anything.
If the command fails or the report is thin (blocked network, bot wall, SPA that didn't render), follow
`references/extraction-playbook.md` §7 — do not paper over gaps with guessed values.

### 3. Decide the system (read `references/extraction-playbook.md` §2–§6)

Before writing code, settle on paper — a short list in your reply or a scratch note is enough:
palette roles and ramp names · semantic colour names · type-scale names · spacing keys · text styles · recipes · dark-mode
condition. Naming and grouping decisions made once here keep the files consistent. Prefer the site's own CSS-variable
vocabulary when it has one.

### 4. Scaffold and write the preset

```bash
node scripts/scaffold.mjs <work>/<slug>-panda-preset --name <slug> --source <url> --install
```

Fill the files in this order (each builds on the previous): `preset/tokens.ts` → `semantic-tokens.ts` → `conditions.ts` →
`text-styles.ts` → `layer-styles.ts` → `recipes.ts` → `global-css.ts`. Read `references/panda-preset-anatomy.md` first:
it lists the silent failure modes (missing `preset-base`, wrong dark condition, recipes Panda can't see).

Rules that make the result a *design system* rather than a pile of values:

* **Observed values stay exact.** Don't round `#5b5bd6` to a "nicer" colour or 13px to 0.8rem — fidelity is the product.
  Only *fill gaps* (missing ramp steps) with `node scripts/gen-scale.mjs <hex> --name brand --pin 600=<hover>` and keep its
  `// generated` markers.
* **Two layers of colour.** Raw palette in `tokens` (hex lives only here); roles in `semanticTokens` referencing the palette.
  Anything that differs in dark mode carries `{ base, _dark }`.
* **Components reference tokens, never raw values.** If a recipe needs a value with no token, go back and add the token.
* **Mirror what exists.** Variants and sizes come from what the site actually shows. No invented status colours or
  hover states without evidence.
* **Name by role or rank**, never by value; follow `extraction-playbook.md` §6.

### 5. Verify

```bash
node scripts/verify.mjs <preset-dir> --analysis <work>/extract
```

Compiles the preset with Panda (codegen + full build), generates a showcase that touches every textStyle, layerStyle and
recipe variant, checks each emitted CSS, then compares the site's rendered values with the preset's resolved tokens and writes
`FIDELITY.md`. Exit code 1 means it doesn't compile or something emits no CSS — fix before anything else.

Coverage is a to-do list, not a pass/fail. Aim for: colours ≥ 95% (weighted), font sizes and text styles ≥ 85%,
spacing/radii/shadows ≥ 90%, breakpoints 100%, dark values present if the site has a dark mode. For each gap decide:
add the token, or deliberately skip it (stray browser defaults like 13.33px button text, third-party widgets) and say so
under the `manual-notes` marker in `FIDELITY.md`. Re-run until the numbers settle.

### 6. Look at it

```bash
node scripts/styleguide.mjs <preset-dir> --shot <work>/extract/screenshots/desktop-light.png
```

Screenshot the generated `styleguide.html` (Playwright is already installed) and compare it with the source screenshots:
do the palette, type specimens and radii *feel* like the site? Numbers can all match while the hierarchy is wrong (a
heading style mapped to the wrong weight, a ramp whose generated steps are muddy). Fix what you see, re-verify.
The styleguide page defines its own initial CSS variables on `:root` (with dark overrides), so it themes correctly.

### 7. Deliver

Send the user the preset folder (zip it, excluding `node_modules`, `styled-system`, `.s2p`) plus the styleguide HTML;
use `SendUserFile`. In the reply, in a few lines: what was captured (counts of colours/text styles/recipes, dark mode yes/no),
the fidelity numbers that matter, anything deliberately left out or that needs the user's attention (font licences,
generated shades, flows you couldn't sample), and the two-line snippet to consume it:

```ts
presets: ['@pandacss/preset-base', preset]   // preset-base = utilities, the preset = the theme
```

## Output layout

```
<slug>-panda-preset/
  preset/{index,tokens,semantic-tokens,conditions,text-styles,layer-styles,recipes,global-css}.ts
  panda.config.ts      local config used to exercise the preset
  FIDELITY.md          generated coverage + the notes you wrote
  styleguide.html      visual token reference (+ source screenshot)
  README.md  package.json  tsconfig.json
```

## Scripts

| script | purpose |
| --- | --- |
| `scripts/extract.mjs` | URL/HTML → `report.md`, `analysis.json`, `raw.json`, screenshots |
| `scripts/scaffold.mjs` | copy `assets/preset-template/` with names filled in; `--install` runs npm install |
| `scripts/gen-scale.mjs` | 11-step OKLCH ramp around observed colours (`--pin` keeps observed shades exact) |
| `scripts/verify.mjs` | compile + showcase + fidelity report (`FIDELITY.md`) |
| `scripts/styleguide.mjs` | resolved tokens → one self-contained HTML page |

## References (read when the step says so)

* `references/extraction-playbook.md` — turning measurements into decisions; naming; failure handling; licensing.
* `references/panda-preset-anatomy.md` — preset API facts, dark-mode conditions, gotchas, 1.x vs 2.x.

## Limits worth stating to the user

The extractor sees one rendered state of public pages: hover/focus are sampled for buttons, links and inputs only; modals,
menus and authenticated views need a saved copy of the page. Computed values reproduce *what the site renders*, not the
designers' private intent, so ramps' unobserved shades are generated. Fonts and imagery are not copied.
