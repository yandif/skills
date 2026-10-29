Source: https://tweaked.cc/library/cc.completion.html
Snapshot: 2026-10-03; site footer: 2026-08-28.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# cc.completion

A collection of helper methods for working with input completion, such as that require by `_G.read` .

### See also

  * `cc.shell.completion` For additional helpers to use with `shell.setCompletionFunction` .
### Changes

  * New in version 1.85.0
choice(text, choices [, add_space]) | Complete from a choice of one or more strings.
peripheral(text [, add_space]) | Complete the name of a currently attached peripheral.
side(text [, add_space]) | Complete the side of a computer.
setting(text [, add_space]) | Complete a setting .
command(text [, add_space]) | Complete the name of a Minecraft command .

## choice(text, choices [, add_space])
Complete from a choice of one or more strings.
### Parameters

  1. text `string` The input string to complete.
  2. choices { `string` ... } The list of choices to complete from.
  3. add_space? `boolean` Whether to add a space after the completed item.

### Returns

  1. { `string` ... } A list of suffixes of matching strings.
### Usage

  * Call `_G.read` , completing the names of various animals.

    local completion = require "cc.completion"
    local animals = { "dog", "cat", "lion", "unicorn" }
    read(nil, nil, function(text) return completion.choice (text, animals) end)

## peripheral(text [, add_space])


Complete the name of a currently attached peripheral.
### Parameters

  1. text `string` The input string to complete.
  2. add_space? `boolean` Whether to add a space after the completed name.

### Returns

  1. { `string` ... } A list of suffixes of matching peripherals.

### Usage

  * local completion = require "cc.completion"
    read(nil, nil, completion.peripheral )

## side(text [, add_space])


Complete the side of a computer.
### Parameters

  1. text `string` The input string to complete.
  2. add_space? `boolean` Whether to add a space after the completed side.

### Returns

  1. { `string` ... } A list of suffixes of matching sides.

### Usage

  * local completion = require "cc.completion"
    read(nil, nil, completion.side )

## setting(text [, add_space])


Complete a setting .
### Parameters

  1. text `string` The input string to complete.
  2. add_space? `boolean` Whether to add a space after the completed settings.

### Returns

  1. { `string` ... } A list of suffixes of matching settings.

### Usage

  * local completion = require "cc.completion"
    read(nil, nil, completion.setting )

## command(text [, add_space])


Complete the name of a Minecraft command .
### Parameters

  1. text `string` The input string to complete.
  2. add_space? `boolean` Whether to add a space after the completed command.

### Returns

  1. { `string` ... } A list of suffixes of matching commands.

### Usage

  * local completion = require "cc.completion"
    read(nil, nil, completion.command )

Last updated on 2026-08-28

