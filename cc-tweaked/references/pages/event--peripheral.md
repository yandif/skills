Source: https://tweaked.cc/event/peripheral.html
Snapshot: 2026-10-03; site footer: 2026-09-30.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# peripheral

The `peripheral` event is fired when a peripheral is attached on a side or to a modem.

## Return Values

  1. `string` : The event name.
  2. `string` : The side the peripheral was attached to.

## Example

Prints a message when a peripheral is attached:

    while true do
      local event, side = os.pullEvent ("peripheral")
      print("A peripheral was attached on side " .. side)
    end
### See also

  * `peripheral_detach` For the event fired when a peripheral is detached.
Last updated on 2026-09-30

