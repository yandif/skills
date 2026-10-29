Source: https://tweaked.cc/module/peripheral.html
Snapshot: 2026-10-03; site footer: 2026-10-02.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# peripheral

Find and control peripherals attached to this computer.

Peripherals are blocks (or turtle and pocket computer upgrades) which can be controlled by a computer. For instance, the `speaker` peripheral allows a computer to play music and the `monitor` peripheral allows you to display text in the world.
## Referencing peripherals

Computers can interact with adjacent peripherals. Each peripheral is given a name based on which direction it is in. For instance, a disk drive below your computer will be called `"bottom"` in your Lua code, one to the left called `"left"` , and so on for all 6 directions (`"bottom"`, `"top"`, `"left"`, `"right"`, `"front"`, `"back"`).

You can list the names of all peripherals with the `peripherals` program, or the `peripheral.getNames` function.
It's also possible to use peripherals which are further away from your computer through the use of Wired Modems . Place one modem against your computer (you may need to sneak and right click), run Networking Cable to your peripheral, and then place another modem against that block. You can then right click the modem to use (or attach) the peripheral. This will print a peripheral name to chat, which can then be used just like a direction name to access the peripheral.
You can click on the message to copy the name to your clipboard.
## Using peripherals

Once you have the name of a peripheral, you can call functions on it using the `peripheral.call` function. This takes the name of our peripheral, the name of the function we want to call, and then its arguments.
##### 🛈 info

Some bits of the peripheral API call peripheral functions methods instead (for example, the `peripheral.getMethods` function). Don't worry, they're the same thing!

Let's say we have a monitor above our computer (and so "top") and want to write some text to it . We'd write the following:

    peripheral.call ("top", "write", "This is displayed on a monitor!")
Once you start calling making a couple of peripheral calls this can get very repetitive, and so we can wrap a peripheral. This builds a table of all the peripheral's functions so you can use it like an API or module.

For instance, we could have written the above example as follows:

    local my_monitor = peripheral.wrap ("top")
    my_monitor.write("This is displayed on a monitor!")
## Finding peripherals

Sometimes when you're writing a program you don't care what a peripheral is called, you just need to know it's there. For instance, if you're writing a music player, you just need a speaker - it doesn't matter if it's above or below the computer.

Thankfully there's a quick way to do this: `peripheral.find` . This takes a peripheral type and returns all the attached peripherals which are of this type.
What is a peripheral type though? This is a string which describes what a peripheral is, and so what functions are available on it. For instance, speakers are just called `"speaker"`, and monitors `"monitor"`. Some peripherals might have more than one type - a Minecraft chest is both a `"minecraft:chest"` and `"inventory"`.

You can get all the types a peripheral has with `peripheral.getType` , and check a peripheral is a specific type with `peripheral.hasType` .
To return to our original example, let's use `peripheral.find` to find an attached speaker:

    local speaker = peripheral.find ("speaker")
    speaker.playNote("harp")
### See also

  * `peripheral` This event is fired whenever a new peripheral is attached.
  * `peripheral_detach` This event is fired whenever a peripheral is detached.
### Changes
  * New in version 1.3
  * Changed in version 1.51: Add support for wired modems.
  * Changed in version 1.99: Peripherals can have multiple types.
getNames() | Provides a list of all peripherals available.
isPresent(name) | Determines if a peripheral is present with the given name.
getType(peripheral) | Get the types of a named or wrapped peripheral.
hasType(peripheral, peripheral_type) | Check if a peripheral is of a particular type.
getMethods(name) | Get all available methods for the peripheral with the given name.
getName(peripheral) | Get the name of a peripheral wrapped with `peripheral.wrap` .
call(name, method, ...) | Call a method on the peripheral with the given name.
wrap(name) | Get a table containing all functions available on a peripheral.
find(ty [, filter]) | Find all peripherals of a specific type, and return the wrapped peripherals.
## getNames()


Provides a list of all peripherals available.

If a device is located directly next to the system, then its name will be listed as the side it is attached to. If a device is attached via a Wired Modem, then it'll be reported according to its name on the wired network.
### Returns

  1. { `string` ... } A list of the names of all attached peripherals.

### Changes

  * New in version 1.51
## isPresent(name)


Determines if a peripheral is present with the given name.

### Parameters

  1. name `string` The side or network name that you want to check.

### Returns

  1. `boolean` If a peripheral is present with the given name.
### Usage

  * peripheral.isPresent ("top")

  * peripheral.isPresent ("monitor_0")

## getType(peripheral)


Get the types of a named or wrapped peripheral.

### Parameters

  1. peripheral `string` | `table` The name of the peripheral to find, or a wrapped peripheral instance.

### Returns

  1. `string` ... The peripheral's types, or `nil` if it is not present.
### Usage

  * Get the type of a peripheral above this computer.

    peripheral.getType ("top")

### Changes

  * Changed in version 1.88.0: Accepts a wrapped peripheral as an argument.
  * Changed in version 1.99: Now returns multiple types.
## hasType(peripheral, peripheral_type)


Check if a peripheral is of a particular type.
### Parameters

  1. peripheral `string` | `table` The name of the peripheral or a wrapped peripheral instance.
  2. peripheral_type `string` The type to check.

### Returns

  1. `boolean` | nil If a peripheral has a particular type, or `nil` if it is not present.

### Changes

  * New in version 1.99
## getMethods(name)


Get all available methods for the peripheral with the given name.
### Parameters

  1. name `string` The name of the peripheral to find.

### Returns

  1. { `string` ... } | nil A list of methods provided by this peripheral, or `nil` if it is not present.
## getName(peripheral)


Get the name of a peripheral wrapped with `peripheral.wrap` .

### Parameters

  1. peripheral `table` The peripheral to get the name of.
### Returns

  1. `string` The name of the given peripheral.

### Changes

  * New in version 1.88.0
## call(name, method, ...)


Call a method on the peripheral with the given name.

### Parameters

  1. name `string` The name of the peripheral to invoke the method on.
  2. method `string` The name of the method
  3. ... Additional arguments to pass to the method

### Returns

  1. The return values of the peripheral method.
### Usage

  * Open the modem on the top of this computer.

    peripheral.call ("top", "open", 1)

## wrap(name)


Get a table containing all functions available on a peripheral. These can then be called instead of using `peripheral.call` every time.

### Parameters

  1. name `string` The name of the peripheral to wrap.
### Returns

  1. `table` | nil The table containing the peripheral's methods, or `nil` if there is no peripheral present with the given name.

### Usage

  * Open the modem on the top of this computer.

    local modem = peripheral.wrap ("top")
    modem.open(1)

## find(ty [, filter])


Find all peripherals of a specific type, and return the wrapped peripherals.
### Parameters

  1. ty `string` The type of peripheral to look for.
  2. filter? function(name: `string` , wrapped: `table` ):`boolean` A filter function, which takes the peripheral's name and wrapped table and returns if it should be included in the result.

### Returns

  1. `table` ... 0 or more wrapped peripherals matching the given filters.
### Usage

  * Find all monitors and store them in a table, writing "Hello" on each one.

    local monitors = { peripheral.find ("monitor") }
    for _, monitor in pairs(monitors) do
      monitor.write("Hello")
    end

  * Find all wireless modems connected to this computer.

    local modems = { peripheral.find ("modem", function(name, modem)
        return modem.isWireless() -- Check this modem is wireless.
    end) }
  * This abuses the `filter` argument to call `rednet.open` on every modem.

    peripheral.find ("modem", rednet.open )
### Changes

  * New in version 1.6
Last updated on 2026-10-02

