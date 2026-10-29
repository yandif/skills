# Extraction playbook — turning report.md into design decisions

The extractor reports *what the browser computed*. Your job is to recover *what the designers meant*.
A computed `#6b7280` is "muted text"; 30 stray near-greys are one neutral ramp. This file is the judgement layer.

## Contents
1. Read in this order
2. Colour: palette → ramps → semantic roles → dark
3. Typography: families, scale, text styles
4. Spacing, radii, shadows, motion, breakpoints
5. Components → recipes
6. Naming rules
7. When extraction is thin or fails
8. Scope and licensing

## 1. Read in this order

1. **Screenshots** (`screenshots/*.png`, open them with Read). Form an opinion of the look before any numbers.
2. **§2 CSS variables** in report.md. If the site defines its own tokens (`--brand-500`, `--radius-lg`, shadcn's `--primary`),
   those are the designers' vocabulary: reuse their names and groupings. `frameworkHints` tells you if it is Tailwind /
   shadcn / Radix / Bootstrap — then the real scale is that framework's default, and observed values will snap to it.
3. **§1 colours**, then typography, spacing, shape/depth/motion, components.
4. `analysis.json` / `raw.json` only when a table is ambiguous.

## 2. Colour

**Weights tell you importance.** `weight` blends text characters, background area, borders and interactive use. The page
background and body text dominate; the accent is small in area but marked "interactive".

**Roles first, ramps second.**
1. Identify: page background, surface (cards), body text, muted text, border, brand/accent, accent-on-dark text,
   success/warning/danger (only if actually present — do not invent a status palette the site lacks).
2. Neutrals (`kind: neutral`): order by lightness; usually 6–10 distinct greys. Name the ramp `gray`/`neutral`
   (or `ink`/`slate` if tinted — the report's `(indigo tint)` hint says which hue). Number 50→950 by lightness.
3. Accent(s) (`kind: chromatic`): one ramp per hue family that appears in ≥2 roles. Keep observed shades exactly; fill the
   rest with `node scripts/gen-scale.mjs <anchor> --name brand --pin 600=<hover hex>`. Generated steps are marked so
   FIDELITY.md can disclose them.
4. Near-duplicates are already merged (distance < 0.9). If two clusters differ by < 2 and have the same role, merge by hand.
5. Alpha colours (`alpha 0.12`): keep as rgba/hex8 in raw tokens (`brand.alpha12`) or express as a semantic token — do not
   flatten them onto white, they behave differently in dark mode.

**Semantic layer** (what components should reference): `bg.canvas`, `bg.surface`, `bg.subtle`, `fg`, `fg.muted`, `fg.inverse`,
`border`, `border.strong`, `accent`, `accent.hover`, `accent.fg`, plus any role the site demonstrably has. Name by purpose,
never by appearance (`danger`, not `red`).

**Dark mode.** `report.md §1b` and "Dark overrides" give the dark value for each role. Map each *role* (not each hex) — the
same raw colour often serves two roles that diverge in dark. If dark values are only available as raw clusters, pair them
with the light role by usage (page-bg ↔ page-bg, body text ↔ body text). Set `conditions.dark` per the table in
panda-preset-anatomy.md §3. If the report says "not detected", ship light only and say so in FIDELITY.md.

## 3. Typography

* **Families**: first family name per role. `body` = most characters; `heading` = family of h1/h2 (often the same);
  `mono` = code/pre. Keep the site's full fallback stack. Fonts the site loads via @font-face/Google Fonts are listed — note
  them in FIDELITY.md; do not copy font files.
* **Scale**: convert px → rem using `Root font-size`. Sizes within 0.5px are the same step. Name by t-shirt rank with `md`
  = the body size: `2xs xs sm md lg xl 2xl 3xl 4xl 5xl …`. If the site has a clean modular ratio (guess given), keep its names.
  Observed in-between values (13.33px default button text) are browser defaults, not design — ignore them unless the site
  styles them deliberately.
* **Weights**: map to names (`regular 400`, `medium 500`, `semibold 600`, `bold 700`); only include weights in use.
* **Line-height / tracking**: unitless line-height; tracking in em. Headings are usually tight (1.1–1.25, negative tracking),
  body loose (1.5–1.7).
* **textStyles** = the rows of the "Type styles actually rendered" table that are semantically distinct. Typical:
  `display`, `h1…h4`, `body-lg`, `body`, `body-sm`, `caption`, `label`, `overline` (uppercase + tracking), `code`. Merge rows that
  differ only by colour. Target ≥ 85% of rendered characters matched (verify.mjs prints this).

## 4. Spacing, radii, shadows, motion, breakpoints

* **Spacing** — use the detected base. Base 4px → keys are the multiplier (`1` = 0.25rem, `4` = 1rem, `6` = 1.5rem), as in
  Tailwind, which is what most Panda users expect. Base 8px → keys `1`, `2`, `3`… = 0.5rem steps. Include every value in the
  "most-used" list; include `px` (1px) and `0`. Layout-scale outliers (96, 160 — section padding) go in `sizes`/spacing too
  if they repeat. If the site names its spacing variables, use those names instead.
* **Radii** — sorted: `none`, `sm`, `md`, `lg`, `xl`, `full` (9999px). 50% on square elements = `full` too.
* **Shadows** — report orders them smallest→largest: name `xs/sm/md/lg/xl` or `card/popover/modal` if their usage is
  obvious. Keep the exact multi-layer string (rgba values matter). Focus rings implemented as box-shadow belong in a recipe,
  not in `shadows`.
* **Motion** — `durations` (`fast/normal/slow` from the observed set), `easings` (exact cubic-beziers), `keyframes` from the
  list (read the actual @keyframes body from raw CSS if you need it).
* **Breakpoints** — from min-width queries, sorted; round 767/768, 1023/1024 pairs to the same step. Name `sm md lg xl 2xl`.
  If the site is max-width-driven (desktop-first), still express as min-width tokens and mention it in FIDELITY.md.
* **Containers** — repeated `max-width` values become `sizes.container-*` tokens.
* **z-index** — only the observed layers, named by purpose (`sticky`, `dropdown`, `modal`, `toast`).

## 5. Components → recipes

Use the component tables (buttons, inputs, cards, badges, links, chrome) and their `states`:

* One recipe per component *kind* that has ≥ 2 variants or 2 sizes on the page (button, input, badge). Cards become a
  `layerStyle` unless they have parts, then a slot recipe.
* Variants mirror what is visible: `solid | outline | ghost`, `sm | md | lg` (inferred from the heights/paddings sampled).
  Do not add variants the site never shows.
* Every value is a token reference. If a component uses a value that has no token, fix the tokens first.
* Map states: `hover` diff → `_hover`, `focus` diff → `_focusVisible`, transitions → `transition` with duration/easing tokens.
  Disabled/active states are not sampled; add `_disabled: { opacity: …, cursor: 'not-allowed' }` only if you have evidence.
* Links, headings, selection, scrollbar, `::placeholder` → `globalCss`.

## 6. Naming rules

* By role or rank, never by value (`radii.lg`, not `radii.12px`).
* Panda conventions: camelCase categories, `DEFAULT` for the base of a group, numeric ramps 50–950.
* Keep the site's own variable names when they are sensible (`--brand-500` → `brand.500`); strip prefixes (`--ds-`, `--md-sys-`).
* One name = one meaning. Don't reuse `muted` for both a text colour and a background.

## 7. When extraction is thin or fails

| situation | what to do |
| --- | --- |
| `Cannot open …` / network blocked in the sandbox | ask the user to save the page (browser "Save page as → Webpage, Complete" or DevTools → Sources) and run `extract.mjs path/to/page.html`; or use a browser tool to open the site and save its HTML+CSS |
| bot wall / login wall | do not try to bypass it. Ask for a saved copy of a logged-in page the user is entitled to use |
| SPA with almost no elements (< 30 visible) | the render did not finish: re-run with `--pages` pointing at a deeper route, or save the rendered DOM and pass the file |
| almost no colours / everything white | content is behind a cookie banner or hero video; scroll and screenshot manually, extract a subpage |
| huge site with several templates | `--pages home,pricing,docs,blog` merges frequency maps so ranking reflects the whole site |
| computed values are all generic (`system-ui`, black on white) | the page is unstyled or the CSS was blocked; check screenshots before trusting the data |
| a design that only exists on hover/in modals | sample states are limited to buttons/links/inputs; inspect raw CSS for the rest |

Never invent values to fill a gap. A smaller preset that is accurate beats a complete one that is guessed; list the gaps in FIDELITY.md.

## 8. Scope and licensing

* The preset reproduces **design tokens and component styling** (colours, scales, spacing) — it does not copy
  logos, illustrations, photographs, copy or font files. Record font families by name; tell the user a commercial font needs its
  own licence.
* Extract only pages the user has the right to analyse. Don't extract from authenticated sessions that aren't the user's own.
* Brand names in the output: name the preset after the user's project (`<slug>-panda-preset`), and say in README/FIDELITY.md
  that it was derived from the source site's public styling.
