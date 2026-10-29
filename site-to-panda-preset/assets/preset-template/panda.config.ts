import { defineConfig } from '@pandacss/dev'
import preset from './preset'

// This config only exists to exercise the preset locally (codegen, cssgen, the showcase file).
// Consumers of the preset write their own panda.config.ts — see README.md.
export default defineConfig({
  // preset-base supplies the utilities (`bg`, `px`, `rounded` …) and base conditions.
  // Deliberately NOT including @pandacss/preset-panda: this preset *is* the theme.
  presets: ['@pandacss/preset-base', preset],
  include: ['./src/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  // strictTokens: true,   // flip on to make the system enforce "tokens only" in app code
})
