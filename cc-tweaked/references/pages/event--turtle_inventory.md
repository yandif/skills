Source: https://tweaked.cc/event/turtle_inventory.html
Snapshot: 2026-10-03; site footer: 2026-09-24.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# turtle_inventory

The `turtle_inventory` event is fired when a turtle's inventory is changed.

## Return values

  1. `string` : The event name.

## Example

Prints a message when the inventory is changed:

    while true do
    os.pullEvent ("turtle_inventory")
      print("The inventory was changed.")
    end

Last updated on 2026-09-24

