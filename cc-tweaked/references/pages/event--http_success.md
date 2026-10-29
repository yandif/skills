Source: https://tweaked.cc/event/http_success.html
Snapshot: 2026-10-03; site footer: 2026-09-21.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# http_success

The `http_success` event is fired when an HTTP request returns successfully.

This event is normally handled inside `http.get` and `http.post` , but it can still be seen when using `http.request` .

## Return Values

  1. `string` : The event name.
  2. `string` : The URL of the site requested.
  3. `http.Response` : The successful HTTP response.
## Example

Prints the content of a website (this may fail if the request fails):

    local myURL = "https://tweaked.cc/"
    http.request (myURL)
    local event, url, handle
    repeat
        event, url, handle = os.pullEvent ("http_success")
    until url == myURL
    print("Contents of " .. url .. ":")
    print(handle.readAll())
    handle.close()

### See also

  * `http.request` To make an HTTP request.
Last updated on 2026-09-21

