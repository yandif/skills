import { defineConditions } from '@pandacss/dev'

// Dark mode must be switched the same way the SOURCE site switches it, otherwise semantic tokens
// flip at the wrong moment. Pick exactly one (extract.mjs reports which: "Dark mode: …").
//
//   prefers-color-scheme media query →  dark: '@media (prefers-color-scheme: dark)'
//   class on <html>  (.dark)          →  dark: '.dark &'
//   attribute        ([data-theme])   →  dark: '[data-theme=dark] &'
export const conditions = defineConditions({
  dark: '.dark &',
  light: ':root &, .light &',
})
