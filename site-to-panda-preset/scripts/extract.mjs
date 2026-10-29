#!/usr/bin/env node
/**
 * extract.mjs — read a website's design language into structured data.
 *
 * Usage:
 *   node extract.mjs <url | path/to/file.html> --out <dir> [--width 1440] [--pages url2,url3] [--no-dark] [--no-shots]
 *
 * Writes into <dir>:
 *   analysis.json   clustered, ranked design signals (what you should read first)
 *   report.md       the same signals as compact tables (what you should read second)
 *   raw.json        everything collected, for digging when the report is ambiguous
 *   screenshots/    desktop / mobile / dark captures to look at with your own eyes
 *
 * Requires `playwright` (npm i -D playwright && npx playwright install chromium).
 */
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseBlocks, parseDecls, walk } from './lib/css-parse.mjs'
import { parseColor, toHex, oklch, distance, hueName } from './lib/color.mjs'

const require = createRequire(import.meta.url)
let chromium
try {
  ;({ chromium } = require('playwright'))
} catch {
  try {
    ;({ chromium } = require(require.resolve('playwright', { paths: [process.cwd()] })))
  } catch {
    console.error('Cannot load `playwright`. Install it:  npm i -D playwright && npx playwright install chromium')
    process.exit(2)
  }
}

// ───────────────────────────── args ─────────────────────────────
const argv = process.argv.slice(2)
const flag = (name, def) => {
  const i = argv.indexOf(`--${name}`)
  if (i < 0) return def
  const v = argv[i + 1]
  return v === undefined || v.startsWith('--') ? true : v
}
const target = argv.find((a, i) => !a.startsWith('--') && !(argv[i - 1] || '').startsWith('--'))
if (!target) {
  console.error('Usage: node extract.mjs <url|file.html> --out <dir> [--width 1440] [--pages a,b] [--no-dark] [--no-shots]')
  process.exit(1)
}
const outDir = path.resolve(flag('out', './s2p-out'))
const width = Number(flag('width', 1440))
const extraPages = String(flag('pages', '')).split(',').map((s) => s.trim()).filter(Boolean)
const wantDark = !argv.includes('--no-dark')
const wantShots = !argv.includes('--no-shots')
fs.mkdirSync(path.join(outDir, 'screenshots'), { recursive: true })

