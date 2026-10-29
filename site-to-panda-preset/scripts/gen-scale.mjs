#!/usr/bin/env node
/**
 * gen-scale.mjs — build an 11-step colour ramp around colours the site really uses.
 *
 *   node gen-scale.mjs <anchor-hex> --name brand [--anchor 500] [--pin 600=#4e56d3,700=#3b43b8] [--format ts|json]
 *
 * Observed colours are sacred: the anchor and every --pin value are emitted exactly as given. The other
 * steps are interpolated in OKLCH (hue fixed, lightness stepped, chroma tapered at the ends) and marked
 * `// generated` so FIDELITY.md can say which shades the site never actually shows.
 */
import { parseColor, toHex, oklch, oklabToRgb, oklchToHex } from './lib/color.mjs'

const argv = process.argv.slice(2)
const flag = (n, d) => { const i = argv.indexOf(`--${n}`); return i < 0 ? d : argv[i + 1] }
const anchorHex = argv.find((a, i) => !a.startsWith('--') && !(argv[i - 1] || '').startsWith('--'))
if (!anchorHex) { console.error('Usage: node gen-scale.mjs <hex> --name brand [--anchor 500] [--pin 600=#hex,…] [--format ts|json]'); process.exit(1) }
const name = flag('name', 'brand')
const format = flag('format', 'ts')
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
const LADDER = { 50: 0.975, 100: 0.945, 200: 0.9, 300: 0.83, 400: 0.74, 500: 0.65, 600: 0.56, 700: 0.47, 800: 0.38, 900: 0.3, 950: 0.22 }
const pins = Object.fromEntries((flag('pin', '') || '').split(',').filter(Boolean).map((p) => p.split('=')))

const a = parseColor(anchorHex)
if (!a) { console.error(`cannot parse ${anchorHex}`); process.exit(1) }
const A = oklch(a)
// anchor lands on the step whose ladder lightness is closest, unless forced
let anchorStep = Number(flag('anchor', 0))
if (!anchorStep) anchorStep = STEPS.reduce((best, s) => (Math.abs(LADDER[s] - A.L) < Math.abs(LADDER[best] - A.L) ? s : best), 500)
// a pinned shade (e.g. the hover colour) must never be displaced by the anchor: slide the anchor one step lighter
if (pins[anchorStep] && !argv.includes('--anchor')) anchorStep = STEPS[Math.max(0, STEPS.indexOf(anchorStep) - 1)]

// reduce chroma until the colour fits sRGB (clamping would shift hue)
const inGamut = (L, C, h) => {
  const rad = (h * Math.PI) / 180
  const [r, g, b] = (() => {
    const l = (L + 0.3963377774 * C * Math.cos(rad) + 0.2158037573 * C * Math.sin(rad)) ** 3
    const m = (L - 0.1055613458 * C * Math.cos(rad) - 0.0638541728 * C * Math.sin(rad)) ** 3
    const s = (L - 0.0894841775 * C * Math.cos(rad) - 1.291485548 * C * Math.sin(rad)) ** 3
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s]
  })()
  return [r, g, b].every((v) => v >= -0.0005 && v <= 1.0005)
}
const fit = (L, C, h) => { let c = C; while (c > 0 && !inGamut(L, c, h)) c -= 0.002; return oklchToHex(L, Math.max(c, 0), h) }

const idx = STEPS.indexOf(anchorStep)
const out = {}
for (const [i, step] of STEPS.entries()) {
  if (step === anchorStep) { out[step] = { hex: toHex(a).slice(0, 7), generated: false }; continue }
  if (pins[step]) { out[step] = { hex: pins[step], generated: false }; continue }
  let L, C
  if (i < idx) {
    const t = (idx - i) / idx // 0 at anchor → 1 at lightest
    L = A.L + (LADDER[step] - LADDER[anchorStep]) * ((LADDER[50] - A.L) / (LADDER[50] - LADDER[anchorStep]))
    C = A.C * (1 - 0.88 * t ** 1.4)
  } else {
    const t = (i - idx) / (STEPS.length - 1 - idx)
    L = A.L - (A.L - LADDER[950]) * t
    C = A.C * (1 - 0.45 * t ** 1.2)
  }
  out[step] = { hex: fit(L, C, A.h), generated: true }
}

if (format === 'json') console.log(JSON.stringify(out, null, 2))
else {
  console.log(`  ${name}: {`)
  for (const s of STEPS) console.log(`    ${s}: { value: '${out[s].hex}' },${out[s].generated ? ' // generated' : ' // observed'}`)
  console.log('  },')
}
