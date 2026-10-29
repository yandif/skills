Source: https://tweaked.cc/event/timer.html
Snapshot: 2026-10-03; site footer: 2026-09-24.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# timer

The `timer` event is fired when a timer started with `os.startTimer` completes.

## Return Values

  1. `string` : The event name.
  2. `number`: The ID of the timer that finished.

## Example

Start and wait for a timer to finish.

    local timer_id = os.startTimer (2)
    local event, id
    repeat
        event, id = os.pullEvent ("timer")
    until id == timer_id
    print("Timer with ID " .. id .. " was fired")
### See also

  * `os.startTimer` To start a timer.
Last updated on 2026-09-24

