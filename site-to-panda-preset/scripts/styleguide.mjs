#!/usr/bin/env node
/**
 * styleguide.mjs — render the preset's resolved tokens as one self-contained HTML page for eyeballing.
 *
 *   node styleguide.mjs <preset-project-dir> [--shot path/to/source-screenshot.png] [--out styleguide.html]
 *
 * Reads .s2p/spec.json (written by verify.mjs) and the compiled styled-system/styles.css, so what you see
 * is what Panda actually emits: real CSS variables, real dark overrides.
 */
import fs from 'node:fs'
import path from 'node:path'

const argv = process.argv.slice(2)
const flag = (n, d) => { const i = argv.indexOf(`--${n}`); return i < 0 ? d : argv[i + 1] }
const dir = path.resolve(argv.find((a, i) => !a.startsWith('--') && !(argv[i - 1] || '').startsWith('--')) || '.')
const specPath = path.join(dir, '.s2p/spec.json')
if (!fs.existsSync(specPath)) { console.error('Run verify.mjs first (it writes .s2p/spec.json).'); process.exit(1) }
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
const cssPath = path.join(dir, 'styled-system/styles.css')
const pandaCss = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : ''
const out = path.resolve(flag('out', path.join(dir, 'styleguide.html')))
const shot = flag('shot')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

const vals = spec.values || []
const tokenCss = spec.tokens || {}
const cat = (c) => [...new Set(vals.filter((v) => v.token.startsWith(`${c}.`)).map((v) => v.token))]
const get = (t, cond) => vals.find((v) => v.token === t && (v.condition || null) === (cond || null))?.value
const cssVar = (t) => `var(${tokenCss[t]?.cssVar})`
const name = (t) => t.split('.').slice(1).join('.')
const hasDark = vals.some((v) => v.condition)

const swatches = (c) => cat(c).map((t) => {
  const dark = vals.find((v) => v.token === t && v.condition)
  return `<figure class="sw"><div class="chip" style="background:${cssVar(t)}"></div>${dark ? `<div class="chip dk" data-theme="dark" style="background:${esc(dark.value)}" title="dark: ${esc(dark.value)}"></div>` : ''}<figcaption><b>${esc(name(t))}</b><code>${esc(get(t))}</code>${dark ? `<code>dark ${esc(dark.value)}</code>` : ''}</figcaption></figure>`
}).join('')

