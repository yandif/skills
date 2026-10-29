import { defineTextStyles } from '@pandacss/dev'

// One entry per distinct type style the site renders (display / heading / body / label / code …).
// Reference tokens by NAME (fontSize: 'md'), not by value, so the scale stays editable in one place.
export const textStyles = defineTextStyles({
  body: {
    description: 'Default paragraph text',
    value: { fontFamily: 'body', fontSize: 'md', fontWeight: 'regular', lineHeight: 'normal', letterSpacing: 'normal' },
  },
})
