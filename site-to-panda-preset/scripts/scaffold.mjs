#!/usr/bin/env node
/**
 * scaffold.mjs — copy the preset template into a new folder and fill in the names.
 *   node scaffold.mjs <out-dir> --name <slug> [--source <site url>] [--install]
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const argv = process.argv.slice(2)
const flag = (n, d) => { const i = argv.indexOf(`--${n}`); return i < 0 ? d : argv[i + 1] }
const out = argv.find((a, i) => !a.startsWith('--') && !(argv[i - 1] || '').startsWith('--'))
if (!out) { console.error('Usage: node scaffold.mjs <out-dir> --name <slug> [--source <url>] [--install]'); process.exit(1) }
const name = flag('name', path.basename(path.resolve(out)))
const pkg = name.endsWith('-panda-preset') ? name : `${name}-panda-preset`
const source = flag('source', name)
const tpl = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../assets/preset-template')

if (fs.existsSync(out) && fs.readdirSync(out).length) { console.error(`${out} is not empty — refusing to overwrite.`); process.exit(1) }
const copy = (from, to) => {
  fs.mkdirSync(to, { recursive: true })
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const f = path.join(from, e.name), t = path.join(to, e.name)
    if (e.isDirectory()) copy(f, t)
    else fs.writeFileSync(t, fs.readFileSync(f, 'utf8').replaceAll('{{PKG}}', pkg).replaceAll('{{SOURCE}}', source))
  }
}
copy(tpl, out)
console.log(`✓ scaffolded ${pkg} → ${out}`)
if (argv.includes('--install')) {
  console.log('  installing dependencies…')
  execSync('npm install --no-audit --no-fund', { cwd: out, stdio: 'inherit' })
}
