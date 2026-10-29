Source: https://tweaked.cc/event/monitor_resize.html
Snapshot: 2026-10-03; site footer: 2026-09-24.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# monitor_resize

The `monitor_resize` event is fired when an adjacent or networked monitor's size is changed.

## Return Values

  1. `string` : The event name.
  2. `string` : The side or network ID of the monitor that was resized.
## Example

Prints a message when a monitor is resized:

    while true do
      local event, side = os.pullEvent ("monitor_resize")
      print("The monitor on side " .. side .. " was resized.")
    end

Last updated on 2026-09-24

