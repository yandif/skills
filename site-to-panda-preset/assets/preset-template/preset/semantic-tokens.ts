import { defineSemanticTokens } from '@pandacss/dev'

// SEMANTIC tokens: what a colour is FOR. Every entry that differs in dark mode carries both values:
//   { value: { base: '{colors.neutral.50}', _dark: '{colors.neutral.900}' } }
// Reference raw tokens with {category.name} so the palette stays the single source of truth.
export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: {
      canvas: { value: '{colors.white}' }, // page background
      surface: { value: '{colors.white}' }, // cards, popovers
    },
    fg: {
      DEFAULT: { value: '{colors.black}' }, // body text
    },
    border: {
      DEFAULT: { value: '{colors.black}' },
    },
  },
})
