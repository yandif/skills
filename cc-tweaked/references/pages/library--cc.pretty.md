Source: https://tweaked.cc/library/cc.pretty.html
Snapshot: 2026-10-03; site footer: 2026-09-24.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# cc.pretty

A pretty printer for rendering data structures in an aesthetically pleasing manner.

In order to display something using `cc.pretty` , you build up a series of documents . These behave a little bit like strings; you can concatenate them together and then print them to the screen.
However, documents also allow you to control how they should be printed. There are several functions (such as `nest` and `group` ) which allow you to control the "layout" of the document. When you come to display the document, the 'best' (most compact) layout is used.

The structure of this module is based on A Prettier Printer .
### Usage

  * Print a table to the terminal

    local pretty = require "cc.pretty"
    pretty.pretty_print ({ 1, 2, 3 })

  * Build a custom document and display it

    local pretty = require "cc.pretty"
    pretty.print (pretty.group (pretty.text ("hello") .. pretty.space_line .. pretty.text ("world")))
### Changes
  * New in version 1.87.0
empty | An empty document.
space | A document with a single space in it.
line | A line break.
space_line | A line break.
text(text [, colour]) | Create a new document from a string.
concat(...) | Concatenate several documents together.
nest(depth, doc) | Indent later lines of the given document with the given number of spaces.
group(doc) | Builds a document which is displayed on a single line if there is enough room, or as normal if not.
write(doc [, ribbon_frac=0.6]) | Display a document on the terminal.
print(doc [, ribbon_frac=0.6]) | Display a document on the terminal with a trailing new line.
render(doc [, width [, ribbon_frac=0.6]]) | Render a document, converting it into a string.
pretty(obj [, options]) | Pretty-print an arbitrary object, converting it into a document.
pretty_print(obj [, options [, ribbon_frac=0.6]]) | A shortcut for calling `pretty` and `print` together.
## empty


An empty document.

## space


A document with a single space in it.

## line


A line break. When collapsed with `group` , this will be replaced with `empty` .

## space_line


A line break. When collapsed with `group` , this will be replaced with `space` .

## text(text [, colour])


Create a new document from a string.
If your string contains multiple lines, `group` will flatten the string into a single line, with spaces between each line.
### Parameters

  1. text `string` The string to construct a new document with.
  2. colour? `number` The colour this text should be printed with. If not given, we default to the current colour.

### Returns

  1. `Doc` The document with the provided text.
### Usage

  * Write some blue text.

    local pretty = require "cc.pretty"
    pretty.print (pretty.text ("Hello!", colours .blue))

## concat(...)


Concatenate several documents together. This behaves very similar to string concatenation.

### Parameters

  1. ... `Doc` | `string` The documents to concatenate.

### Returns

  1. `Doc` The concatenated documents.
### Usage

  * local pretty = require "cc.pretty"
    local doc1, doc2 = pretty.text ("doc1"), pretty.text ("doc2")
    print(pretty.concat (doc1, " - ", doc2))
    print(doc1 .. " - " .. doc2) -- Also supports ..

## nest(depth, doc)


Indent later lines of the given document with the given number of spaces.

For instance, nesting the document

    foo
    bar

by two spaces will produce

    foo
      bar
### Parameters

  1. depth `number` The number of spaces with which the document should be indented.
  2. doc `Doc` The document to indent.

### Returns

  1. `Doc` The nested document.

### Usage

  * local pretty = require "cc.pretty"
    print(pretty.nest (2, pretty.text ("foo\nbar")))

## group(doc)


Builds a document which is displayed on a single line if there is enough room, or as normal if not.
### Parameters

  1. doc `Doc` The document to group.

### Returns

  1. `Doc` The grouped document.
### Usage

  * Uses group to show things being displayed on one or multiple lines.

    local pretty = require "cc.pretty"
    local doc = pretty.group ("Hello" .. pretty.space_line .. "World")
    print(pretty.render (doc, 5)) -- On multiple lines
    print(pretty.render (doc, 20)) -- Collapsed onto one.

## write(doc [, ribbon_frac=0.6])


Display a document on the terminal.
### Parameters

  1. doc `Doc` The document to render
  2. ribbon_frac? `number` = `0.6` The maximum fraction of the width that we should write in.
## print(doc [, ribbon_frac=0.6])


Display a document on the terminal with a trailing new line.
### Parameters

  1. doc `Doc` The document to render.
  2. ribbon_frac? `number` = `0.6` The maximum fraction of the width that we should write in.
## render(doc [, width [, ribbon_frac=0.6]])


Render a document, converting it into a string.
### Parameters

  1. doc `Doc` The document to render.
  2. width? `number` The maximum width of this document. Note that long strings will not be wrapped to fit this width - it is only used for finding the best layout.
  3. ribbon_frac? `number` = `0.6` The maximum fraction of the width that we should write in.
### Returns

  1. `string` The rendered document as a string.
## pretty(obj [, options])


Pretty-print an arbitrary object, converting it into a document.

This can then be rendered with `write` or `print` .
### Parameters

  1. obj The object to pretty-print.
  2. options? { function_args = `boolean`, function_source = `boolean` }

Controls how various properties are displayed.

     * `function_args`: Show the arguments to a function if known (`false` by default).
     * `function_source`: Show where the function was defined, instead of `function: xxxxxxxx` (`false` by default).

### Returns

  1. `Doc` The object formatted as a document.
### Usage

  * Display a table on the screen

    local pretty = require "cc.pretty"
    pretty.print (pretty.pretty ({ 1, 2, 3 }))

### See also

  * `pretty_print` for a shorthand to prettify and print an object.

### Changes

  * Changed in version 1.88.0: Added `options` argument.
## pretty_print(obj [, options [, ribbon_frac=0.6]])


A shortcut for calling `pretty` and `print` together.
### Parameters

  1. obj The object to pretty-print.
  2. options? { function_args = `boolean`, function_source = `boolean` }

Controls how various properties are displayed.

     * `function_args`: Show the arguments to a function if known (`false` by default).
     * `function_source`: Show where the function was defined, instead of `function: xxxxxxxx` (`false` by default).
  3. ribbon_frac? `number` = `0.6` The maximum fraction of the width that we should write in.
### Usage

  * Display a table on the screen.

    local pretty = require "cc.pretty"
    pretty.pretty_print ({ 1, 2, 3 })

### See also

  * `pretty`
  * `print`

### Changes

  * New in version 1.99

### Types

### Doc

A document containing formatted text, with multiple possible layouts.

Documents effectively represent a sequence of strings in alternative layouts, which we will try to print in the most compact form necessary.

Last updated on 2026-09-24

