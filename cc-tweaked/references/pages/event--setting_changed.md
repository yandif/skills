Source: https://tweaked.cc/event/setting_changed.html
Snapshot: 2026-10-03; site footer: 2026-09-18.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# setting_changed

The `setting_changed` event is fired when a setting is modified with the `settings` API.

## Return Values

  1. `string` : The event name.
  2. `string` : The name of the setting that was changed.
  3. `any`: The value the setting was set to.
  4. `any`: The previous value of the setting.
## Example

Update a setting , and then wait for the corresponding `setting_changed` event.

    settings.set ("my.setting", 123)
    print(os.pullEvent ("setting_changed"))

### See also

  * `settings`
Last updated on 2026-09-18

