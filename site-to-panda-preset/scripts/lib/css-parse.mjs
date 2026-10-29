// Tiny CSS block parser — enough to read custom properties, @media, @font-face and @keyframes
// out of real-world stylesheets without a PostCSS dependency.

export function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

// Returns a tree of { prelude, body, children } where body is the raw declaration text of the block
// and children are nested rules (for @media / @supports / @layer / @container).
export function parseBlocks(css) {
  const text = stripComments(css)
  let i = 0
  function parseList(depth) {
    const out = []
    let buf = ''
    while (i < text.length) {
      const ch = text[i]
      if (ch === '"' || ch === "'") {
        const q = ch
        buf += ch
        i++
        while (i < text.length && text[i] !== q) {
          if (text[i] === '\\') { buf += text[i++] }
          buf += text[i++]
        }
        buf += text[i++] ?? ''
        continue
      }
      if (ch === '{') {
        i++
        const prelude = buf.trim()
        buf = ''
        const node = { prelude, body: '', children: [] }
        // Decide: nested rules vs declarations. At-rules that nest rules:
        const nests = /^@(media|supports|layer|container|document|scope|starting-style)/i.test(prelude) ||
          /^@layer/i.test(prelude)
        if (nests) {
          node.children = parseList(depth + 1)
        } else {
          let body = ''
          let level = 1
          while (i < text.length && level > 0) {
            const c = text[i]
            if (c === '{') level++
            else if (c === '}') { level--; if (level === 0) break }
            body += c
            i++
          }
          i++ // consume the closing brace
          node.body = body
          // CSS nesting (.a { .b { } }) leaves child blocks inside body; declarations still parse fine.
        }
        out.push(node)
        continue
      }
      if (ch === '}') {
        i++
        if (depth > 0) return out
        continue
      }
      if (ch === ';') {
        // statement at-rules like @import / @charset / @layer a, b;
        const stmt = buf.trim()
        if (stmt) out.push({ prelude: stmt, body: '', children: [], statement: true })
        buf = ''
        i++
        continue
      }
      buf += ch
      i++
    }
    return out
  }
  return parseList(0)
}

export function parseDecls(body) {
  const decls = []
  // Split on ; that are not inside parentheses or quotes.
  let cur = '', depth = 0, quote = null
  for (const ch of body) {
    if (quote) { cur += ch; if (ch === quote) quote = null; continue }
    if (ch === '"' || ch === "'") { quote = ch; cur += ch; continue }
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ';' && depth === 0) { decls.push(cur); cur = ''; continue }
    cur += ch
  }
  if (cur.trim()) decls.push(cur)
  return decls
    .map((d) => {
      const idx = d.indexOf(':')
      if (idx < 0) return null
      return { prop: d.slice(0, idx).trim(), value: d.slice(idx + 1).trim().replace(/\s*!important$/i, '') }
    })
    .filter((d) => d && d.prop && !d.prop.includes('{'))
}

export function walk(nodes, fn, ctx = []) {
  for (const n of nodes) {
    fn(n, ctx)
    if (n.children?.length) walk(n.children, fn, [...ctx, n.prelude])
  }
}
