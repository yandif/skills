import { defineGlobalStyles } from '@pandacss/dev'

// Page-level defaults copied from the site's <html>/<body>/headings/links/selection styles.
export const globalCss = defineGlobalStyles({
  html: { fontSize: '100%' },
  body: { bg: 'bg.canvas', color: 'fg', textStyle: 'body' },
})
