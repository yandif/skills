Source: https://tweaked.cc/event/mouse_drag.html
Snapshot: 2026-10-03; site footer: 2026-09-24.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# mouse_drag

This event is fired every time the mouse is moved while a mouse button is being held.

## Return values

  1. `string` : The event name.
  2. `number`: The mouse button that is being pressed.
  3. `number`: The X-coordinate of the mouse.
  4. `number`: The Y-coordinate of the mouse.
## Example

Print the button and the coordinates whenever the mouse is dragged.

    while true do
      local event, button, x, y = os.pullEvent ("mouse_drag")
      print(("The mouse button %s was dragged at %d, %d"):format(button, x, y))
    end

### See also

  * `mouse_click` For when a mouse button is initially pressed.
Last updated on 2026-09-24

