Source: https://tweaked.cc/module/textutils.html
Snapshot: 2026-10-03; site footer: 2026-10-01.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# textutils

Helpful utilities for formatting and manipulating strings.
### Changes
  * New in version 1.2
slowWrite(text [, rate]) | Slowly writes string text at current cursor position, character-by-character.
slowPrint(sText [, nRate]) | Slowly prints string text at current cursor position, character-by-character.
formatTime(nTime [, bTwentyFourHour]) | Takes input time and formats it in a more readable format such as `6:30 PM`.
pagedPrint(text [, free_lines]) | Prints a given string to the display.
tabulate(...) | Prints tables in a structured form.
pagedTabulate(...) | Prints tables in a structured form, stopping and prompting for input should the result not fit on the terminal.
empty_json_array | A table representing an empty JSON array, in order to distinguish it from an empty JSON object.
json_null | A table representing the JSON null value.
serialize(t, opts) | Convert a Lua object into a textual representation, suitable for saving in a file or pretty-printing.
serialise(t, opts) | Convert a Lua object into a textual representation, suitable for saving in a file or pretty-printing.
unserialize(s) | Converts a serialised string back into a reassembled Lua object.
unserialise(s) | Converts a serialised string back into a reassembled Lua object.
serializeJSON(...) | Returns a JSON representation of the given data.
serialiseJSON(...) | Returns a JSON representation of the given data.
unserializeJSON(s [, options]) | Converts a serialised JSON string back into a reassembled Lua object.
unserialiseJSON(s [, options]) | Converts a serialised JSON string back into a reassembled Lua object.
urlEncode(str) | Replaces certain characters in a string to make it safe for use in URLs or POST data.
complete(sSearchText [, tSearchTable]) | Provides a list of possible completions for a partial Lua expression.
## slowWrite(text [, rate])


Slowly writes string text at current cursor position, character-by-character.

Like `_G.write` , this does not insert a newline at the end.
### Parameters

  1. text `string` The the text to write to the screen
  2. rate? `number` The number of characters to write each second, Defaults to 20.

### Usage

  * textutils.slowWrite ("Hello, world!")

  * textutils.slowWrite ("Hello, world!", 5)
### Changes

  * New in version 1.3
## slowPrint(sText [, nRate])


Slowly prints string text at current cursor position, character-by-character.

Like `print` , this inserts a newline after printing.

### Parameters

  1. sText `string` The the text to write to the screen
  2. nRate? `number` The number of characters to write each second, Defaults to 20.
### Usage

  * textutils.slowPrint ("Hello, world!")

  * textutils.slowPrint ("Hello, world!", 5)

## formatTime(nTime [, bTwentyFourHour])


Takes input time and formats it in a more readable format such as `6:30 PM`.

### Parameters

  1. nTime `number` The time to format, as provided by `os.time` .
  2. bTwentyFourHour? `boolean` Whether to format this as a 24-hour clock (`18:30`) rather than a 12-hour one (`6:30 AM`)
### Returns

  1. `string` The formatted time
### Usage

  * Print the current in-game time as a 12-hour clock.

    textutils.formatTime (os.time ())

  * Print the local time as a 24-hour clock.

    textutils.formatTime (os.time ("local"), true)

## pagedPrint(text [, free_lines])


Prints a given string to the display.
If the action can be completed without scrolling, it acts much the same as `print` ; otherwise, it will throw up a "Press any key to continue" prompt at the bottom of the display. Each press will cause it to scroll down and write a single line more before prompting again, if need be.
### Parameters

  1. text `string` The text to print to the screen.
  2. free_lines? `number` The number of lines which will be automatically scrolled before the first prompt appears (meaning free_lines + 1 lines will be printed). This can be set to the cursor's y position - 2 to always try to fill the screen. Defaults to 0, meaning only one line is displayed before prompting.

### Returns

  1. `number` The number of lines printed.
