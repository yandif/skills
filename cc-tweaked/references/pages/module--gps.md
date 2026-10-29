Source: https://tweaked.cc/module/gps.html
Snapshot: 2026-10-03; site footer: 2026-10-02.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# gps

Use modems to locate the position of the current turtle or computers.

This works by communicating with other computers (called GPS hosts) that already know their position, finding the distance to those computers (with `modem_message` ), and using that to derive its position from theirs (with a process known as trilateration .

### See also

  * `Setting up GPS`
### Changes

  * New in version 1.31
CHANNEL_GPS = 65534 | The channel which GPS requests and responses are broadcast on.
locate([timeout=2 [, debug=false]]) | Tries to retrieve the computer or turtles own location.

## CHANNEL_GPS = 65534


The channel which GPS requests and responses are broadcast on.

## locate([timeout=2 [, debug=false]])


Tries to retrieve the computer or turtles own location.
### Parameters

  1. timeout? `number` = `2` The maximum time in seconds taken to establish our position.
  2. debug? `boolean` = `false` Print debugging messages

### Returns

  1. `number` This computer's `x` position.
  2. `number` This computer's `y` position.
  3. `number` This computer's `z` position.

#### Or

  1. nil If the position could not be established.
Last updated on 2026-10-02

