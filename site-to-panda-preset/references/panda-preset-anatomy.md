# Panda preset anatomy — facts verified against @pandacss/dev 2.4

Read this before writing preset files. Everything here was tested by compiling a real preset; the
"gotchas" are mistakes that compiled silently but produced wrong CSS.

## Contents
1. What a preset is and how it is consumed
2. Token format and categories
3. Semantic tokens and dark mode
4. textStyles, layerStyles, recipes, globalCss
5. Gotchas that fail silently
6. Panda 1.x vs 2.x

## 1. What a preset is and how it is consumed

```ts
// preset/index.ts
import { definePreset } from '@pandacss/dev'
export default definePreset({
  name: 'acme-panda-preset',
  conditions: { extend: { dark: '.dark &' } },
  globalCss: { body: { bg: 'bg.canvas', color: 'fg', textStyle: 'body' } },
  theme: { breakpoints, keyframes, tokens, semanticTokens, textStyles, layerStyles, recipes },
})

// consumer: panda.config.ts
presets: ['@pandacss/preset-base', acmePreset]
```

* `@pandacss/preset-base` supplies the **utilities** (`bg`, `px`, `rounded`, `textStyle` …) and the base
  conditions (`_hover`, `_dark` …). Without it, `bg: 'bg.canvas'` is emitted literally as `bg: bg.canvas;`.
* `@pandacss/preset-panda` is Panda's default theme (blue/red/… palettes, default spacing). **Leave it out.**
  The site's preset is the whole theme; including preset-panda would leak unrelated tokens into autocomplete.
* Put values directly under `theme` (not `theme.extend`) so the preset *defines* the theme. Use `theme.extend`
  only if the user wants to layer the site on top of another preset.

## 2. Token format and categories

Every leaf is `{ value: … }`. Nesting makes the dotted path (`colors.brand.500`).

| category | holds | notes |
| --- | --- | --- |
| `colors` | hex / rgba / hsl / oklch | add `transparent`, `current` |
| `fonts` | font stacks | one entry per role: `body`, `heading`, `mono` |
| `fontSizes` | rem | convert px → rem with the site's root size (usually 16) |
| `fontWeights` | `'400'`… | strings are safest |
| `lineHeights` | unitless numbers | `'1.5'` |
| `letterSpacings` | em | `'-0.02em'` |
| `spacing` | rem | also drives padding/margin/gap; Panda auto-creates negative `-4` variants |
| `sizes` | widths/heights | add `full`, `screen`, `min`, `max`, `fit` (preset-panda used to provide them) + container widths |
| `radii` | px / rem | `full: 9999px` |
| `borderWidths`, `borders` | | |
| `shadows` | box-shadow strings | multi-layer allowed |
| `blurs`, `opacity`, `zIndex` | | zIndex values are numbers |
| `durations`, `easings` | `150ms`, `cubic-bezier(…)` | |
| `animations`, `assets`, `aspectRatios` | | rarely needed |

`breakpoints` and `keyframes` live beside `tokens` under `theme`. Breakpoints become `sizes.breakpoint-*` automatically.

References between tokens use `{category.path}`: `'{colors.brand.500}'`, `'{spacing.4}'`.
Inside a composite value (shadow, transition) use the token-function form: `'1px solid {colors.border}'`.

## 3. Semantic tokens and dark mode

```ts
semanticTokens: { colors: {
  bg: { canvas: { value: { base: '{colors.gray.50}', _dark: '{colors.night.950}' } } },
  fg: { DEFAULT: { value: { base: '{colors.ink.900}', _dark: '{colors.ink.100}' } },   // → colors.fg
        muted:   { value: { base: '{colors.gray.500}', _dark: '{colors.gray.400}' } } },   // → colors.fg.muted
}}
```

* `DEFAULT` collapses into the parent name, so `fg` and `fg.muted` both exist.
* The `_dark` key is whatever the `dark` condition is. Match the source site's mechanism (extract.mjs reports it):

| site switches dark mode by | `conditions.extend.dark` | output |
| --- | --- | --- |
| `@media (prefers-color-scheme: dark)` | `'@media (prefers-color-scheme: dark)'` | tokens flip with the OS |
| class on `<html>` (`.dark`) | `'.dark &'` | flips when the class is toggled |
| `data-theme="dark"` attribute | `'[data-theme=dark] &'` | flips on the attribute |

  preset-base already defines `_dark: '.dark &'` and `_osDark` (the media query), so overriding `dark` is only needed
  when the site does something else.
* Reference raw tokens, not hex, so the palette stays the single source of truth. Only the raw palette holds hex.

## 4. Composition styles, recipes, global CSS

```ts
textStyles:  { heading: { value: { fontFamily: 'heading', fontSize: '3xl', fontWeight: 'semibold', lineHeight: '1.2', letterSpacing: '-0.01em' } } }
layerStyles: { card:    { value: { bg: 'bg.surface', borderWidth: 'thin', borderColor: 'border', borderRadius: 'lg', boxShadow: 'card' } } }
recipes: { button: defineRecipe({ className: 'button', base: {…}, variants: { visual: {…}, size: {…} }, defaultVariants: {…} }) }
globalCss: { html: {…}, body: {…}, 'h1, h2': {…}, a: { color: 'accent', _hover: { textDecoration: 'underline' } } }
```

* textStyle/layerStyle values reference tokens **by name** (`fontSize: '3xl'`), never by raw value.
* Recipe states map directly: observed hover → `_hover`, focus ring → `_focusVisible`, disabled → `_disabled`.
* `defineRecipe` for single-part components; `defineSlotRecipe` (with `slots`) for multi-part ones (card = root/header/body).
* Font files: use `globalFontface` (Panda ≥ 2: `defineGlobalFontface`) only when the user supplies licensed files. Otherwise
  record the family in `fonts` tokens and note the licence/loading requirement in FIDELITY.md.

## 5. Gotchas that fail silently

| symptom | cause | fix |
| --- | --- | --- |
| CSS contains `bg: bg;` / `font-family: body;` | `@pandacss/preset-base` missing from `presets` | add it (2.x: `npm i -D @pandacss/preset-base`) |
| `Cannot resolve entry module @pandacss/preset-base` | package not installed (2.x ships it separately) | `npm i -D @pandacss/preset-base` |
| a recipe never appears in the CSS | Panda only sees recipe calls it can name statically | in showcase files use named imports and direct calls: `import { button } from '…/recipes'; button({})` — not `R.button()` |
| dark values never apply | `dark` condition does not match how the page toggles dark mode | align `conditions.extend.dark` with the source |
| tokens appear in CSS but `textStyle` is unstyled | `textStyles` placed under `tokens` instead of `theme` | move to `theme.textStyles` |
| `--spec` writes nothing | only the full `panda` build writes it, not `cssgen` | `panda --spec=.s2p/spec.json` |

## 6. Panda 1.x vs 2.x

Same preset shape and the same `define*` helpers; the scaffold works on both. Differences that matter:
2.x has a Rust compiler, `panda --spec` (machine-readable resolved tokens, used by verify.mjs), `panda check|doctor`,
theme variants (`defineThemeVariant`) and needs `@pandacss/preset-base` installed explicitly. In 1.x it arrives as a
dependency of `@pandacss/dev`. If the user pins 1.x, set the versions in the scaffolded package.json and skip `--spec`
based coverage (verify.mjs requires 2.x).
