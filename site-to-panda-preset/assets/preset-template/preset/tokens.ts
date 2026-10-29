import { defineKeyframes, defineTokens } from '@pandacss/dev'

// RAW tokens: the palette and scales, named by what they ARE (brand.500, space.4, radius.md).
// Semantic meaning ("surface", "text.muted") lives in semantic-tokens.ts.
// Keep every value the site really uses exactly as observed; only add generated fill-ins around them.
export const tokens = defineTokens({
  colors: {
    transparent: { value: 'transparent' },
    current: { value: 'currentColor' },
    white: { value: '#ffffff' },
    black: { value: '#000000' },
    // brand: { 500: { value: '#…' }, 600: { value: '#…' } },
    // neutral: { 50: { value: '#…' }, … 900: { value: '#…' } },
  },
  fonts: {
    body: { value: 'system-ui, sans-serif' },
    heading: { value: 'system-ui, sans-serif' },
    mono: { value: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  },
  fontSizes: {
    md: { value: '1rem' },
  },
  fontWeights: {
    regular: { value: '400' },
    bold: { value: '700' },
  },
  lineHeights: {
    normal: { value: '1.5' },
  },
  letterSpacings: {
    normal: { value: '0em' },
  },
  spacing: {
    0: { value: '0rem' },
    4: { value: '1rem' },
  },
  sizes: {
    full: { value: '100%' },
    screen: { value: '100vw' },
    min: { value: 'min-content' },
    max: { value: 'max-content' },
    fit: { value: 'fit-content' },
    // container widths observed as max-width, e.g.  'container-lg': { value: '1120px' },
  },
  radii: {
    none: { value: '0px' },
    md: { value: '8px' },
    full: { value: '9999px' },
  },
  borderWidths: {
    thin: { value: '1px' },
  },
  shadows: {
    // sm: { value: '0 1px 2px rgba(0,0,0,.06)' },
  },
  blurs: {},
  durations: {
    fast: { value: '150ms' },
  },
  easings: {
    standard: { value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  },
  zIndex: {
    base: { value: 0 },
    sticky: { value: 50 },
  },
  opacity: {},
})

export const breakpoints = {
  // sm: '640px', md: '768px', lg: '1024px', xl: '1280px',  ← from the site's min-width media queries
  md: '768px',
}

export const keyframes = defineKeyframes({
  // 'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
})
