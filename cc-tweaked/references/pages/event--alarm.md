Source: https://tweaked.cc/event/alarm.html
Snapshot: 2026-10-03; site footer: 2026-09-18.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# alarm

The `alarm` event is fired when an alarm started with `os.setAlarm` completes.

## Return Values

  1. `string` : The event name.
  2. `number`: The ID of the alarm that finished.

## Example

Starts a timer and then waits for it to complete.

    local alarm_id = os.setAlarm (os.time () + 0.05)
    local event, id
    repeat
        event, id = os.pullEvent ("alarm")
    until id == alarm_id
    print("Alarm with ID " .. id .. " was fired")
### See also

  * `os.setAlarm` To start an alarm.
Last updated on 2026-09-18