### Usage

  * Generates several lines of text and then prints it, paging once the bottom of the terminal is reached.

    local lines = {}
    for i = 1, 30 do lines[i] = ("This is line #%d"):format(i) end
    local message = table.concat(lines, "\n")

    local width, height = term.getCursorPos ()
    textutils.pagedPrint (message, height - 2)

## tabulate(...)


Prints tables in a structured form.
This accepts multiple arguments, either a table or a number. When encountering a table, this will be treated as a table row, with each column width being auto-adjusted.

When encountering a number, this sets the text color of the subsequent rows to it.
### Parameters

  1. ... { `string` ... } | `number` The rows and text colors to display.

### Usage

  * textutils.tabulate (
    colors.orange , { "1", "2", "3" },
    colors.lightBlue , { "A", "B", "C" }
    )
### Changes

  * New in version 1.3
## pagedTabulate(...)


Prints tables in a structured form, stopping and prompting for input should the result not fit on the terminal.

This functions identically to `textutils.tabulate` , but will prompt for user input should the whole output not fit on the display.

### Parameters

  1. ... { `string` ... } | `number` The rows and text colors to display.
### Usage

  * Generates a long table, tabulates it, and prints it to the screen.

    local rows = {}
    for i = 1, 30 do rows[i] = {("Row #%d"):format(i), math.random(1, 400)} end
    textutils.pagedTabulate (colors.orange , {"Column", "Value"}, colors.lightBlue , table.unpack(rows))

### See also

  * `textutils.tabulate`
  * `textutils.pagedPrint`
### Changes

  * New in version 1.3
## empty_json_array


A table representing an empty JSON array, in order to distinguish it from an empty JSON object.

The contents of this table should not be modified.

### Usage

  * textutils.serialiseJSON (textutils.empty_json_array )
### See also

  * `textutils.serialiseJSON`
  * `textutils.unserialiseJSON`
## json_null


A table representing the JSON null value.

The contents of this table should not be modified.

### Usage

  * textutils.serialiseJSON (textutils.json_null )
### See also

  * `textutils.serialiseJSON`
  * `textutils.unserialiseJSON`
## serialize(t, opts)


Convert a Lua object into a textual representation, suitable for saving in a file or pretty-printing.
### Parameters

  1. t The object to serialise
  2. opts { compact? = `boolean`, allow_repetitions? = `boolean` }

Options for serialisation.

     * `compact`: Do not emit indentation and other whitespace between terms.
     * `allow_repetitions`: Relax the check for recursive tables, allowing them to appear multiple times (as long as tables do not appear inside themselves).

### Returns

  1. `string` The serialised representation
### Throws

  * If the object contains a value which cannot be serialised. This includes functions and tables which appear multiple times.

### Usage

  * Serialise a basic table.

    textutils.serialise ({ 1, 2, 3, a = 1, ["another key"] = { true } })

  * Demonstrates some of the other options

    local tbl = { 1, 2, 3 }
    print(textutils.serialise ({ tbl, tbl }, { allow_repetitions = true }))

    print(textutils.serialise (tbl, { compact = true }))
### See also

  * `cc.pretty.pretty_print` An alternative way to display a table, often more suitable for pretty printing.

### Changes

  * New in version 1.3
  * Changed in version 1.97.0: Added `opts` argument.
## serialise(t, opts)


Convert a Lua object into a textual representation, suitable for saving in a file or pretty-printing.
### Parameters

  1. t The object to serialise
  2. opts { compact? = `boolean`, allow_repetitions? = `boolean` }

Options for serialisation.

     * `compact`: Do not emit indentation and other whitespace between terms.
     * `allow_repetitions`: Relax the check for recursive tables, allowing them to appear multiple times (as long as tables do not appear inside themselves).

### Returns

  1. `string` The serialised representation
### Throws

  * If the object contains a value which cannot be serialised. This includes functions and tables which appear multiple times.

