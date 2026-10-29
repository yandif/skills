Source: https://tweaked.cc/library/cc.expect.html
Snapshot: 2026-10-03; site footer: 2026-08-25.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# cc.expect

The `cc.expect` library provides helper functions for verifying that function arguments are well-formed and of the correct type.
### Usage
  * Define a basic function and check it has the correct arguments.

    local expect = require "cc.expect"
    local expect , field = expect.expect , expect.field
    local function add_person(name, info)
    expect (1, name, "string")
    expect (2, info, "table", "nil")

        if info then
            print("Got age=", field (info, "age", "number"))
            print("Got gender=", field (info, "gender", "string", "nil"))
        end
    end
    add_person("Anastazja") -- `info' is optional
    add_person("Kion", { age = 23 }) -- `gender' is optional
    add_person("Caoimhin", { age = 23, gender = true }) -- error!
### Changes

  * New in version 1.84.0
  * Changed in version 1.96.0: The module can now be called directly as a function, which wraps around `expect.expect`.
expect(index, value, ...) | Expect an argument to have a specific type.
field(tbl, index, ...) | Expect an field to have a specific type.
range(num [, min=-math.huge [, max=math.huge]]) | Expect a number to be within a specific range.

## expect(index, value, ...)


Expect an argument to have a specific type.
### Parameters

  1. index `number` The 1-based argument index.
  2. value The argument's value.
  3. ... `string` The allowed types of the argument.

### Returns

  1. The given `value`.

### Throws

  * If the value is not one of the allowed types.

## field(tbl, index, ...)


Expect an field to have a specific type.
### Parameters

  1. tbl `table` The table to index.
  2. index `string` The field name to check.
  3. ... `string` The allowed types of the argument.

### Returns

  1. The contents of the given field.

### Throws

  * If the field is not one of the allowed types.

## range(num [, min=-math.huge [, max=math.huge]])


Expect a number to be within a specific range.
### Parameters

  1. num `number` The value to check.
  2. min? `number` = `-math.huge` The minimum value.
  3. max? `number` = `math.huge` The maximum value.

### Returns

  1. The given `value`.

### Throws

  * If the value is outside of the allowed range.

### Changes

  * New in version 1.96.0
Last updated on 2026-08-25

