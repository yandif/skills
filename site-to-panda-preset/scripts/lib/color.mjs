// Small colour toolkit: parsing, hex output, OKLab distance. No dependencies.

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))

export function parseColor(input) {
  if (!input || typeof input !== 'string') return null
  const s = input.trim().toLowerCase()
  if (s === 'transparent') return [0, 0, 0, 0]
  let m = s.match(/^#([0-9a-f]{3,8})$/)
  if (m) {
    let h = m[1]
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('')
    if (h.length !== 6 && h.length !== 8) return null
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), a]
  }
  m = s.match(/^rgba?\(([^)]+)\)$/)
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean)
    const ch = (v) => (v.endsWith('%') ? (parseFloat(v) / 100) * 255 : parseFloat(v))
    const a = p[3] === undefined ? 1 : p[3].endsWith('%') ? parseFloat(p[3]) / 100 : parseFloat(p[3])
    if ([p[0], p[1], p[2]].some((v) => v === undefined || Number.isNaN(ch(v)))) return null
    return [ch(p[0]), ch(p[1]), ch(p[2]), a]
  }
  m = s.match(/^hsla?\(([^)]+)\)$/)
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean)
    const h = parseFloat(p[0])
    const sat = parseFloat(p[1]) / 100
    const l = parseFloat(p[2]) / 100
    const a = p[3] === undefined ? 1 : p[3].endsWith('%') ? parseFloat(p[3]) / 100 : parseFloat(p[3])
    if ([h, sat, l].some(Number.isNaN)) return null
    const k = (n) => (n + h / 30) % 12
    const aa = sat * Math.min(l, 1 - l)
    const f = (n) => l - aa * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return [f(0) * 255, f(8) * 255, f(4) * 255, a]
  }
  m = s.match(/^oklch\(([^)]+)\)$/)
  if (m) {
    const p = m[1].split(/[\s/]+/).filter(Boolean)
    const L = p[0].endsWith('%') ? parseFloat(p[0]) / 100 : parseFloat(p[0])
    const C = parseFloat(p[1])
    const H = parseFloat(p[2])
    const a = p[3] === undefined ? 1 : p[3].endsWith('%') ? parseFloat(p[3]) / 100 : parseFloat(p[3])
    if ([L, C, H].some(Number.isNaN)) return null
    const [r, g, b] = oklabToRgb(L, C * Math.cos((H * Math.PI) / 180), C * Math.sin((H * Math.PI) / 180))
    return [r, g, b, a]
  }
  return null
}

export function toHex([r, g, b, a = 1]) {
  const h = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}${a < 0.999 ? h(a * 255) : ''}`
}

const lin = (c) => {
  c /= 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}
const delin = (c) => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

export function rgbToOklab([r, g, b]) {
  const R = lin(r), G = lin(g), B = lin(b)
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B)
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B)
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

export function oklabToRgb(L, a, b) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    delin(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    delin(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    delin(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ].map((v) => clamp(v, 0, 255))
}

export function oklch(rgba) {
  const [L, a, b] = rgbToOklab(rgba)
  const C = Math.hypot(a, b)
  let h = (Math.atan2(b, a) * 180) / Math.PI
  if (h < 0) h += 360
  return { L, C, h }
}

export function oklchToHex(L, C, h) {
  const rad = (h * Math.PI) / 180
  return toHex([...oklabToRgb(L, C * Math.cos(rad), C * Math.sin(rad)), 1])
}

// Perceptual distance in OKLab, scaled so 1.0 ≈ one clearly visible step.
// ≤ 0.5 reads as the same colour; ≥ 2 reads as a different colour.
export function distance(c1, c2) {
  const A = rgbToOklab(c1), B = rgbToOklab(c2)
  return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]) * 100
}

// Flatten alpha onto a background (default white) so translucent colours can be compared.
export function flatten([r, g, b, a = 1], bg = [255, 255, 255]) {
  return [r * a + bg[0] * (1 - a), g * a + bg[1] * (1 - a), b * a + bg[2] * (1 - a), 1]
}

export function hueName(h) {
  const stops = [
    [15, 'red'], [45, 'orange'], [75, 'amber'], [105, 'lime'], [150, 'green'], [190, 'teal'],
    [225, 'cyan'], [268, 'blue'], [295, 'indigo'], [322, 'purple'], [350, 'pink'], [361, 'red'],
  ]
  return stops.find(([max]) => h < max)[1]
}