### Usage

  * Serialise a basic table.

    textutils.serialise ({ 1, 2, 3, a = 1, ["another key"] = { true } })

  * Demonstrates some of the other options

    local tbl = { 1, 2, 3 }
    print(textutils.serialise ({ tbl, tbl }, { allow_repetitions = true }))

    print(textutils.serialise (tbl, { compact = true }))
### See also

  * `cc.pretty.pretty_print` An alternative way to display a table, often more suitable for pretty printing.

### Changes

  * New in version 1.3
  * Changed in version 1.97.0: Added `opts` argument.
## unserialize(s)


Converts a serialised string back into a reassembled Lua object.

This is mainly used together with `textutils.serialise` .

### Parameters

  1. s `string` The serialised string to deserialise.
### Returns

  1. The deserialised object

#### Or

  1. nil If the object could not be deserialised.

### Changes

  * New in version 1.3
## unserialise(s)


Converts a serialised string back into a reassembled Lua object.

This is mainly used together with `textutils.serialise` .

### Parameters

  1. s `string` The serialised string to deserialise.

### Returns

  1. The deserialised object

#### Or

  1. nil If the object could not be deserialised.
### Changes

  * New in version 1.3
## serializeJSON(...)


Returns a JSON representation of the given data.

This is largely intended for interacting with various functions from the `commands` API, though may also be used in making `http` requests.

Lua has a rather different data model to Javascript/JSON. As a result, some Lua values do not serialise cleanly into JSON.
  * Lua tables can contain arbitrary key-value pairs, but JSON only accepts arrays, and objects (which require a string key). When serialising a table, if it only has numeric keys, then it will be treated as an array. Otherwise, the table will be serialised to an object using the string keys. Non-string keys (such as numbers or tables) will be dropped.
A consequence of this is that an empty table will always be serialised to an object, not an array. `textutils.empty_json_array` may be used to express an empty array.
  * Lua strings are a sequence of raw bytes, and do not have any specific encoding. However, JSON strings must be valid unicode. By default, non-ASCII characters in a string are serialised to their unicode code point (for instance, `"\xfe"` is converted to `"\u00fe"`). The `unicode_strings` option may be set to treat all input strings as UTF-8.
  * Lua does not distinguish between missing keys (`undefined` in JS) and ones explicitly set to `null`. As a result `{ x = nil }` is serialised to `{}`. `textutils.json_null` may be used to get an explicit null value (`{ x = textutils.json_null }` will serialise to `{"x": null}`).
### Parameters

  1. t The value to serialise. Like `textutils.serialise` , this should not contain recursive tables or functions.
  2. options? { nbt_style? = `boolean`, unicode_strings? = `boolean`, allow_repetitions? = `boolean` }

Options for serialisation.
     * `nbt_style`: Whether to produce NBT-style JSON (non-quoted keys) instead of standard JSON.
     * `unicode_strings`: Whether to treat strings as containing UTF-8 characters instead of using the default 8-bit character set.
     * `allow_repetitions`: Relax the check for recursive tables, allowing them to appear multiple times (as long as tables do not appear inside themselves).
#### Or

  1. t The value to serialise. Like `textutils.serialise` , this should not contain recursive tables or functions.
  2. bNBTStyle `boolean` Whether to produce NBT-style JSON (non-quoted keys) instead of standard JSON.

### Returns

  1. `string` The JSON representation of the input.

### Throws

  * If the object contains a value which cannot be serialised. This includes functions and tables which appear multiple times.
### Usage

  * Serialise a simple object

    textutils.serialiseJSON ({ values = { 1, "2", true } })

  * Serialise an object to a NBT-style string

    textutils.serialiseJSON ({ values = { 1, "2", true } }, { nbt_style = true })

### See also

  * `textutils.json_null` Use to serialise a JSON `null` value.
  * `textutils.empty_json_array` Use to serialise a JSON empty array.