const groups = {}
for (const t of cat('colors')) { const g = name(t).split('.')[0]; (groups[g] ||= []).push(t) }
const colorHtml = Object.entries(groups).map(([g, ts]) => `<h3>${esc(g)}</h3><div class="row">${ts.map((t) => swatches('colors').match(new RegExp(`<figure class="sw">(?:(?!</figure>).)*?<b>${name(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</b>.*?</figure>`, 's'))?.[0] ?? '').join('')}</div>`).join('')

const fontSizes = cat('fontSizes').sort((a, b) => parseFloat(get(a)) - parseFloat(get(b)))
const fontFam = cat('fonts')
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Preset styleguide</title>
<style>
/* Initial CSS variables for this page's own chrome (independent of the preset being shown). */
:root{
  --bg:#fafaf9; --panel:#ffffff; --ink:#1c1917; --muted:#78716c; --line:#e7e5e4; --accent:#4f46e5;
  --radius:10px; --gap:16px; --font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif; --mono:ui-monospace,SFMono-Regular,Menlo,monospace;
}
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){ --bg:#0c0a09; --panel:#1c1917; --ink:#f5f5f4; --muted:#a8a29e; --line:#292524; --accent:#818cf8; } }
:root[data-theme="dark"]{ --bg:#0c0a09; --panel:#1c1917; --ink:#f5f5f4; --muted:#a8a29e; --line:#292524; --accent:#818cf8; }
*{box-sizing:border-box} body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 var(--font)}
main{max-width:1100px;margin:0 auto;padding:32px 16px 80px} h1{font-size:26px;margin:0 0 4px} h2{font-size:18px;margin:40px 0 12px;padding-top:16px;border-top:1px solid var(--line)} h3{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:20px 0 8px}
.lede{color:var(--muted);margin:0 0 8px} .bar{display:flex;gap:8px;align-items:center;margin:12px 0}
button.t{font:inherit;padding:6px 12px;border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:var(--radius);cursor:pointer}
.row{display:flex;flex-wrap:wrap;gap:var(--gap)} .sw{margin:0;width:120px} .chip{height:56px;border:1px solid var(--line);border-radius:var(--radius)} .chip.dk{height:20px;margin-top:4px}
figcaption{font-size:12px;margin-top:6px} figcaption b{display:block} code{display:block;font:11px var(--mono);color:var(--muted);word-break:break-all}
.specimen{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);padding:12px 16px;margin:8px 0;display:flex;gap:16px;align-items:baseline;justify-content:space-between}
.specimen small{font:11px var(--mono);color:var(--muted);flex:none}
.shot{max-width:100%;border:1px solid var(--line);border-radius:var(--radius)} .box{background:var(--panel);border:1px solid var(--line);height:64px;width:112px;display:grid;place-items:center;font:11px var(--mono);color:var(--muted)}
.bars{display:grid;gap:8px} .bar-i{display:flex;gap:12px;align-items:center;font:12px var(--mono);color:var(--muted)} .bar-i i{display:block;height:12px;background:var(--accent);border-radius:3px}
</style></head><body><main>
<h1>Preset styleguide</h1><p class="lede">${vals.length} resolved token values · ${hasDark ? 'dark values shown as the thin strip under each colour' : 'no dark values defined'}</p>
<div class="bar"><button class="t" onclick="var r=document.documentElement;r.dataset.theme=r.dataset.theme==='dark'?'light':'dark'">Toggle page chrome light/dark</button></div>
${shot ? `<h2>Source site</h2><img class="shot" src="${esc(shot)}" alt="source screenshot">` : ''}
<h2>Colours</h2>${colorHtml}
<h2>Typography</h2>
<h3>Families</h3>${fontFam.map((t) => `<div class="specimen"><span style="font-family:${cssVar(t)};font-size:24px">${esc(name(t))} — Sphinx of black quartz, judge my vow 0123456789</span><small>${esc(get(t))}</small></div>`).join('')}
<h3>Sizes</h3>${fontSizes.map((t) => `<div class="specimen"><span style="font-size:${cssVar(t)};line-height:1.2;font-family:${fontFam[0] ? cssVar(fontFam[0]) : 'inherit'}">${esc(name(t))} — The quick brown fox</span><small>${esc(get(t))}</small></div>`).join('')}
<h2>Spacing</h2><div class="bars">${cat('spacing').filter((t) => !name(t).startsWith('-')).sort((a, b) => parseFloat(get(a)) - parseFloat(get(b))).map((t) => `<div class="bar-i"><span style="width:56px">${esc(name(t))}</span><i style="width:${cssVar(t)}"></i><span>${esc(get(t))}</span></div>`).join('')}</div>
<h2>Radii</h2><div class="row">${cat('radii').map((t) => `<div><div class="box" style="border-radius:${cssVar(t)}">${esc(name(t))}</div><code>${esc(get(t))}</code></div>`).join('')}</div>
<h2>Shadows</h2><div class="row">${cat('shadows').map((t) => `<div><div class="box" style="box-shadow:${cssVar(t)};border:0">${esc(name(t))}</div><code>${esc(get(t)).slice(0, 60)}</code></div>`).join('')}</div>
<h2>Motion</h2><p class="lede">Durations: ${cat('durations').map((t) => `<code style="display:inline">${esc(name(t))} ${esc(get(t))}</code>`).join(' · ') || '—'}<br>Easings: ${cat('easings').map((t) => `<code style="display:inline">${esc(name(t))} ${esc(get(t))}</code>`).join(' · ') || '—'}</p>
</main>
<style id="panda-tokens">${pandaCss.replace(/<\/style/gi, '<\\/style')}</style>
</body></html>`
fs.writeFileSync(out, html)
console.log(`✓ wrote ${out}`)
