Source: https://tweaked.cc/event/peripheral_detach.html
Snapshot: 2026-10-03; site footer: 2026-10-01.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# peripheral_detach

The `peripheral_detach` event is fired when a peripheral is detached from a side or from a modem.

## Return Values

  1. `string` : The event name.
  2. `string` : The side the peripheral was detached from.

## Example

Prints a message when a peripheral is detached:

    while true do
      local event, side = os.pullEvent ("peripheral_detach")
      print("A peripheral was detached on side " .. side)
    end
### See also

  * `peripheral` For the event fired when a peripheral is attached.
Last updated on 2026-10-01

