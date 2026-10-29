Source: https://tweaked.cc/peripheral/computer.html
Snapshot: 2026-10-03; site footer: 2026-10-01.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# computer

A computer or turtle wrapped as a peripheral.

This allows for basic interaction with adjacent computers. Computers wrapped as peripherals will have the type `computer` while turtles will be `turtle`.

turnOn() | Turn the other computer on.
shutdown() | Shutdown the other computer.
reboot() | Reboot or turn on the other computer.
getID() | Get the other computer's ID.
isOn() | Determine if the other computer is on.
getLabel() | Get the other computer's label.
## turnOn()


Turn the other computer on.

## shutdown()


Shutdown the other computer.

## reboot()


Reboot or turn on the other computer.

## getID()


Get the other computer's ID.
### Returns

  1. `number` The computer's ID.

### See also

  * `os.getComputerID` To get your computer's ID.
## isOn()


Determine if the other computer is on.

### Returns

  1. `boolean` If the computer is on.
## getLabel()


Get the other computer's label.

### Returns

  1. `string` | nil The computer's label.

### See also

  * `os.getComputerLabel` To get your label.
Last updated on 2026-10-01

