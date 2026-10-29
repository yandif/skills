import { definePreset } from '@pandacss/dev'
import { conditions } from './conditions'
import { globalCss } from './global-css'
import { breakpoints, keyframes, tokens } from './tokens'
import { semanticTokens } from './semantic-tokens'
import { textStyles } from './text-styles'
import { layerStyles } from './layer-styles'
import { recipes } from './recipes'

export default definePreset({
  name: '{{PKG}}',
  conditions: { extend: conditions },
  globalCss,
  theme: {
    breakpoints,
    keyframes,
    tokens,
    semanticTokens,
    textStyles,
    layerStyles,
    recipes,
  },
})
