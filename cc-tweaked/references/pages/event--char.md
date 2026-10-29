Source: https://tweaked.cc/event/char.html
Snapshot: 2026-10-03; site footer: 2026-09-29.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# char

The `char` event is fired when a character is typed on the keyboard.

The `char` event is different to a key press. Sometimes multiple key presses may result in one character being typed (for instance, on some European keyboards). Similarly, some keys (e.g. `Ctrl`) do not have any corresponding character. The `key` should be used if you want to listen to key presses themselves.
## Return values

  1. `string` : The event name.
  2. `string` : The string representing the character that was pressed.

## Example

Prints each character the user presses:

    while true do
        local event, character = os.pullEvent ("char")
        print(character .. " was pressed.")
    end

### See also

  * `key` To listen to any key press.
Last updated on 2026-09-29

