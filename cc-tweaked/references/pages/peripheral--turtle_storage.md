Source: https://tweaked.cc/peripheral/turtle_storage.html
Snapshot: 2026-10-03; site footer: 2026-10-02.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# turtle_storage

A `turtle_storage` allows you to equip a shulker or other storage items with a turtle and access its contents.

This has largely the same methods and shape as `inventory` , with the exception that `pullItems` and `pushItems` transfer to/from the turtle's inventory, rather than taking an inventory name.
### Changes

  * New in version 1.121.0
size() | Get the size of this inventory.
list() | List all items in this inventory.
getItemDetail(slot) | Get detailed information about an item.
pushItems(fromSlot [, limit [, toSlot]]) | Push items from this inventory to the turtle.
pullItems([fromSlot [, limit [, toSlot]]]) | Pull items from the turtle into this inventory.

## size()


Get the size of this inventory.
### Returns

  1. `number` The number of slots in this inventory.
## list()


List all items in this inventory. This returns a table, with an entry for each slot.

This returns data in the same format as `inventory.list` .

### Returns

  1. { `table` | nil... } Basic information about all items in this inventory.
### See also

  * `Item details`
  * `inventory.list`
## getItemDetail(slot)


Get detailed information about an item.

### Parameters

  1. slot `number` The slot to get information about.

### Returns

  1. `table` | nil Information about the item in this slot, or `nil` if it is empty.

### Throws

  * If the slot is out of range.
### See also

  * `Item details`
  * `inventory.getItemDetail`
## pushItems(fromSlot [, limit [, toSlot]])


Push items from this inventory to the turtle.

### Parameters

  1. fromSlot `number` The slot in the current inventory to move items to.
  2. limit? `number` The maximum number of items to move. Defaults to the current stack limit.
  3. toSlot? `number` The slot in the turtle to move to. If not given, the item will be inserted into any slot.
### Returns

  1. `number` The number of transferred items.

### Throws

  * If either source or destination slot is out of range.

## pullItems([fromSlot [, limit [, toSlot]]])


Pull items from the turtle into this inventory.
### Parameters

  1. fromSlot? `number` The slot in the turtle inventory to move items from, defaults to the currently selected slot.
  2. limit? `number` The maximum number of items to move. Defaults to the current stack limit.
  3. toSlot? `number` The slot in current inventory to move to. If not given, the item will be inserted into any slot.

### Returns

  1. `number` The number of transferred items.

### Throws

  * If either source or destination slot is out of range.

Last updated on 2026-10-02