### Changes

  * New in version 1.7
  * Changed in version 1.106.0: Added `options` overload and `unicode_strings` option.
  * Changed in version 1.109.0: Added `allow_repetitions` option.
## serialiseJSON(...)


Returns a JSON representation of the given data.

This is largely intended for interacting with various functions from the `commands` API, though may also be used in making `http` requests.
Lua has a rather different data model to Javascript/JSON. As a result, some Lua values do not serialise cleanly into JSON.

  * Lua tables can contain arbitrary key-value pairs, but JSON only accepts arrays, and objects (which require a string key). When serialising a table, if it only has numeric keys, then it will be treated as an array. Otherwise, the table will be serialised to an object using the string keys. Non-string keys (such as numbers or tables) will be dropped.
A consequence of this is that an empty table will always be serialised to an object, not an array. `textutils.empty_json_array` may be used to express an empty array.
  * Lua strings are a sequence of raw bytes, and do not have any specific encoding. However, JSON strings must be valid unicode. By default, non-ASCII characters in a string are serialised to their unicode code point (for instance, `"\xfe"` is converted to `"\u00fe"`). The `unicode_strings` option may be set to treat all input strings as UTF-8.
  * Lua does not distinguish between missing keys (`undefined` in JS) and ones explicitly set to `null`. As a result `{ x = nil }` is serialised to `{}`. `textutils.json_null` may be used to get an explicit null value (`{ x = textutils.json_null }` will serialise to `{"x": null}`).
### Parameters

  1. t The value to serialise. Like `textutils.serialise` , this should not contain recursive tables or functions.
  2. options? { nbt_style? = `boolean`, unicode_strings? = `boolean`, allow_repetitions? = `boolean` }

Options for serialisation.
     * `nbt_style`: Whether to produce NBT-style JSON (non-quoted keys) instead of standard JSON.
     * `unicode_strings`: Whether to treat strings as containing UTF-8 characters instead of using the default 8-bit character set.
     * `allow_repetitions`: Relax the check for recursive tables, allowing them to appear multiple times (as long as tables do not appear inside themselves).
#### Or

  1. t The value to serialise. Like `textutils.serialise` , this should not contain recursive tables or functions.
  2. bNBTStyle `boolean` Whether to produce NBT-style JSON (non-quoted keys) instead of standard JSON.

### Returns

  1. `string` The JSON representation of the input.

### Throws

  * If the object contains a value which cannot be serialised. This includes functions and tables which appear multiple times.
### Usage

  * Serialise a simple object

    textutils.serialiseJSON ({ values = { 1, "2", true } })

  * Serialise an object to a NBT-style string

    textutils.serialiseJSON ({ values = { 1, "2", true } }, { nbt_style = true })

### See also

  * `textutils.json_null` Use to serialise a JSON `null` value.
  * `textutils.empty_json_array` Use to serialise a JSON empty array.
### Changes

  * New in version 1.7
  * Changed in version 1.106.0: Added `options` overload and `unicode_strings` option.
  * Changed in version 1.109.0: Added `allow_repetitions` option.
## unserializeJSON(s [, options])


Converts a serialised JSON string back into a reassembled Lua object.

This may be used with `textutils.serializeJSON` , or when communicating with command blocks or web APIs.
If a `null` value is encountered, it is converted into `nil`. It can be converted into `textutils.json_null` with the `parse_null` option.

If an empty array is encountered, it is converted into `textutils.empty_json_array` . It can be converted into a new empty table with the `parse_empty_array` option.
### Parameters

  1. s `string` The serialised string to deserialise.
  2. options? { nbt_style? = `boolean`, parse_null? = `boolean`, parse_empty_array? = `boolean` }

Options which control how this JSON object is parsed.

     * `nbt_style`: When true, this will accept stringified NBT strings, as produced by many commands.
