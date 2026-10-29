Source: https://tweaked.cc/event/mouse_up.html
Snapshot: 2026-10-03; site footer: 2026-09-21.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# mouse_up

This event is fired when a mouse button is released or a held mouse leaves the computer's terminal.

## Return values

  1. `string` : The event name.
  2. `number`: The mouse button that was released.
  3. `number`: The X-coordinate of the mouse.
  4. `number`: The Y-coordinate of the mouse.
## Example

Prints the coordinates and button number whenever the mouse is released.

    while true do
      local event, button, x, y = os.pullEvent ("mouse_up")
      print(("The mouse button %s was released at %d, %d"):format(button, x, y))
    end

Last updated on 2026-09-21

