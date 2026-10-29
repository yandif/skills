Source: https://tweaked.cc/event/computer_command.html
Snapshot: 2026-10-03; site footer: 2026-09-18.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# computer_command

The `computer_command` event is fired when the `/computercraft queue` command is run for the current command computer.

## Return Values

  1. `string` : The event name.
  2. `string` … (Variable number of arguments): The arguments passed to the command.
## Example

Prints the contents of messages sent:

    while true do
      local event = {os.pullEvent ("computer_command")}
      print("Received message:", table.unpack(event, 2))
    end

Last updated on 2026-09-18

