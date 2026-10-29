Source: https://tweaked.cc/event/disk.html
Snapshot: 2026-10-03; site footer: 2026-09-18.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# disk

The `disk` event is fired when a disk is inserted into an adjacent or networked disk drive.

## Return Values

  1. `string` : The event name.
  2. `string` : The side of the disk drive that had a disk inserted.

## Example

Prints a message when a disk is inserted:

    while true do
      local event, side = os.pullEvent ("disk")
      print("Inserted a disk on side " .. side)
    end
### See also

  * `disk_eject` For the event sent when a disk is removed.
Last updated on 2026-09-18

