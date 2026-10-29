Source: https://tweaked.cc/event/websocket_success.html
Snapshot: 2026-10-03; site footer: 2026-09-24.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# websocket_success

The `websocket_success` event is fired when a WebSocket connection request returns successfully.

This event is normally handled inside `http.websocket` , but it can still be seen when using `http.websocketAsync` .

## Return Values

  1. `string` : The event name.
  2. `string` : The URL of the site.
  3. `http.Websocket` : The handle for the WebSocket.
## Example

Prints the content of a website (this may fail if the request fails):

    local myURL = "wss://example.tweaked.cc/echo"
    http.websocketAsync (myURL)
    local event, url, handle
    repeat
        event, url, handle = os.pullEvent ("websocket_success")
    until url == myURL
    print("Connected to " .. url)
    handle.send("Hello!")
    print(handle.receive())
    handle.close()
### See also

  * `http.websocketAsync` To open a WebSocket asynchronously.
Last updated on 2026-09-24

