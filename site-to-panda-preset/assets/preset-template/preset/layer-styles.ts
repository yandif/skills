import { defineLayerStyles } from '@pandacss/dev'

// Reusable surfaces: background + border + radius + shadow bundles (card, popover, input, …).
export const layerStyles = defineLayerStyles({
  card: {
    description: 'Raised surface',
    value: { bg: 'bg.surface', borderWidth: 'thin', borderColor: 'border', borderRadius: 'md' },
  },
})
