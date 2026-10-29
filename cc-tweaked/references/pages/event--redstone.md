Source: https://tweaked.cc/event/redstone.html
Snapshot: 2026-10-03; site footer: 2026-09-29.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# redstone

The `redstone` event is fired whenever any redstone inputs on the computer or relay change.

## Return values

  1. `string` : The event name.

## Example

Prints a message when a redstone input changes:

    while true do
    os.pullEvent ("redstone")
      print("A redstone input has changed!")
    end

## See also

  * The `redstone` API on computers
  * The `redstone_relay` peripheral
Last updated on 2026-09-29

