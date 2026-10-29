Source: https://tweaked.cc/event/websocket_closed.html
Snapshot: 2026-10-03; site footer: 2026-09-18.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# websocket_closed

The `websocket_closed` event is fired when an open WebSocket connection is closed.
## Return Values

  1. `string` : The event name.
  2. `string` : The URL of the WebSocket that was closed.
  3. `string` |`nil`: The server-provided reason the websocket was closed. This will be `nil` if the connection was closed abnormally.
  4. `number`|`nil`: The connection close code , indicating why the socket was closed. This will be `nil` if the connection was closed abnormally.
## Example

Prints a message when a WebSocket is closed (this may take a minute):

    local myURL = "wss://example.tweaked.cc/echo"
    local ws = http.websocket (myURL)
    local event, url
    repeat
        event, url = os.pullEvent ("websocket_closed")
    until url == myURL
    print("The WebSocket at " .. url .. " was closed.")

Last updated on 2026-09-18

