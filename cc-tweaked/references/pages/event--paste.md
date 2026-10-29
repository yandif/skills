Source: https://tweaked.cc/event/paste.html
Snapshot: 2026-10-03; site footer: 2026-09-28.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# paste

The `paste` event is fired when text is pasted into the computer through Ctrl-V (or ⌘V on Mac).

## Return values

  1. `string` : The event name.
  2. `string` The text that was pasted.

## Example

Prints pasted text:

    while true do
      local event, text = os.pullEvent ("paste")
      print('"' .. text .. '" was pasted')
    end

Last updated on 2026-09-28

