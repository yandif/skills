Source: https://tweaked.cc/event/disk_eject.html
Snapshot: 2026-10-03; site footer: 2026-09-18.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# disk_eject

The `disk_eject` event is fired when a disk is removed from an adjacent or networked disk drive.

## Return Values

  1. `string` : The event name.
  2. `string` : The side of the disk drive that had a disk removed.

## Example

Prints a message when a disk is removed:

    while true do
      local event, side = os.pullEvent ("disk_eject")
      print("Removed a disk on side " .. side)
    end
### See also

  * `disk` For the event sent when a disk is inserted.
Last updated on 2026-09-18

