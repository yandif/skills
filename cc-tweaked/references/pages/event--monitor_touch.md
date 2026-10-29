Source: https://tweaked.cc/event/monitor_touch.html
Snapshot: 2026-10-03; site footer: 2026-10-01.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# monitor_touch

The `monitor_touch` event is fired when an adjacent or networked Advanced Monitor is right-clicked.

## Return Values

  1. `string` : The event name.
  2. `string` : The side or network ID of the monitor that was touched.
  3. `number`: The X coordinate of the touch, in characters.
  4. `number`: The Y coordinate of the touch, in characters.
## Example

Prints a message when a monitor is touched:

    while true do
      local event, side, x, y = os.pullEvent ("monitor_touch")
      print("The monitor on side " .. side .. " was touched at (" .. x .. ", " .. y .. ")")
    end

Last updated on 2026-10-01

