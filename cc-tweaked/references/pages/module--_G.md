Source: https://tweaked.cc/module/_G.html
Snapshot: 2026-10-03; site footer: 2026-10-02.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# _G

Functions in the global environment, defined in `bios.lua`. This does not include standard Lua functions.
sleep([time=0]) | Pauses execution for the specified number of seconds.
write(text) | Writes a line of text to the screen without a newline at the end, wrapping text if necessary.
print(...) | Prints the specified values to the screen separated by spaces, wrapping if necessary.
printError(...) | Prints the specified values to the screen in red, separated by spaces, wrapping if necessary.
read([replaceChar [, history [, completeFn [, default]]]]) | Reads user input from the terminal.
_HOST | Stores the current ComputerCraft and Minecraft versions.
_CC_DEFAULT_SETTINGS | The default computer settings as defined in the ComputerCraft configuration.
## sleep([time=0])


Pauses execution for the specified number of seconds.

As it waits for a fixed amount of world ticks, `time` will automatically be rounded up to the nearest multiple of 0.05 seconds. If you are using coroutines or the parallel API , it will only pause execution of the current thread, not the whole program.
##### tip

Because sleep internally uses timers, it is a function that yields. This means that you can use it to prevent "Too long without yielding" errors. However, as the minimum sleep time is 0.05 seconds, it will slow your program down.
##### ⚠ warning

Internally, this function queues and waits for a timer event (using `os.startTimer` ), however it does not listen for any other events. This means that any event that occurs while sleeping will be entirely discarded. If you need to receive events while sleeping, consider using timers , or the parallel API .

### Parameters

  1. time? `number` = `0` The number of seconds to sleep for, rounded up to the nearest multiple of 0.05.
### Usage

  * Sleep for three seconds.

    print("Sleeping for three seconds")
    sleep(3)
    print("Done!")

### See also

  * `os.startTimer`

### Changes

  * Changed in version 1.63: The `time` parameter is now optional.
## write(text)


Writes a line of text to the screen without a newline at the end, wrapping text if necessary.

### Parameters

  1. text `string` The text to write to the string
### Returns

  1. `number` The number of lines written

### Usage

  * write("Hello, world")

### See also

  * `print` A wrapper around write that adds a newline and accepts multiple arguments
## print(...)


Prints the specified values to the screen separated by spaces, wrapping if necessary. After printing, the cursor is moved to the next line.

### Parameters

  1. ... The values to print on the screen

### Returns

  1. `number` The number of lines written
### Usage

  * print("Hello, world!")

## printError(...)


Prints the specified values to the screen in red, separated by spaces, wrapping if necessary. After printing, the cursor is moved to the next line.

### Parameters

  1. ... The values to print on the screen
### Usage

  * printError("Something went wrong!")

## read([replaceChar [, history [, completeFn [, default]]]])


Reads user input from the terminal. This automatically handles arrow keys, pasting, character replacement, history scrollback, auto-completion, and default values.
### Parameters
  1. replaceChar? `string` A character to replace each typed character with. This can be used for hiding passwords, for example.
  2. history? `table` A table holding history items that can be scrolled back to with the up/down arrow keys. The oldest item is at index 1, while the newest item is at the highest index.
  3. completeFn? function(partial: `string` ):{ `string` ... } | nil A function to be used for completion. This function should take the partial text typed so far, and returns a list of possible completion options.
  4. default? `string` Default text which should already be entered into the prompt.
### Returns

  1. `string` The text typed in.
### Usage

  * Read a string and echo it back to the user

    write("> ")
    local msg = read()
    print(msg)

  * Prompt a user for a password.

    while true do
      write("Password> ")
      local pwd = read("*")
      if pwd == "let me in" then break end
      print("Incorrect password, try again.")
    end
    print("Logged in!")
  * A complete example with completion, history and a default value.

    local completion = require "cc.completion"
    local history = { "potato", "orange", "apple" }
    local choices = { "apple", "orange", "banana", "strawberry" }
    write("> ")
    local msg = read(nil, history, function(text) return completion.choice (text, choices) end, "app")
    print(msg)
### See also

  * `cc.completion` For functions to help with completion.
### Changes

  * Changed in version 1.74: Added `completeFn` parameter.
  * Changed in version 1.80pr1: Added `default` parameter.
## _HOST


Stores the current ComputerCraft and Minecraft versions.

Outside of Minecraft (for instance, in an emulator) `_HOST` will contain the emulator's version instead.

If you need to check for the presence of a feature, it is usually better to rely on feature detection, rather than comparing mod or Minecraft versions.
For example, `ComputerCraft 1.93.0 (Minecraft 1.15.2)`.
### Usage

  * Print the current computer's environment.

    print(_HOST)

### See also

  * `os.version`
### Changes

  * New in version 1.76
## _CC_DEFAULT_SETTINGS


The default computer settings as defined in the ComputerCraft configuration.

This is a comma-separated list of settings pairs defined by the mod configuration or server owner. By default, it is empty.

An example value to disable autocompletion:

    shell.autocomplete=false,lua.autocomplete=false,edit.autocomplete=false

### Usage

  * _CC_DEFAULT_SETTINGS
### Changes

  * New in version 1.77
Last updated on 2026-10-02

