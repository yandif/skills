Source: https://tweaked.cc/generic_peripheral/energy_storage.html
Snapshot: 2026-10-03; site footer: 2026-10-02.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# energy_storage

Methods for interacting with blocks which store energy.

This works with energy storage blocks, as well as generators and machines which consume energy.

##### 🛈 note

Due to limitations with Forge's energy API, it is not possible to measure throughput (i.e. FE used/generated per tick).
### Changes

  * New in version 1.94.0
getEnergy() | Get the energy of this block.
getEnergyCapacity() | Get the maximum amount of energy this block can store.

## getEnergy()


Get the energy of this block.

### Returns

  1. `number` The energy stored in this block, in FE.
## getEnergyCapacity()


Get the maximum amount of energy this block can store.

### Returns

  1. `number` The energy capacity of this block.
Last updated on 2026-10-02

