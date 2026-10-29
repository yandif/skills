Source: https://tweaked.cc/library/cc.image.nft.html
Snapshot: 2026-10-03; site footer: 2026-09-17.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# cc.image.nft

Read and draw nft ("Nitrogen Fingers Text") images.

nft ("Nitrogen Fingers Text") is a file format for drawing basic images. Unlike the images that `paintutils.parseImage` uses, nft supports coloured text as well as simple coloured pixels.

### Usage

  * Load an image from `example.nft` and draw it.

    local nft = require "cc.image.nft"
    local image = assert(nft.load ("data/example.nft"))
    nft.draw (image, term.getCursorPos ())
### Changes

  * New in version 1.90.0
parse(image) | Parse an nft image from a string.
load(path) | Load an nft image from a file.
draw(image, xPos, yPos [, target]) | Draw an nft image to the screen.

## parse(image)


Parse an nft image from a string.

### Parameters

  1. image `string` The image contents.

### Returns

  1. table The parsed image.
## load(path)


Load an nft image from a file.
### Parameters

  1. path `string` The file to load.

### Returns

  1. `table` The parsed image.

#### Or

  1. nil If the file does not exist or could not be loaded.
  2. `string` An error message explaining why the file could not be loaded.
## draw(image, xPos, yPos [, target])


Draw an nft image to the screen.
### Parameters

  1. image `table` An image, as returned from `load` or `parse` .
  2. xPos `number` The x position to start drawing at.
  3. yPos `number` The y position to start drawing at.
  4. target? `term.Redirect` The terminal redirect to draw to. Defaults to the current terminal.
Last updated on 2026-09-17

