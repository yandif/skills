import { defineRecipe } from '@pandacss/dev'

// Component recipes distilled from the sampled buttons / inputs / badges. Variants should mirror
// what the site really has (primary / secondary / ghost; sm / md / lg) — don't invent more.
export const recipes = {
  button: defineRecipe({
    className: 'button',
    description: 'Button',
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      borderRadius: 'md',
      transition: 'background-color {durations.fast} {easings.standard}',
    },
    variants: {
      visual: {
        solid: { bg: 'fg', color: 'bg.canvas' },
      },
      size: {
        md: { px: '4', py: '4', textStyle: 'body' },
      },
    },
    defaultVariants: { visual: 'solid', size: 'md' },
  }),
}
