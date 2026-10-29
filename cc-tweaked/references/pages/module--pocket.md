Source: https://tweaked.cc/module/pocket.html
Snapshot: 2026-10-03; site footer: 2026-10-01.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# pocket

Control the current pocket computer, adding or removing upgrades.

This API is only available on pocket computers. As such, you may use its presence to determine what kind of computer you are using:

    if pocket then
     print("On a pocket computer")
    else
     print("On something else")
    end
## Recipes

Pocket Computer

Image: Stone

Image: Stone

Image: Stone

Image: Stone

Image: Golden Apple

Image: Stone

Image: Stone

Image: Glass Pane

Image: Stone

Image: Pocket Computer

Advanced Pocket Computer

Image: Gold Ingot

Image: Gold Ingot

Image: Gold Ingot

Image: Gold Ingot

Image: Golden Apple

Image: Gold Ingot

Image: Gold Ingot

Image: Glass Pane

Image: Gold Ingot
Image: Advanced Pocket Computer

equipBack() | Search the player's inventory for another upgrade, replacing the existing one with that item if found.
unequipBack() | Remove the pocket computer's current upgrade.

## equipBack()


Search the player's inventory for another upgrade, replacing the existing one with that item if found.

This inventory search starts from the player's currently selected slot, allowing you to prioritise upgrades.
### Returns

  1. `boolean` If an item was equipped.
  2. `string` | nil The reason an item was not equipped.
## unequipBack()


Remove the pocket computer's current upgrade.

### Returns

  1. `boolean` If the upgrade was unequipped.
  2. `string` | nil The reason an upgrade was not unequipped.
Last updated on 2026-10-01