Unlike JSON, the format of SNBT strings changes between Minecraft versions. This function should parse all SNBT strings returned by commands, but may not accept all valid SNBT strings. For instance, the `bool` and `uuid` functions are not currently supported.

     * `parse_null`: When true, `null` will be parsed as `json_null` , rather than `nil`.
     * `parse_empty_array`: When false, empty arrays will be parsed as a new table. By default (or when this value is true), they are parsed as `empty_json_array` .
### Returns

  1. The deserialised object

#### Or

  1. nil If the object could not be deserialised.
  2. `string` A message describing why the JSON string is invalid.

### Usage

  * Unserialise a basic JSON object

    textutils.unserialiseJSON ('{"name": "Steve", "age": null}')

  * Unserialise a basic JSON object, returning null values as `json_null` .

    textutils.unserialiseJSON ('{"name": "Steve", "age": null}', { parse_null = true })
### See also

  * `textutils.json_null` Use to serialize a JSON `null` value.
  * `textutils.empty_json_array` Use to serialize a JSON empty array.
### Changes

  * New in version 1.87.0
  * Changed in version 1.100.6: Added `parse_empty_array` option
## unserialiseJSON(s [, options])


Converts a serialised JSON string back into a reassembled Lua object.

This may be used with `textutils.serializeJSON` , or when communicating with command blocks or web APIs.

If a `null` value is encountered, it is converted into `nil`. It can be converted into `textutils.json_null` with the `parse_null` option.
If an empty array is encountered, it is converted into `textutils.empty_json_array` . It can be converted into a new empty table with the `parse_empty_array` option.
### Parameters

  1. s `string` The serialised string to deserialise.
  2. options? { nbt_style? = `boolean`, parse_null? = `boolean`, parse_empty_array? = `boolean` }

Options which control how this JSON object is parsed.

     * `nbt_style`: When true, this will accept stringified NBT strings, as produced by many commands.
Unlike JSON, the format of SNBT strings changes between Minecraft versions. This function should parse all SNBT strings returned by commands, but may not accept all valid SNBT strings. For instance, the `bool` and `uuid` functions are not currently supported.

     * `parse_null`: When true, `null` will be parsed as `json_null` , rather than `nil`.
     * `parse_empty_array`: When false, empty arrays will be parsed as a new table. By default (or when this value is true), they are parsed as `empty_json_array` .
### Returns

  1. The deserialised object

#### Or

  1. nil If the object could not be deserialised.
  2. `string` A message describing why the JSON string is invalid.

### Usage

  * Unserialise a basic JSON object

    textutils.unserialiseJSON ('{"name": "Steve", "age": null}')

  * Unserialise a basic JSON object, returning null values as `json_null` .

    textutils.unserialiseJSON ('{"name": "Steve", "age": null}', { parse_null = true })
### See also

  * `textutils.json_null` Use to serialize a JSON `null` value.
  * `textutils.empty_json_array` Use to serialize a JSON empty array.

### Changes

  * New in version 1.87.0
  * Changed in version 1.100.6: Added `parse_empty_array` option
## urlEncode(str)


Replaces certain characters in a string to make it safe for use in URLs or POST data.

### Parameters

  1. str `string` The string to encode
### Returns

  1. `string` The encoded string.

### Usage

  * print("https://example.com/?view=" .. textutils.urlEncode ("some text&things"))

### Changes

  * New in version 1.31
## complete(sSearchText [, tSearchTable])


Provides a list of possible completions for a partial Lua expression.

If the completed element is a table, suggestions will have `.` appended to them. Similarly, functions have `(` appended to them.
### Parameters

  1. sSearchText `string` The partial expression to complete, such as a variable name or table index.
  2. tSearchTable? `table` The table to find variables in, defaulting to the global environment (`_G` ). The function also searches the "parent" environment via the `__index` metatable field.

### Returns

  1. { `string` ... } The (possibly empty) list of completions.

### Usage

  * textutils.complete ( "pa", _ENV )
### See also

  * `shell.setCompletionFunction`
  * `_G.read`

### Changes

  * New in version 1.74
Last updated on 2026-10-01

