Source: https://tweaked.cc/event/http_check.html
Snapshot: 2026-10-03; site footer: 2026-09-21.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# http_check

The `http_check` event is fired when a URL check finishes.

This event is normally handled inside `http.checkURL` , but it can still be seen when using `http.checkURLAsync` .

## Return Values

  1. `string` : The event name.
  2. `string` : The URL requested to be checked.
  3. `boolean`: Whether the check succeeded.
  4. `string` |`nil`: If the check failed, a reason explaining why the check failed.
### See also

  * `http.checkURLAsync` To check a URL asynchronously.
Last updated on 2026-09-21