const isFile = !/^https?:\/\//i.test(target)
const toUrl = (t) => (/^https?:\/\//i.test(t) ? t : pathToFileURL(path.resolve(t)).href)

// ───────────────────── in-page collector (runs in the browser) ─────────────────────
function collect() {
  const MAX_ELEMENTS = 9000
  const cvs = document.createElement('canvas')
  cvs.width = cvs.height = 1
  const cx = cvs.getContext('2d', { willReadFrequently: true })
  const cache = new Map()
  const toRGBA = (str) => {
    if (!str) return null
    if (cache.has(str)) return cache.get(str)
    let out = null
    const m = str.match(/^rgba?\(([^)]+)\)$/)
    if (m) {
      const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat)
      out = [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]
    } else if (str === 'transparent') out = [0, 0, 0, 0]
    else {
      // lab()/oklch()/color()/color-mix() — let the canvas rasterise it to sRGB for us.
      cx.clearRect(0, 0, 1, 1)
      cx.fillStyle = '#000'
      cx.fillStyle = str
      cx.fillRect(0, 0, 1, 1)
      const d = cx.getImageData(0, 0, 1, 1).data
      out = [d[0], d[1], d[2], d[3] / 255]
    }
    cache.set(str, out)
    return out
  }
  const hex = (c) => {
    if (!c) return null
    const h = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
    return `#${h(c[0])}${h(c[1])}${h(c[2])}${c[3] < 0.999 ? h(c[3] * 255) : ''}`
  }
  const col = (s) => hex(toRGBA(s))
  const px = (v) => {
    const n = parseFloat(v)
    return Number.isFinite(n) ? Math.round(n * 100) / 100 : null
  }
  const bump = (map, key, w = 1) => {
    if (key === null || key === undefined || key === '') return
    map[key] = (map[key] || 0) + w
  }

  const root = document.documentElement
  const rootCS = getComputedStyle(root)
  const out = {
    meta: {
      title: document.title,
      lang: root.lang,
      rootFontSize: px(rootCS.fontSize),
      colorScheme: rootCS.colorScheme,
      themeColor: document.querySelector('meta[name=theme-color]')?.content || null,
      metaColorScheme: document.querySelector('meta[name=color-scheme]')?.content || null,
      htmlClass: root.className,
      htmlAttrs: Object.fromEntries([...root.attributes].filter((a) => a.name !== 'class' && a.name !== 'style').map((a) => [a.name, a.value])),
      bodyClass: document.body?.className || '',
      docHeight: Math.max(document.body?.scrollHeight || 0, root.scrollHeight),
      viewport: [innerWidth, innerHeight],
    },
    fontLinks: [...document.querySelectorAll('link[href*="fonts.googleapis"], link[href*="fonts.bunny"], link[href*="use.typekit"], link[href*="fonts.adobe"], link[href*="fontshare"]')].map((l) => l.href),
    loadedFonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => ({ family: f.family.replace(/["']/g, ''), weight: f.weight, style: f.style })),
    inlineStyles: [...document.querySelectorAll('style')].map((s) => s.textContent || ''),
    colors: { text: {}, bg: {}, bgArea: {}, border: {}, svgFill: {} },
    fonts: {},
    typeStyles: {},
    spacing: {},
    gaps: {},
    radii: {},
    shadows: {},
    textShadows: {},
    borders: {},
    transitions: {},
    durations: {},
    easings: {},
    zIndex: {},
    maxWidths: {},
    blur: {},
    opacity: {},
    components: { buttons: [], inputs: [], cards: [], links: [], badges: [], headings: [], chrome: [], misc: [] },
    counts: { elements: 0, visible: 0 },
  }

  const SKIP = new Set(['SCRIPT', 'STYLE', 'META', 'LINK', 'HEAD', 'TITLE', 'NOSCRIPT', 'BR', 'TEMPLATE', 'PATH', 'DEFS', 'G'])
  const all = [...document.querySelectorAll('body, body *')].slice(0, MAX_ELEMENTS)
  out.counts.elements = all.length
  let idSeq = 0
  const snap = (el, cs, r) => ({
    id: null,
    tag: el.tagName.toLowerCase(),
    cls: String(el.className?.baseVal ?? el.className ?? '').slice(0, 120),
    text: (el.innerText || el.value || el.placeholder || '').trim().replace(/\s+/g, ' ').slice(0, 40),
    w: Math.round(r.width),
    h: Math.round(r.height),
    bg: col(cs.backgroundColor),
    bgImage: cs.backgroundImage !== 'none' ? cs.backgroundImage.slice(0, 140) : null,
    color: col(cs.color),
    border: ['Top', 'Right', 'Bottom', 'Left']
      .map((s) => [px(cs[`border${s}Width`]), cs[`border${s}Style`], col(cs[`border${s}Color`])])
      .filter(([w, st]) => w > 0 && st !== 'none')
      .map(([w, st, c]) => `${w}px ${st} ${c}`)
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(' | ') || null,
    radius: cs.borderTopLeftRadius === cs.borderBottomRightRadius ? cs.borderTopLeftRadius : `${cs.borderTopLeftRadius} ${cs.borderTopRightRadius} ${cs.borderBottomRightRadius} ${cs.borderBottomLeftRadius}`,
    padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
    font: `${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily.split(',')[0].replace(/["']/g, '').trim()}`,
    letterSpacing: cs.letterSpacing !== 'normal' ? cs.letterSpacing : null,
    textTransform: cs.textTransform !== 'none' ? cs.textTransform : null,
    textDecoration: cs.textDecorationLine !== 'none' ? cs.textDecorationLine : null,
    shadow: cs.boxShadow !== 'none' ? cs.boxShadow : null,
    transition: parseFloat(cs.transitionDuration) > 0 ? `${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction}` : null,
    cursor: cs.cursor !== 'auto' ? cs.cursor : null,
    position: cs.position !== 'static' ? cs.position : null,
    backdrop: cs.backdropFilter !== 'none' ? cs.backdropFilter : null,
  })
  const sigOf = (s) => [s.bg, s.color, s.border, s.radius, s.padding, s.font, s.shadow].join('§')
  const addUnique = (list, s, max) => {
    const sig = sigOf(s)
    const hit = list.find((x) => x.sig === sig)
    if (hit) { hit.count++; return hit }
    if (list.length >= max) return null
    s.sig = sig
    s.count = 1
    list.push(s)
    return s
  }

  for (const el of all) {
    if (SKIP.has(el.tagName.toUpperCase())) continue
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden') continue
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) continue
    out.counts.visible++

    // direct text weight — colours and fonts are weighted by how many characters they actually colour
    let chars = 0
    for (const n of el.childNodes) if (n.nodeType === 3) chars += n.textContent.trim().length
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') chars += (el.value || el.placeholder || '').length

    const c = toRGBA(cs.color)
    if (chars > 0 && c && c[3] > 0) bump(out.colors.text, hex(c), chars)

    const bg = toRGBA(cs.backgroundColor)
    if (bg && bg[3] > 0.02) {
      bump(out.colors.bg, hex(bg), 1)
      bump(out.colors.bgArea, hex(bg), Math.min(r.width * r.height, 2_000_000))
    }
    for (const s of ['Top', 'Right', 'Bottom', 'Left']) {
      const w = px(cs[`border${s}Width`])
      if (w > 0 && cs[`border${s}Style`] !== 'none') {
        bump(out.colors.border, col(cs[`border${s}Color`]), 1)
        bump(out.borders, `${w}px ${cs[`border${s}Style`]}`, 1)
      }
    }
    if (el instanceof SVGElement && cs.fill && cs.fill !== 'none') bump(out.colors.svgFill, col(cs.fill), 1)

    if (chars > 0) {
      const fam = cs.fontFamily
      bump(out.fonts, fam, chars)
      const fs = px(cs.fontSize)
      const lhPx = cs.lineHeight === 'normal' ? null : px(cs.lineHeight)
      const lh = lhPx && fs ? Math.round((lhPx / fs) * 1000) / 1000 : 'normal'
      const ls = cs.letterSpacing === 'normal' ? 0 : px(cs.letterSpacing)
      const lsEm = fs && ls ? Math.round((ls / fs) * 1000) / 1000 : 0
      const key = [fam.split(',')[0].replace(/["']/g, '').trim(), fs, cs.fontWeight, lh, lsEm, cs.textTransform, cs.fontStyle].join('|')
      const t = (out.typeStyles[key] ||= { family: fam.split(',')[0].replace(/["']/g, '').trim(), size: fs, weight: cs.fontWeight, lineHeight: lh, letterSpacingEm: lsEm, transform: cs.textTransform, italic: cs.fontStyle === 'italic', chars: 0, count: 0, tags: {}, sample: '', colors: {}, minY: Infinity })
      t.chars += chars
      t.count++
      bump(t.tags, el.tagName.toLowerCase(), 1)
      bump(t.colors, hex(c), chars)
      const y = r.top + scrollY
      if (!t.sample || (y < t.minY && chars > 3)) { t.sample = (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 50); t.minY = y }
    }

    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      const p = px(cs[`padding${side}`])
      if (p > 0) bump(out.spacing, p, 1)
      const m = px(cs[`margin${side}`])
      if (m !== null && cs[`margin${side}`] !== 'auto' && m !== 0) bump(out.spacing, Math.abs(m), 1)
    }
    if (cs.display.includes('flex') || cs.display.includes('grid')) {
      for (const g of [cs.rowGap, cs.columnGap]) if (g && g !== 'normal') { const v = px(g); if (v > 0) bump(out.gaps, v, 1) }
    }
    for (const k of ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius']) {
      const v = cs[k]
      if (v && v !== '0px') bump(out.radii, v, 1)
    }
    if (cs.boxShadow !== 'none') bump(out.shadows, cs.boxShadow, 1)
    if (cs.textShadow !== 'none') bump(out.textShadows, cs.textShadow, 1)
    if (parseFloat(cs.transitionDuration) > 0) {
      bump(out.transitions, `${cs.transitionProperty} | ${cs.transitionDuration} | ${cs.transitionTimingFunction}`, 1)
      for (const d of cs.transitionDuration.split(',')) bump(out.durations, d.trim(), 1)
      for (const e of cs.transitionTimingFunction.split(/,(?![^(]*\))/)) bump(out.easings, e.trim(), 1)
    }
    if (cs.zIndex !== 'auto') bump(out.zIndex, cs.zIndex, 1)
    if (cs.maxWidth !== 'none' && cs.maxWidth.endsWith('px')) bump(out.maxWidths, cs.maxWidth, 1)
    if (cs.backdropFilter !== 'none') bump(out.blur, `backdrop ${cs.backdropFilter}`, 1)
    if (cs.filter !== 'none') bump(out.blur, `filter ${cs.filter}`, 1)
    if (cs.opacity !== '1') bump(out.opacity, cs.opacity, 1)

    // ── component sampling ──
    const tag = el.tagName
    const role = el.getAttribute('role')
    const clsStr = String(el.className?.baseVal ?? el.className ?? '')
    const looksButton = tag === 'BUTTON' || role === 'button' || (tag === 'INPUT' && ['submit', 'button'].includes(el.type)) || (tag === 'A' && /(^|[\s_-])(btn|button|cta)([\s_-]|$)/i.test(clsStr))
    if (looksButton) {
      const s = snap(el, cs, r)
      const hit = addUnique(out.components.buttons, s, 10)
      if (hit && hit.count === 1) { hit.id = `s2p-${idSeq++}`; el.setAttribute('data-s2p', hit.id) }
    } else if (tag === 'INPUT' && !['checkbox', 'radio', 'hidden', 'submit', 'button', 'range', 'file'].includes(el.type) || tag === 'TEXTAREA' || tag === 'SELECT') {
      const s = snap(el, cs, r)
      const hit = addUnique(out.components.inputs, s, 4)
      if (hit && hit.count === 1) { hit.id = `s2p-${idSeq++}`; el.setAttribute('data-s2p', hit.id); hit.placeholder = el.placeholder || null }
    } else if (tag === 'A' && chars > 0) {
      const s = snap(el, cs, r)
      const hit = addUnique(out.components.links, s, 4)
      if (hit && hit.count === 1) { hit.id = `s2p-${idSeq++}`; el.setAttribute('data-s2p', hit.id) }
    } else if (/^H[1-6]$/.test(tag)) {
      const s = snap(el, cs, r)
      s.margin = `${cs.marginTop} ${cs.marginBottom}`
      if (!out.components.headings.find((h) => h.tag === s.tag)) out.components.headings.push(s)
    } else if (['HEADER', 'NAV', 'FOOTER', 'ASIDE'].includes(tag) || (tag === 'MAIN')) {
      const s = snap(el, cs, r)
      if (out.components.chrome.length < 8) out.components.chrome.push(s)
    }
    // cards: surfaces with a visible edge (border or shadow or radius+bg) holding text
    const hasEdge = (bg && bg[3] > 0.5 && px(cs.borderTopLeftRadius) > 0) || cs.boxShadow !== 'none' || px(cs.borderTopWidth) > 0
    if (!looksButton && tag !== 'A' && tag !== 'INPUT' && hasEdge && r.width >= 180 && r.width <= 760 && r.height >= 70 && el.innerText && el.innerText.length > 20 && r.width < innerWidth * 0.95) {
      addUnique(out.components.cards, snap(el, cs, r), 6)
    }
    // badges / chips: tiny filled things with short text
    if (!looksButton && chars > 0 && chars <= 24 && r.height <= 34 && r.height >= 14 && bg && bg[3] > 0.05 && tag !== 'A' && tag !== 'INPUT' && px(cs.borderTopLeftRadius) > 0) {
      addUnique(out.components.badges, snap(el, cs, r), 4)
    }
  }

  const bodyCS = getComputedStyle(document.body)
  out.page = {
    bodyBg: col(bodyCS.backgroundColor),
    htmlBg: col(rootCS.backgroundColor),
    bodyColor: col(bodyCS.color),
    bodyFont: bodyCS.fontFamily,
    bodyFontSize: bodyCS.fontSize,
    bodyLineHeight: bodyCS.lineHeight,
    selection: null,
    scrollbar: rootCS.scrollbarColor,
    accentColor: rootCS.accentColor,
    caretColor: col(bodyCS.caretColor),
  }
  // effective page background = first non-transparent from body → html → white
  const first = [out.page.bodyBg, out.page.htmlBg].find((x) => x && !/^#[0-9a-f]{6}00$/.test(x) && toRGBA(x)[3] > 0.01)
  out.page.effectiveBg = first || '#ffffff'

  // keyframe + custom-property readout through CSSOM (same-origin sheets only; Node re-parses raw CSS for the rest)
  out.varNames = []
  try {
    const names = new Set()
    for (const sheet of document.styleSheets) {
      let rules
      try { rules = sheet.cssRules } catch { continue }
      const visit = (rs) => {
        for (const rule of rs) {
          if (rule.style) for (const p of rule.style) if (p.startsWith('--')) names.add(p)
          if (rule.cssRules) visit(rule.cssRules)
        }
      }
      visit(rules)
    }
    out.varNames = [...names]
  } catch {}
  return out
}

// Read a list of custom properties as resolved by the browser (var() chains already substituted).
function readVars(names) {
  const root = document.documentElement
  const cs = getComputedStyle(root)
  const probe = document.createElement('span')
  probe.style.display = 'none'
  document.body.appendChild(probe)
  const cvs = document.createElement('canvas'); cvs.width = cvs.height = 1
  const cx = cvs.getContext('2d', { willReadFrequently: true })
  const toHex = (str) => {
    cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = str; cx.fillRect(0, 0, 1, 1)
    const d = cx.getImageData(0, 0, 1, 1).data
    const h = (n) => n.toString(16).padStart(2, '0')
    return `#${h(d[0])}${h(d[1])}${h(d[2])}${d[3] < 255 ? h(d[3]) : ''}`
  }
  const res = {}
  for (const n of names) {
    const raw = cs.getPropertyValue(n).trim()
    if (!raw) continue
    let color = null
    let candidate = raw
    // shadcn-style bare triplets: "222.2 47.4% 11.2%"  →  hsl(...)
    if (/^[\d.]+(deg)?\s+[\d.]+%\s+[\d.]+%(\s*\/\s*[\d.%]+)?$/.test(raw)) candidate = `hsl(${raw})`
    else if (/^\d{1,3}\s+\d{1,3}\s+\d{1,3}$/.test(raw)) candidate = `rgb(${raw})`
    probe.style.color = ''
    probe.style.color = candidate
    if (probe.style.color !== '' && !/^(inherit|initial|unset|revert|currentcolor)$/i.test(raw)) color = toHex(candidate)
    res[n] = { raw, color }
  }
  probe.remove()
  return res
}

// ───────────────────────── Node-side CSS text analysis ─────────────────────────
function analyseCss(cssTexts) {
  const vars = { light: {}, dark: {}, scoped: {} }
  const media = { min: {}, max: {}, other: {} }
  const fontFaces = []
  const keyframes = {}
  const containers = []
  const imports = []
  const rootish = /^(:root|html|body|\*|:host|\[data-theme=["']?light["']?\]|\.light)(\s*,\s*(:root|html|body|\*|:host))*$/i
  const darkish = /(\.dark|\.theme-dark|\.dark-mode|\.night|\[data-(?:theme|mode|bs-theme|color-mode|color-scheme)=["']?dark["']?\]|\[theme=["']?dark["']?\]|:root\.dark|html\.dark|\.chakra-ui-dark|\.is-dark|\[data-dark\])/i
  const darkSelectors = new Set()

  for (const css of cssTexts) {
    const tree = parseBlocks(css)
    walk(tree, (n, ctx) => {
      if (n.statement && /^@import/i.test(n.prelude)) imports.push(n.prelude)
      const inDarkMedia = ctx.some((c) => /prefers-color-scheme\s*:\s*dark/i.test(c))
      if (/^@media/i.test(n.prelude)) {
        for (const m of n.prelude.matchAll(/\((min|max)-width\s*:\s*([\d.]+)(px|em|rem)\)/gi)) {
          const px = Number(m[2]) * (m[3] === 'px' ? 1 : 16)
          const bucket = m[1].toLowerCase() === 'min' ? media.min : media.max
          bucket[px] = (bucket[px] || 0) + 1
        }
        for (const m of n.prelude.matchAll(/(prefers-[a-z-]+|hover|pointer|orientation|forced-colors|print)/gi)) media.other[m[1]] = (media.other[m[1]] || 0) + 1
        // range syntax: (width >= 768px)
        for (const m of n.prelude.matchAll(/\(\s*width\s*(>=|>|<=|<)\s*([\d.]+)(px|em|rem)\s*\)/gi)) {
          const px = Number(m[2]) * (m[3] === 'px' ? 1 : 16)
          const bucket = m[1].startsWith('>') ? media.min : media.max
          bucket[px] = (bucket[px] || 0) + 1
        }
      }
      if (/^@container/i.test(n.prelude)) containers.push(n.prelude)
      if (/^@font-face/i.test(n.prelude)) {
        const d = Object.fromEntries(parseDecls(n.body).map((x) => [x.prop.toLowerCase(), x.value]))
        fontFaces.push({
          family: (d['font-family'] || '').replace(/["']/g, ''),
          weight: d['font-weight'] || '400',
          style: d['font-style'] || 'normal',
          display: d['font-display'] || null,
          src: [...(d.src || '').matchAll(/url\(["']?([^)"']+)["']?\)\s*(?:format\(["']?([^)"']+)["']?\))?/g)].map((m) => `${m[1].split('?')[0].split('/').pop()}${m[2] ? ` (${m[2]})` : ''}`).slice(0, 3),
          unicodeRange: Boolean(d['unicode-range']),
        })
      }
      if (/^@keyframes/i.test(n.prelude)) keyframes[n.prelude.replace(/^@keyframes\s+/i, '')] = true
      if (n.body && !n.prelude.startsWith('@')) {
        const decls = parseDecls(n.body).filter((d) => d.prop.startsWith('--'))
        if (!decls.length) return
        const sel = n.prelude
        const isRoot = sel.split(',').every((s) => rootish.test(s.trim()))
        const isDark = inDarkMedia || darkish.test(sel)
        for (const d of decls) {
          if (isDark && (isRoot || darkish.test(sel) || inDarkMedia)) {
            vars.dark[d.prop] = d.value
            if (darkish.test(sel)) darkSelectors.add(sel.split(',').find((s) => darkish.test(s)).trim())
          } else if (isRoot) vars.light[d.prop] = d.value
          else (vars.scoped[d.prop] ||= []).push(sel.slice(0, 60))
        }
      }
    })
  }
  return { vars, media, fontFaces, keyframes: Object.keys(keyframes), containers: [...new Set(containers)].slice(0, 6), imports: imports.slice(0, 8), darkSelectors: [...darkSelectors].slice(0, 6) }
}

// ─────────────────────────────── analysis ───────────────────────────────
const sortedEntries = (map) => Object.entries(map || {}).sort((a, b) => b[1] - a[1])
const num = (s) => parseFloat(s)

function clusterColors(raw, pageBg) {
  const merged = {}
  const roles = ['text', 'bg', 'bgArea', 'border', 'svgFill']
  for (const r of roles) for (const [h, w] of Object.entries(raw.colors[r] || {})) {
    merged[h] ||= { hex: h, text: 0, bgCount: 0, bgArea: 0, border: 0, svg: 0 }
    const k = { text: 'text', bg: 'bgCount', bgArea: 'bgArea', border: 'border', svgFill: 'svg' }[r]
    merged[h][k] += w
  }
  // interactive weights
  const interactive = {}
  for (const b of raw.components.buttons) { if (b.bg) interactive[b.bg] = (interactive[b.bg] || 0) + b.count; if (b.color) interactive[b.color] = (interactive[b.color] || 0) + b.count * 0.3 }
  for (const l of raw.components.links) if (l.color) interactive[l.color] = (interactive[l.color] || 0) + l.count
  for (const h of Object.keys(interactive)) { merged[h] ||= { hex: h, text: 0, bgCount: 0, bgArea: 0, border: 0, svg: 0 }; merged[h].interactive = interactive[h] }

  const items = Object.values(merged).filter((c) => (parseColor(c.hex)?.[3] ?? 0) > 0.02).map((c) => {
    const rgba = parseColor(c.hex)
    const lch = oklch(rgba)
    // weight = how much of the page this colour is responsible for
    const weight = c.text / 20 + c.bgCount * 2 + c.bgArea / 20000 + c.border + c.svg + (c.interactive || 0) * 25
    return { ...c, rgba, L: +lch.L.toFixed(3), C: +lch.C.toFixed(3), h: Math.round(lch.h), weight: Math.round(weight) }
  })
  items.sort((a, b) => b.weight - a.weight)

  const clusters = []
  for (const it of items) {
    if (it.rgba[3] < 0.999) { clusters.push({ ...it, members: [], alpha: +it.rgba[3].toFixed(3) }); continue }
    const home = clusters.find((c) => c.rgba[3] >= 0.999 && distance(c.rgba, it.rgba) < 0.9)
    if (home) {
      home.members.push(it.hex)
      for (const k of ['text', 'bgCount', 'bgArea', 'border', 'svg', 'weight']) home[k] += it[k]
      home.interactive = (home.interactive || 0) + (it.interactive || 0)
    } else clusters.push({ ...it, members: [] })
  }
  clusters.sort((a, b) => b.weight - a.weight)
  return clusters.map(({ rgba, ...c }) => ({
    ...c,
    // chroma < 0.045 reads as grey to the eye even when tinted (ink-navy, warm paper); keep the tint as a hint
    kind: c.C < 0.045 ? 'neutral' : 'chromatic',
    hue: c.C < 0.045 ? null : hueName(c.h),
    tint: c.C >= 0.012 && c.C < 0.045 ? hueName(c.h) : null,
    isPageBg: pageBg ? distance(parseColor(pageBg), rgba) < 0.9 : false,
  }))
}

function detectBase(spacingMap) {
  const entries = Object.entries(spacingMap).map(([v, w]) => [Number(v), w])
  const total = entries.reduce((a, [, w]) => a + w, 0) || 1
  const res = {}
  for (const base of [2, 4, 5, 6, 8]) {
    const hit = entries.filter(([v]) => Math.abs(v / base - Math.round(v / base)) < 0.02).reduce((a, [, w]) => a + w, 0)
    res[base] = +(hit / total).toFixed(3)
  }
  // prefer the largest base that still explains ≥ 85% of usage
  const chosen = [8, 6, 5, 4, 2].find((b) => res[b] >= 0.85) || 4
  return { coverageByBase: res, suggested: chosen }
}

function analyse(raw, cssInfo, varsLight, varsDark, darkInfo) {
  const rootPx = raw.meta.rootFontSize || 16
  const a = {}
  a.meta = { ...raw.meta, darkStrategy: darkInfo.strategy, darkSelector: darkInfo.selector, darkChangedBg: darkInfo.changedBg }

  const pageBg = raw.page.effectiveBg
  a.colors = clusterColors(raw, pageBg)
  a.pageBg = pageBg
  a.pageText = raw.page.bodyColor
  const dark = darkInfo.raw
  if (dark) {
    a.darkColors = clusterColors(dark, dark.page.effectiveBg)
    a.darkPageBg = dark.page.effectiveBg
    a.darkPageText = dark.page.bodyColor
  }

  // fonts
  const famWeight = {}
  for (const [fam, w] of sortedEntries(raw.fonts)) {
    const first = fam.split(',')[0].replace(/["']/g, '').trim()
    famWeight[first] = famWeight[first] || { family: first, stack: fam, chars: 0 }
    famWeight[first].chars += w
  }
  a.fontFamilies = Object.values(famWeight).sort((x, y) => y.chars - x.chars)
  a.fontFaces = cssInfo.fontFaces
  a.fontLinks = raw.fontLinks
  a.loadedFonts = raw.loadedFonts

  // type styles
  const ts = Object.values(raw.typeStyles).sort((x, y) => y.chars - x.chars)
  a.typeStyles = ts.slice(0, 30).map((t) => ({
    family: t.family, size: t.size, rem: +(t.size / rootPx).toFixed(4), weight: t.weight, lineHeight: t.lineHeight, letterSpacingEm: t.letterSpacingEm,
    transform: t.transform !== 'none' ? t.transform : null, italic: t.italic || null, chars: t.chars, count: t.count,
    tags: Object.entries(t.tags).sort((x, y) => y[1] - x[1]).slice(0, 3).map(([k]) => k).join(','), sample: t.sample,
    topColor: sortedEntries(t.colors)[0]?.[0] || null,
  }))
  const sizes = {}
  for (const t of ts) sizes[t.size] = (sizes[t.size] || 0) + t.chars
  a.fontSizes = sortedEntries(sizes).map(([s, chars]) => ({ px: Number(s), rem: +(Number(s) / rootPx).toFixed(4), chars })).sort((x, y) => x.px - y.px)
  const weights = {}
  for (const t of ts) weights[t.weight] = (weights[t.weight] || 0) + t.chars
  a.fontWeights = sortedEntries(weights).map(([w, chars]) => ({ weight: Number(w), chars }))
  const lhs = {}
  for (const t of ts) lhs[t.lineHeight] = (lhs[t.lineHeight] || 0) + t.chars
  a.lineHeights = sortedEntries(lhs).map(([v, chars]) => ({ value: v, chars })).slice(0, 10)
  const lss = {}
  for (const t of ts) lss[t.letterSpacingEm] = (lss[t.letterSpacingEm] || 0) + t.chars
  a.letterSpacings = sortedEntries(lss).map(([v, chars]) => ({ em: Number(v), chars })).slice(0, 8)
  // modular-scale ratio guess from consecutive heavy sizes
  const ordered = a.fontSizes.filter((s) => s.chars > 30).map((s) => s.px)
  const ratios = ordered.slice(1).map((v, i) => v / ordered[i]).filter((r) => r > 1.05 && r < 2)
  a.typeScaleRatioGuess = ratios.length ? +(ratios.reduce((x, y) => x + y, 0) / ratios.length).toFixed(3) : null

  // spacing
  const merged = { ...raw.spacing }
  for (const [k, v] of Object.entries(raw.gaps)) merged[k] = (merged[k] || 0) + v * 2
  a.spacing = sortedEntries(merged).map(([v, n]) => ({ px: Number(v), rem: +(Number(v) / rootPx).toFixed(4), count: n })).sort((x, y) => x.px - y.px)
  a.spacingBase = detectBase(merged)
  a.spacingTop = sortedEntries(merged).slice(0, 18).map(([v, n]) => ({ px: Number(v), count: n })).sort((x, y) => x.px - y.px)

  // radii
  a.radii = sortedEntries(raw.radii).map(([v, n]) => ({ value: v, count: n })).sort((x, y) => (num(x.value) || 0) - (num(y.value) || 0))
  // shadows: tier by "size" so they can be named elevation 1..n
  const shadowSize = (s) => [...s.matchAll(/(-?[\d.]+)px/g)].map((m) => Math.abs(Number(m[1]))).slice(0, 4).reduce((x, y) => x + y, 0)
  a.shadows = sortedEntries(raw.shadows).map(([v, n]) => ({ value: v, count: n, size: shadowSize(v) })).sort((x, y) => x.size - y.size)
  a.textShadows = sortedEntries(raw.textShadows).slice(0, 4)
  a.borders = sortedEntries(raw.borders).slice(0, 6)
  a.transitions = sortedEntries(raw.transitions).slice(0, 8).map(([v, n]) => ({ value: v, count: n }))
  a.durations = sortedEntries(raw.durations).slice(0, 8).map(([v, n]) => ({ value: v, count: n }))
  a.easings = sortedEntries(raw.easings).slice(0, 6).map(([v, n]) => ({ value: v, count: n }))
  a.zIndex = sortedEntries(raw.zIndex).map(([v, n]) => ({ value: Number(v), count: n })).sort((x, y) => x.value - y.value)
  a.maxWidths = sortedEntries(raw.maxWidths).slice(0, 8).map(([v, n]) => ({ value: v, count: n }))
  a.blur = sortedEntries(raw.blur).slice(0, 5)
  a.opacity = sortedEntries(raw.opacity).slice(0, 6)

  // breakpoints
  const bp = {}
  for (const [k, n] of Object.entries(cssInfo.media.min)) bp[k] = (bp[k] || 0) + n
  const maxBp = Object.entries(cssInfo.media.max).map(([k, n]) => ({ px: Number(k) + 1, count: n }))
  a.breakpoints = {
    minWidth: sortedEntries(bp).map(([k, n]) => ({ px: Number(k), count: n })).sort((x, y) => x.px - y.px),
    maxWidthPlus1: maxBp.sort((x, y) => x.px - y.px),
    features: cssInfo.media.other,
    containerQueries: cssInfo.containers,
  }
  a.keyframes = cssInfo.keyframes
  a.cssImports = cssInfo.imports

  // css variables the site itself defines (the highest-quality hint about intended token names)
  const toList = (defs, resolved) => Object.entries(defs).map(([name, value]) => ({ name, value, resolved: resolved?.[name]?.raw ?? null, color: resolved?.[name]?.color ?? null }))
  a.cssVars = {
    light: toList(cssInfo.vars.light, varsLight),
    dark: toList(cssInfo.vars.dark, varsDark),
    count: { light: Object.keys(cssInfo.vars.light).length, dark: Object.keys(cssInfo.vars.dark).length, scoped: Object.keys(cssInfo.vars.scoped).length },
    darkSelectors: cssInfo.darkSelectors,
  }
  const names = [...Object.keys(cssInfo.vars.light), ...Object.keys(cssInfo.vars.scoped)]
  a.frameworkHints = [
    names.some((n) => n.startsWith('--tw-')) && 'tailwind',
    names.some((n) => n.startsWith('--bs-')) && 'bootstrap',
    names.some((n) => n.startsWith('--chakra-')) && 'chakra-ui',
    names.some((n) => n.startsWith('--radix-') || /^--(accent|gray)-\d+$/.test(n)) && 'radix-colors',
    names.some((n) => ['--background', '--foreground', '--primary', '--muted', '--card'].includes(n)) && 'shadcn-style semantic vars',
    names.some((n) => n.startsWith('--mantine-')) && 'mantine',
    names.some((n) => n.startsWith('--md-sys-')) && 'material-3',
    names.some((n) => n.startsWith('--ds-') || n.startsWith('--atlassian')) && 'atlassian-ds',
  ].filter(Boolean)

  a.components = {}
  for (const [k, v] of Object.entries(raw.components)) a.components[k] = v.map(({ sig, ...rest }) => rest)
  a.page = raw.page
  return a
}

// ─────────────────────────────── report ───────────────────────────────
function table(headers, rows) {
  if (!rows.length) return '_none_\n'
  return `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${rows.map((r) => `| ${r.map((c) => String(c ?? '').replace(/\|/g, '\\|')).join(' | ')} |`).join('\n')}\n`
}
function report(a, target) {
  const L = []
  L.push(`# Design extraction — ${a.meta.title || target}\n`)
  L.push(`Source: ${target}  \nRoot font-size: **${a.meta.rootFontSize}px** (rem = px / ${a.meta.rootFontSize})  \nElements sampled: ${a.meta.viewport?.join('×')} viewport, theme-color: ${a.meta.themeColor ?? '—'}  \nFramework hints: ${a.frameworkHints.join(', ') || '—'}\n`)
  L.push(`Dark mode: **${a.meta.darkStrategy || 'not detected'}**${a.meta.darkSelector ? ` → condition selector \`${a.meta.darkSelector}\`` : ''}${a.meta.darkChangedBg ? ` (page bg ${a.pageBg} → ${a.darkPageBg})` : ''}\n`)

  L.push('## 1. Colours (clustered, light mode)\nweight = text chars/20 + bg count×2 + bg area/20000 + borders + interactive×25. `members` are near-duplicates merged into the cluster.\n')
  L.push(table(['hex', 'kind', 'hue', 'OKLCH L/C/h', 'text', 'bg×', 'bg area', 'border', 'interactive', 'weight', 'notes'], a.colors.slice(0, 36).map((c) => [c.hex, c.kind, c.hue ?? (c.tint ? `(${c.tint} tint)` : ''), `${c.L}/${c.C}/${c.h}`, c.text, c.bgCount, Math.round(c.bgArea / 1000) + 'k', c.border, Math.round(c.interactive || 0), c.weight, [c.isPageBg && 'PAGE BG', c.alpha && `alpha ${c.alpha}`, c.members.length && `+${c.members.length} near`].filter(Boolean).join(', ')])))
  if (a.darkColors) {
    L.push('\n## 1b. Colours (dark mode)\n')
    L.push(table(['hex', 'kind', 'hue', 'OKLCH L/C/h', 'text', 'bg×', 'weight', 'notes'], a.darkColors.slice(0, 24).map((c) => [c.hex, c.kind, c.hue ?? (c.tint ? `(${c.tint} tint)` : ''), `${c.L}/${c.C}/${c.h}`, c.text, c.bgCount, c.weight, c.isPageBg ? 'PAGE BG' : ''])))
  }

  L.push('\n## 2. CSS variables the site defines itself\nThese are the site authors\' own token names — reuse their naming where it is sensible.\n')
  L.push(`light/root: ${a.cssVars.count.light}, dark: ${a.cssVars.count.dark}, component-scoped: ${a.cssVars.count.scoped}\n`)
  L.push(table(['name', 'declared', 'resolved', 'colour'], a.cssVars.light.slice(0, 120).map((v) => [v.name, v.value.slice(0, 70), (v.resolved || '').slice(0, 40), v.color || ''])))
  if (a.cssVars.dark.length) {
    L.push('\nDark overrides:\n')
    L.push(table(['name', 'declared', 'colour'], a.cssVars.dark.slice(0, 80).map((v) => [v.name, v.value.slice(0, 70), v.color || ''])))
  }

  L.push('\n## 3. Typography\n')
  L.push('Font families by characters coloured:\n')
  L.push(table(['family', 'chars', 'full stack'], a.fontFamilies.slice(0, 6).map((f) => [f.family, f.chars, f.stack.slice(0, 110)])))
  if (a.fontFaces.length) L.push('\n@font-face declared:\n' + table(['family', 'weight', 'style', 'display', 'files'], a.fontFaces.slice(0, 14).map((f) => [f.family, f.weight, f.style, f.display ?? '', f.src.join(', ')])))
  if (a.fontLinks.length) L.push('\nWebfont links: ' + a.fontLinks.map((l) => `\`${l}\``).join(', ') + '\n')
  L.push('\nType styles actually rendered (most-used first) — the raw material for `textStyles`:\n')
  L.push(table(['family', 'size px', 'rem', 'weight', 'line-h', 'tracking em', 'transform', 'tags', 'chars', 'sample'], a.typeStyles.slice(0, 22).map((t) => [t.family, t.size, t.rem, t.weight, t.lineHeight, t.letterSpacingEm || '', t.transform || '', t.tags, t.chars, t.sample.slice(0, 32)])))
  L.push(`\nDistinct font sizes (px): ${a.fontSizes.map((s) => s.px).join(', ')}  \nModular-ratio guess: ${a.typeScaleRatioGuess ?? 'n/a'}  \nWeights: ${a.fontWeights.map((w) => `${w.weight}(${w.chars})`).join(', ')}  \nLine-heights: ${a.lineHeights.map((l) => l.value).join(', ')}  \nLetter-spacings (em): ${a.letterSpacings.map((l) => l.em).join(', ')}\n`)

  L.push('\n## 4. Spacing\n')
  L.push(`Detected base unit: **${a.spacingBase.suggested}px** (share of usage explained: ${Object.entries(a.spacingBase.coverageByBase).map(([b, s]) => `${b}px→${Math.round(s * 100)}%`).join(', ')})\n`)
  L.push('Most-used values (px × count): ' + a.spacingTop.map((s) => `${s.px}×${s.count}`).join(', ') + '\n')
  L.push('Max-widths (containers): ' + a.maxWidths.map((m) => `${m.value}×${m.count}`).join(', ') + '\n')

  L.push('\n## 5. Radii, borders, shadows, effects\n')
  L.push('Radii: ' + a.radii.map((r) => `${r.value}×${r.count}`).join(', ') + '\n')
  L.push('\nBorders: ' + a.borders.map(([k, n]) => `${k}×${n}`).join(', ') + '\n')
  L.push('\nShadows, smallest → largest:\n' + table(['value', 'count'], a.shadows.slice(0, 10).map((s) => [s.value, s.count])))
  if (a.blur.length) L.push('\nBlur/backdrop: ' + a.blur.map(([k, n]) => `${k}×${n}`).join(', ') + '\n')
  L.push('\nOpacity: ' + (a.opacity.map(([k, n]) => `${k}×${n}`).join(', ') || '—') + '\n')

  L.push('\n## 6. Motion\n')
  L.push('Durations: ' + a.durations.map((d) => `${d.value}×${d.count}`).join(', ') + '\n')
  L.push('\nEasings: ' + a.easings.map((d) => `${d.value}×${d.count}`).join(', ') + '\n')
  L.push('\nTransitions: ' + a.transitions.slice(0, 5).map((d) => `\`${d.value}\`×${d.count}`).join(', ') + '\n')
  L.push('\nKeyframes: ' + (a.keyframes.join(', ') || '—') + '\n')

  L.push('\n## 7. Breakpoints & z-index\n')
  L.push('min-width queries (px×count): ' + (a.breakpoints.minWidth.map((b) => `${b.px}×${b.count}`).join(', ') || '—') + '\n')
  L.push('\nmax-width queries + 1 (px×count): ' + (a.breakpoints.maxWidthPlus1.map((b) => `${b.px}×${b.count}`).join(', ') || '—') + '\n')
  L.push('\nOther media features: ' + (Object.keys(a.breakpoints.features).join(', ') || '—') + (a.breakpoints.containerQueries.length ? `  \nContainer queries: ${a.breakpoints.containerQueries.join(' ; ')}` : '') + '\n')
  L.push('\nz-index: ' + (a.zIndex.map((z) => `${z.value}×${z.count}`).join(', ') || '—') + '\n')

  L.push('\n## 8. Component samples (computed styles; state diffs under `states`)\n')
  const compCols = ['tag', 'text', 'w×h', 'bg', 'color', 'border', 'radius', 'padding', 'font', 'shadow', 'transition']
  const row = (c) => [c.tag, c.text, `${c.w}×${c.h}`, c.bg, c.color, c.border, c.radius, c.padding, c.font, c.shadow ? c.shadow.slice(0, 50) : '', c.transition ? c.transition.slice(0, 50) : '']
  for (const [name, list] of Object.entries(a.components)) {
    if (!list.length) continue
    L.push(`\n### ${name}\n`)
    L.push(table(compCols, list.map(row)))
    for (const c of list) if (c.states && Object.keys(c.states).length) L.push(`- \`${c.text || c.tag}\` states: ${Object.entries(c.states).map(([s, d]) => `**${s}** ${Object.entries(d).map(([k, v]) => `${k}→${v}`).join('; ')}`).join(' · ')}\n`)
  }
  return L.join('\n')
}

// ───────────────────────────────── main ─────────────────────────────────
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'no-preference', colorScheme: 'light' })
const page = await ctx.newPage()

const cssTexts = []
const seen = new Set()
page.on('response', async (res) => {
  try {
    const type = res.request().resourceType()
    const ct = res.headers()['content-type'] || ''
    if (type === 'stylesheet' || ct.includes('text/css')) {
      const t = await res.text()
      if (!seen.has(t)) { seen.add(t); cssTexts.push(t) }
    }
  } catch {}
})

async function load(url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 })
  } catch (e) {
    try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }) } catch (e2) {
      console.error(`Cannot open ${url}: ${e2.message.split('\n')[0]}`)
      if (!isFile) console.error('If the sandbox blocks this site, open it with a browser tool / save the page (HTML + CSS) locally and pass the file path instead.')
      await browser.close()
      process.exit(3)
    }
  }
  // trigger lazy content: scroll through the page, then return to top
  await page.evaluate(async () => {
    const h = Math.min(document.documentElement.scrollHeight, 12000)
    for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)) }
    window.scrollTo(0, 0)
  })
  await page.evaluate(() => document.fonts?.ready)
  await page.waitForTimeout(400)
}

await load(toUrl(target))

// pull stylesheet text for file:// pages (response events are unreliable there) and inline <style>
if (isFile) {
  const html = fs.readFileSync(path.resolve(target), 'utf8')
  for (const m of html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)) {
    const href = m[0].match(/href=["']([^"']+)["']/i)?.[1]
    if (!href || /^https?:/i.test(href)) continue
    const p = path.resolve(path.dirname(path.resolve(target)), href.split('?')[0])
    if (fs.existsSync(p)) { const t = fs.readFileSync(p, 'utf8'); if (!seen.has(t)) { seen.add(t); cssTexts.push(t) } }
  }
}

let raw = await page.evaluate(collect)
for (const t of raw.inlineStyles) if (!seen.has(t)) { seen.add(t); cssTexts.push(t) }
delete raw.inlineStyles

// optional extra pages: merge their frequency maps (cheap way to cover pricing/docs/blog templates)
for (const extra of extraPages) {
  try {
    await load(toUrl(extra))
    const r2 = await page.evaluate(collect)
    for (const t of r2.inlineStyles) if (!seen.has(t)) { seen.add(t); cssTexts.push(t) }
    const mergeMap = (a, b) => { for (const [k, v] of Object.entries(b)) a[k] = (a[k] || 0) + v }
    for (const k of ['text', 'bg', 'bgArea', 'border', 'svgFill']) mergeMap(raw.colors[k], r2.colors[k])
    for (const k of ['fonts', 'spacing', 'gaps', 'radii', 'shadows', 'textShadows', 'borders', 'transitions', 'durations', 'easings', 'zIndex', 'maxWidths', 'blur', 'opacity']) mergeMap(raw[k], r2[k])
    for (const [k, t] of Object.entries(r2.typeStyles)) { if (raw.typeStyles[k]) { raw.typeStyles[k].chars += t.chars; raw.typeStyles[k].count += t.count } else raw.typeStyles[k] = t }
  } catch (e) { console.warn(`skip extra page ${extra}: ${e.message.split('\n')[0]}`) }
}
if (extraPages.length) { await load(toUrl(target)); raw = Object.assign(raw, { meta: raw.meta }) }

const cssInfo = analyseCss(cssTexts)
const allVarNames = [...new Set([...Object.keys(cssInfo.vars.light), ...Object.keys(cssInfo.vars.dark), ...raw.varNames])]
const varsLight = await page.evaluate(readVars, allVarNames)

// re-tag components (extra-page loads may have replaced the DOM) and capture hover/focus states
async function captureStates() {
  for (const group of ['buttons', 'links', 'inputs']) {
    const list = raw.components[group]
    for (const comp of list.slice(0, group === 'buttons' ? 5 : 2)) {
      if (!comp.id) continue
      const sel = `[data-s2p="${comp.id}"]`
      const el = await page.$(sel)
      if (!el) continue
      const read = () => page.evaluate((s) => {
        const e = document.querySelector(s); const cs = getComputedStyle(e)
        const cv = document.createElement('canvas'); cv.width = cv.height = 1
        const cx = cv.getContext('2d', { willReadFrequently: true })
        const hx = (str) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = str; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; const h = (n) => n.toString(16).padStart(2, '0'); return `#${h(d[0])}${h(d[1])}${h(d[2])}${d[3] < 255 ? h(d[3]) : ''}` }
        return { bg: hx(cs.backgroundColor), color: hx(cs.color), border: hx(cs.borderTopColor), shadow: cs.boxShadow, transform: cs.transform, opacity: cs.opacity, deco: cs.textDecorationLine, outline: cs.outlineStyle === 'none' ? 'none' : `${cs.outlineWidth} ${cs.outlineStyle} ${hx(cs.outlineColor)} +${cs.outlineOffset}` }
      }, sel)
      try {
        await el.scrollIntoViewIfNeeded({ timeout: 1500 })
        await page.mouse.move(0, 0)
        await page.waitForTimeout(200)
        const base = await read()
        const diff = (a, b) => Object.fromEntries(Object.entries(b).filter(([k, v]) => a[k] !== v && !(k === 'transform' && a[k] === 'none' && v === 'none')).map(([k, v]) => [k, `${a[k]} → ${v}`]))
        comp.states = {}
        if (group !== 'inputs') {
          await el.hover({ timeout: 1500 })
          await page.waitForTimeout(450)
          const hov = diff(base, await read())
          if (Object.keys(hov).length) comp.states.hover = hov
          await page.mouse.move(0, 0)
        }
        await page.keyboard.press('Tab').catch(() => {})
        await el.focus({ timeout: 1000 }).catch(() => {})
        await page.waitForTimeout(250)
        const foc = diff(base, await read())
        if (Object.keys(foc).length) comp.states.focus = foc
        await el.evaluate((e) => e.blur())
      } catch {}
    }
  }
}
await captureStates()

if (wantShots) {
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: path.join(outDir, 'screenshots/desktop-light.png'), fullPage: true, timeout: 20000, animations: 'disabled' }).catch(async () => {
    await page.screenshot({ path: path.join(outDir, 'screenshots/desktop-light.png'), timeout: 20000 }).catch(() => {})
  })
  await page.screenshot({ path: path.join(outDir, 'screenshots/desktop-light-fold.png'), timeout: 20000 }).catch(() => {})
}

// ───── dark mode: try media emulation first, then class/attribute strategies hinted by the CSS ─────
const darkInfo = { strategy: null, selector: null, changedBg: false, raw: null }
let varsDark = null
if (wantDark) {
  const lightBg = raw.page.effectiveBg
  const strategies = []
  if (cssInfo.media.other['prefers-color-scheme']) strategies.push({ name: 'prefers-color-scheme media query', media: true, selector: '@media (prefers-color-scheme: dark)' })
  const attrCandidates = [
    { sel: '.dark', apply: () => document.documentElement.classList.add('dark'), undo: () => document.documentElement.classList.remove('dark'), cond: '.dark &' },
    { sel: '[data-theme=dark]', apply: () => document.documentElement.setAttribute('data-theme', 'dark'), undo: () => document.documentElement.removeAttribute('data-theme'), cond: '[data-theme=dark] &' },
    { sel: '[data-mode=dark]', apply: () => document.documentElement.setAttribute('data-mode', 'dark'), undo: () => document.documentElement.removeAttribute('data-mode'), cond: '[data-mode=dark] &' },
    { sel: '[data-bs-theme=dark]', apply: () => document.documentElement.setAttribute('data-bs-theme', 'dark'), undo: () => document.documentElement.removeAttribute('data-bs-theme'), cond: '[data-bs-theme=dark] &' },
    { sel: '[data-color-mode=dark]', apply: () => document.documentElement.setAttribute('data-color-mode', 'dark'), undo: () => document.documentElement.removeAttribute('data-color-mode'), cond: '[data-color-mode=dark] &' },
    { sel: '.theme-dark', apply: () => document.documentElement.classList.add('theme-dark'), undo: () => document.documentElement.classList.remove('theme-dark'), cond: '.theme-dark &' },
    { sel: '.dark-mode', apply: () => document.documentElement.classList.add('dark-mode'), undo: () => document.documentElement.classList.remove('dark-mode'), cond: '.dark-mode &' },
  ]
  const cssBlob = cssTexts.join('\n')
  const hinted = (sel) => cssBlob.includes(sel.replace('=dark]', '=dark]')) || cssBlob.includes(sel.replace('=dark]', '="dark"]'))
  const tryMedia = async () => { await page.emulateMedia({ colorScheme: 'dark' }); await page.waitForTimeout(500) }
  let found = false

  if (strategies.length) {
    await tryMedia()
    const r = await page.evaluate(collect)
    delete r.inlineStyles
    const changed = r.page.effectiveBg !== lightBg
    if (changed || Object.keys(cssInfo.vars.dark).length) {
      darkInfo.strategy = strategies[0].name; darkInfo.selector = '@media (prefers-color-scheme: dark)'; darkInfo.changedBg = changed; darkInfo.raw = r; found = true
      varsDark = await page.evaluate(readVars, allVarNames)
    } else await page.emulateMedia({ colorScheme: 'light' })
  }
  if (!found) {
    for (const cand of attrCandidates) {
      if (!hinted(cand.sel) && !hinted(cand.sel.replace('.', '.'))) continue
      await page.evaluate(`(${cand.apply.toString()})()`)
      await page.waitForTimeout(500)
      const r = await page.evaluate(collect)
      delete r.inlineStyles
      if (r.page.effectiveBg !== lightBg) {
        darkInfo.strategy = `class/attribute toggle on <html>`; darkInfo.selector = cand.cond; darkInfo.changedBg = true; darkInfo.raw = r; found = true
        varsDark = await page.evaluate(readVars, allVarNames)
        break
      }
      await page.evaluate(`(${cand.undo.toString()})()`)
    }
  }
  if (found && wantShots) await page.screenshot({ path: path.join(outDir, 'screenshots/desktop-dark.png'), fullPage: true, timeout: 20000, animations: 'disabled' }).catch(() => {})
  if (darkInfo.raw) {
    // drop dark-only interactive tags so JSON stays small
    delete darkInfo.raw.components
    darkInfo.raw.components = { buttons: [], links: [] }
  }
  await page.emulateMedia({ colorScheme: 'light' })
}

if (wantShots) {
  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true })
  const mp = await mob.newPage()
  try {
    await mp.goto(toUrl(target), { waitUntil: 'networkidle', timeout: 30000 }).catch(() => mp.goto(toUrl(target), { waitUntil: 'domcontentloaded', timeout: 20000 }))
    await mp.waitForTimeout(600)
    await mp.screenshot({ path: path.join(outDir, 'screenshots/mobile.png'), timeout: 15000 })
  } catch {}
  await mob.close()
}

const analysis = analyse(raw, cssInfo, varsLight, varsDark, darkInfo)
fs.writeFileSync(path.join(outDir, 'raw.json'), JSON.stringify({ raw, css: { vars: cssInfo.vars, fontFaces: cssInfo.fontFaces, media: cssInfo.media }, darkRaw: darkInfo.raw }, null, 1))
fs.writeFileSync(path.join(outDir, 'analysis.json'), JSON.stringify(analysis, null, 1))
fs.writeFileSync(path.join(outDir, 'report.md'), report(analysis, target))
await browser.close()

const top = analysis.colors.filter((c) => c.kind === 'chromatic').slice(0, 3).map((c) => c.hex).join(', ')
console.log(`✓ extracted ${raw.counts.visible} visible elements`)
console.log(`  colours: ${analysis.colors.length} clusters (top accents: ${top || 'none'})`)
console.log(`  fonts: ${analysis.fontFamilies.slice(0, 3).map((f) => f.family).join(', ')}`)
console.log(`  css vars: ${analysis.cssVars.count.light} light / ${analysis.cssVars.count.dark} dark; dark mode: ${darkInfo.strategy || 'not detected'}`)
console.log(`  wrote ${path.join(outDir, 'report.md')}  (read this first)`)
