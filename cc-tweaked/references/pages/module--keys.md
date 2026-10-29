Source: https://tweaked.cc/module/keys.html
Snapshot: 2026-10-03; site footer: 2026-09-18.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# keys

Constants for all keyboard "key codes", as queued by the `key` event.

These values are not guaranteed to remain the same between versions. It is recommended that you use the constants provided by this file, rather than the underlying numerical values.
### Changes

  * New in version 1.4
getName(code) | Translates a numerical key code to a human-readable name.

## getName(code)


Translates a numerical key code to a human-readable name. The human-readable name is one of the constants in the keys API.

### Parameters

  1. code `number` The key code to look up.

### Returns

  1. `string` | nil The name of the key, or `nil` if not a valid key code.
### Usage

  * keys.getName (keys .enter)

Last updated on 2026-09-18

