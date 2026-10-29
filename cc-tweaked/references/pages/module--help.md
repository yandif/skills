Source: https://tweaked.cc/module/help.html
Snapshot: 2026-10-03; site footer: 2026-09-18.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# help

Find help files on the current computer.
### Changes

  * New in version 1.2
path() | Returns a colon-separated list of directories where help files are searched for.
setPath(newPath) | Sets the colon-separated list of directories where help files are searched for to `newPath`
lookup(topic) | Returns the location of the help file for the given topic.
topics() | Returns a list of topics that can be looked up and/or displayed.
completeTopic(prefix) | Returns a list of topic endings that match the prefix.
## path()


Returns a colon-separated list of directories where help files are searched for. All directories are absolute.
### Returns

  1. `string` The current help search path, separated by colons.

### See also

  * `help.setPath`
## setPath(newPath)


Sets the colon-separated list of directories where help files are searched for to `newPath`

### Parameters

  1. newPath `string` The new path to use.

### Usage

  * help.setPath ( "/disk/help/" )

  * help.setPath ( help.path () .. ":/myfolder/help/" )
### See also

  * `help.path`
## lookup(topic)


Returns the location of the help file for the given topic.

### Parameters

  1. topic `string` The topic to find

### Returns

  1. `string` | nil The path to the given topic's help file, or `nil` if it cannot be found.

### Usage

  * help.lookup ("disk")
### Changes

  * Changed in version 1.80pr1: Now supports finding .txt files.
  * Changed in version 1.97.0: Now supports finding Markdown files.
## topics()


Returns a list of topics that can be looked up and/or displayed.

### Returns

  1. `table` A list of topics in alphabetical order.
### Usage

  * help.topics ()

## completeTopic(prefix)


Returns a list of topic endings that match the prefix. Can be used with `read` to allow input of a help topic.

### Parameters

  1. prefix `string` The prefix to match

### Returns

  1. `table` A list of matching topics.

### Changes

  * New in version 1.74
Last updated on 2026-09-18

