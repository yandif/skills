# 官方文档的全部详细 API 条目

551 个带源码链接的详细条目，其中 509 个有调用签名；包含同义拼写、重复外设接口和类型方法，非互不重复函数数量。事件参数、类型说明、动态命令等其他内容请读完整页面。

使用 docs.py 可定位到精确方法段，支持 `--api module/fs:ReadHandle.read` 等有歧义名称。下表的行号对应本地 Markdown 文件，表内官网链接指向原页面。

## module/_G

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `sleep([time=0])` | [正文](pages/module--_G.md) | 15 |
| `write(text)` | [正文](pages/module--_G.md) | 46 |
| `print(...)` | [正文](pages/module--_G.md) | 65 |
| `printError(...)` | [正文](pages/module--_G.md) | 81 |
| `read([replaceChar [, history [, completeFn [, default]]]])` | [正文](pages/module--_G.md) | 93 |
| `_HOST` | [正文](pages/module--_G.md) | 137 |
| `_CC_DEFAULT_SETTINGS` | [正文](pages/module--_G.md) | 158 |

## module/colors

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `white = 0x1` | [正文](pages/module--colors.md) | 63 |
| `orange = 0x2` | [正文](pages/module--colors.md) | 68 |
| `magenta = 0x4` | [正文](pages/module--colors.md) | 73 |
| `lightBlue = 0x8` | [正文](pages/module--colors.md) | 78 |
| `yellow = 0x10` | [正文](pages/module--colors.md) | 81 |
| `lime = 0x20` | [正文](pages/module--colors.md) | 86 |
| `pink = 0x40` | [正文](pages/module--colors.md) | 91 |
| `gray = 0x80` | [正文](pages/module--colors.md) | 94 |
| `lightGray = 0x100` | [正文](pages/module--colors.md) | 99 |
| `cyan = 0x200` | [正文](pages/module--colors.md) | 104 |
| `purple = 0x400` | [正文](pages/module--colors.md) | 107 |
| `blue = 0x800` | [正文](pages/module--colors.md) | 112 |
| `brown = 0x1000` | [正文](pages/module--colors.md) | 117 |
| `green = 0x2000` | [正文](pages/module--colors.md) | 120 |
| `red = 0x4000` | [正文](pages/module--colors.md) | 125 |
| `black = 0x8000` | [正文](pages/module--colors.md) | 130 |
| `combine(...)` | [正文](pages/module--colors.md) | 133 |
| `subtract(colors, ...)` | [正文](pages/module--colors.md) | 152 |
| `test(colors, color)` | [正文](pages/module--colors.md) | 175 |
| `packRGB(r, g, b)` | [正文](pages/module--colors.md) | 196 |
| `unpackRGB(rgb)` | [正文](pages/module--colors.md) | 218 |
| `rgb8(...)` | [正文](pages/module--colors.md) | 244 |
| `toBlit(color)` | [正文](pages/module--colors.md) | 281 |
| `fromBlit(hex)` | [正文](pages/module--colors.md) | 307 |

## module/colours

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `grey` | [正文](pages/module--colours.md) | 19 |
| `lightGrey` | [正文](pages/module--colours.md) | 26 |

## module/commands

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `exec(command)` | [正文](pages/module--commands.md) | 32 |
| `execAsync(command)` | [正文](pages/module--commands.md) | 55 |
| `list(...)` | [正文](pages/module--commands.md) | 78 |
| `getDimension()` | [正文](pages/module--commands.md) | 89 |
| `getBlockPosition()` | [正文](pages/module--commands.md) | 105 |
| `getBlockInfos(minX, minY, minZ, maxX, maxY, maxZ [, dimension])` | [正文](pages/module--commands.md) | 118 |
| `getBlockInfo(x, y, z [, dimension])` | [正文](pages/module--commands.md) | 164 |
| `getEntities(selector)` | [正文](pages/module--commands.md) | 188 |
| `native` | [正文](pages/module--commands.md) | 218 |
| `async` | [正文](pages/module--commands.md) | 225 |

## module/disk

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `isPresent(name)` | [正文](pages/module--disk.md) | 27 |
| `getLabel(name)` | [正文](pages/module--disk.md) | 43 |
| `setLabel(name, label)` | [正文](pages/module--disk.md) | 60 |
| `hasData(name)` | [正文](pages/module--disk.md) | 68 |
| `getMountPath(name)` | [正文](pages/module--disk.md) | 85 |
| `hasAudio(name)` | [正文](pages/module--disk.md) | 100 |
| `getAudioTitle(name)` | [正文](pages/module--disk.md) | 113 |
| `playAudio(name)` | [正文](pages/module--disk.md) | 126 |
| `stopAudio(name)` | [正文](pages/module--disk.md) | 139 |
| `eject(name)` | [正文](pages/module--disk.md) | 147 |
| `getID(name)` | [正文](pages/module--disk.md) | 159 |

## module/fs

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `complete(...)` | [正文](pages/module--fs.md) | 41 |
| `find(path)` | [正文](pages/module--fs.md) | 87 |
| `isDriveRoot(path)` | [正文](pages/module--fs.md) | 120 |
| `list(path)` | [正文](pages/module--fs.md) | 145 |
| `combine(path, ...)` | [正文](pages/module--fs.md) | 170 |
| `getName(path)` | [正文](pages/module--fs.md) | 197 |
| `getDir(path)` | [正文](pages/module--fs.md) | 219 |
| `getSize(path)` | [正文](pages/module--fs.md) | 241 |
| `exists(path)` | [正文](pages/module--fs.md) | 260 |
| `isDir(path)` | [正文](pages/module--fs.md) | 272 |
| `isReadOnly(path)` | [正文](pages/module--fs.md) | 283 |
| `makeDir(path)` | [正文](pages/module--fs.md) | 295 |
| `move(path, dest)` | [正文](pages/module--fs.md) | 307 |
| `copy(path, dest)` | [正文](pages/module--fs.md) | 322 |
| `delete(path)` | [正文](pages/module--fs.md) | 337 |
| `open(path, mode)` | [正文](pages/module--fs.md) | 351 |
| `getDrive(path)` | [正文](pages/module--fs.md) | 415 |
| `getFreeSpace(path)` | [正文](pages/module--fs.md) | 438 |
| `getCapacity(path)` | [正文](pages/module--fs.md) | 461 |
| `attributes(path)` | [正文](pages/module--fs.md) | 483 |
| `ReadWriteHandle.read([count])` | [正文](pages/module--fs.md) | 519 |
| `ReadWriteHandle.readAll()` | [正文](pages/module--fs.md) | 547 |
| `ReadWriteHandle.readLine([withTrailing])` | [正文](pages/module--fs.md) | 563 |
| `ReadWriteHandle.seek([whence [, offset]])` | [正文](pages/module--fs.md) | 582 |
| `ReadWriteHandle.write(...)` | [正文](pages/module--fs.md) | 612 |
| `ReadWriteHandle.writeLine(text)` | [正文](pages/module--fs.md) | 631 |
| `ReadWriteHandle.flush()` | [正文](pages/module--fs.md) | 644 |
| `ReadWriteHandle.close()` | [正文](pages/module--fs.md) | 652 |
| `WriteHandle.write(...)` | [正文](pages/module--fs.md) | 667 |
| `WriteHandle.writeLine(text)` | [正文](pages/module--fs.md) | 686 |
| `WriteHandle.flush()` | [正文](pages/module--fs.md) | 698 |
| `WriteHandle.seek([whence [, offset]])` | [正文](pages/module--fs.md) | 706 |
| `WriteHandle.close()` | [正文](pages/module--fs.md) | 736 |
| `ReadHandle.read([count])` | [正文](pages/module--fs.md) | 750 |
| `ReadHandle.readAll()` | [正文](pages/module--fs.md) | 778 |
| `ReadHandle.readLine([withTrailing])` | [正文](pages/module--fs.md) | 794 |
| `ReadHandle.seek([whence [, offset]])` | [正文](pages/module--fs.md) | 813 |
| `ReadHandle.close()` | [正文](pages/module--fs.md) | 843 |

## module/gps

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `CHANNEL_GPS = 65534` | [正文](pages/module--gps.md) | 20 |
| `locate([timeout=2 [, debug=false]])` | [正文](pages/module--gps.md) | 25 |

## module/help

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `path()` | [正文](pages/module--help.md) | 16 |
| `setPath(newPath)` | [正文](pages/module--help.md) | 27 |
| `lookup(topic)` | [正文](pages/module--help.md) | 44 |
| `topics()` | [正文](pages/module--help.md) | 64 |
| `completeTopic(prefix)` | [正文](pages/module--help.md) | 76 |

## module/http

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `get(...)` | [正文](pages/module--http.md) | 23 |
| `post(...)` | [正文](pages/module--http.md) | 60 |
| `request(...)` | [正文](pages/module--http.md) | 90 |
| `checkURLAsync(url)` | [正文](pages/module--http.md) | 122 |
| `checkURL(url)` | [正文](pages/module--http.md) | 141 |
| `websocketAsync(...)` | [正文](pages/module--http.md) | 171 |
| `websocket(...)` | [正文](pages/module--http.md) | 195 |
| `Response.getResponseCode()` | [正文](pages/module--http.md) | 245 |
| `Response.getResponseHeaders()` | [正文](pages/module--http.md) | 257 |
| `Websocket.receive([timeout])` | [正文](pages/module--http.md) | 285 |
| `Websocket.send(message [, binary])` | [正文](pages/module--http.md) | 311 |
| `Websocket.close()` | [正文](pages/module--http.md) | 328 |
| `Websocket.getResponseHeaders()` | [正文](pages/module--http.md) | 333 |

## module/io

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `stdin` | [正文](pages/module--io.md) | 20 |
| `stdout` | [正文](pages/module--io.md) | 25 |
| `stderr` | [正文](pages/module--io.md) | 30 |
| `close([file])` | [正文](pages/module--io.md) | 36 |
| `flush()` | [正文](pages/module--io.md) | 52 |
| `input([file])` | [正文](pages/module--io.md) | 65 |
| `lines([filename, ...])` | [正文](pages/module--io.md) | 83 |
| `open(filename [, mode])` | [正文](pages/module--io.md) | 120 |
| `output([file])` | [正文](pages/module--io.md) | 150 |
| `read(...)` | [正文](pages/module--io.md) | 169 |
| `type(obj)` | [正文](pages/module--io.md) | 182 |
| `write(...)` | [正文](pages/module--io.md) | 193 |
| `Handle.close()` | [正文](pages/module--io.md) | 213 |
| `Handle.flush()` | [正文](pages/module--io.md) | 230 |
| `Handle.lines(...)` | [正文](pages/module--io.md) | 238 |
| `Handle.read(...)` | [正文](pages/module--io.md) | 274 |
| `Handle.seek([whence [, offset]])` | [正文](pages/module--io.md) | 294 |
| `Handle.setvbuf(mode [, size])` | [正文](pages/module--io.md) | 313 |
| `Handle.write(...)` | [正文](pages/module--io.md) | 331 |

## module/keys

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `getName(code)` | [正文](pages/module--keys.md) | 15 |

## module/multishell

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `getFocus()` | [正文](pages/module--multishell.md) | 22 |
| `setFocus(n)` | [正文](pages/module--multishell.md) | 35 |
| `getTitle(n)` | [正文](pages/module--multishell.md) | 50 |
| `setTitle(n, title)` | [正文](pages/module--multishell.md) | 64 |
| `getCurrent()` | [正文](pages/module--multishell.md) | 82 |
| `launch(tProgramEnv, sProgramPath, ...)` | [正文](pages/module--multishell.md) | 89 |
| `getCount()` | [正文](pages/module--multishell.md) | 114 |

## module/os

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `loadAPI(path)` | [正文](pages/module--os.md) | 32 |
| `unloadAPI(name)` | [正文](pages/module--os.md) | 53 |
| `pullEvent([filter])` | [正文](pages/module--os.md) | 70 |
| `pullEventRaw([filter])` | [正文](pages/module--os.md) | 113 |
| `sleep([time=0])` | [正文](pages/module--os.md) | 141 |
| `version()` | [正文](pages/module--os.md) | 148 |
| `run(env, path, ...)` | [正文](pages/module--os.md) | 166 |
| `queueEvent(name, ...)` | [正文](pages/module--os.md) | 192 |
| `startTimer(time)` | [正文](pages/module--os.md) | 204 |
| `cancelTimer(token)` | [正文](pages/module--os.md) | 225 |
| `setAlarm(time)` | [正文](pages/module--os.md) | 240 |
| `cancelAlarm(token)` | [正文](pages/module--os.md) | 263 |
| `shutdown()` | [正文](pages/module--os.md) | 278 |
| `reboot()` | [正文](pages/module--os.md) | 283 |
| `getComputerID()` | [正文](pages/module--os.md) | 288 |
| `computerID()` | [正文](pages/module--os.md) | 296 |
| `getComputerLabel()` | [正文](pages/module--os.md) | 303 |
| `computerLabel()` | [正文](pages/module--os.md) | 315 |
| `setComputerLabel([label])` | [正文](pages/module--os.md) | 326 |
| `clock()` | [正文](pages/module--os.md) | 338 |
| `time([locale])` | [正文](pages/module--os.md) | 349 |
| `day([locale])` | [正文](pages/module--os.md) | 385 |
| `epoch([locale])` | [正文](pages/module--os.md) | 407 |
| `date([format [, time]])` | [正文](pages/module--os.md) | 439 |

## module/paintutils

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `parseImage(image)` | [正文](pages/module--paintutils.md) | 17 |
| `loadImage(path)` | [正文](pages/module--paintutils.md) | 43 |
| `drawPixel(xPos, yPos [, colour])` | [正文](pages/module--paintutils.md) | 64 |
| `drawLine(startX, startY, endX, endY [, colour])` | [正文](pages/module--paintutils.md) | 77 |
| `drawBox(startX, startY, endX, endY [, colour])` | [正文](pages/module--paintutils.md) | 96 |
| `drawFilledBox(startX, startY, endX, endY [, colour])` | [正文](pages/module--paintutils.md) | 115 |
| `drawImage(image, xPos, yPos)` | [正文](pages/module--paintutils.md) | 134 |

## module/parallel

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `waitForAny(...)` | [正文](pages/module--parallel.md) | 30 |
| `waitForAll(...)` | [正文](pages/module--parallel.md) | 56 |

## module/peripheral

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `getNames()` | [正文](pages/module--peripheral.md) | 62 |
| `isPresent(name)` | [正文](pages/module--peripheral.md) | 75 |
| `getType(peripheral)` | [正文](pages/module--peripheral.md) | 93 |
| `hasType(peripheral, peripheral_type)` | [正文](pages/module--peripheral.md) | 115 |
| `getMethods(name)` | [正文](pages/module--peripheral.md) | 131 |
| `getName(peripheral)` | [正文](pages/module--peripheral.md) | 142 |
| `call(name, method, ...)` | [正文](pages/module--peripheral.md) | 157 |
| `wrap(name)` | [正文](pages/module--peripheral.md) | 177 |
| `find(ty [, filter])` | [正文](pages/module--peripheral.md) | 196 |

## module/pocket

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `equipBack()` | [正文](pages/module--pocket.md) | 64 |
| `unequipBack()` | [正文](pages/module--pocket.md) | 74 |

## module/rednet

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `CHANNEL_BROADCAST = 65535` | [正文](pages/module--rednet.md) | 40 |
| `CHANNEL_REPEAT = 65533` | [正文](pages/module--rednet.md) | 45 |
| `MAX_ID_CHANNELS = 65500` | [正文](pages/module--rednet.md) | 50 |
| `open(modem)` | [正文](pages/module--rednet.md) | 55 |
| `close([modem])` | [正文](pages/module--rednet.md) | 80 |
| `isOpen([modem])` | [正文](pages/module--rednet.md) | 95 |
| `send(recipient, message [, protocol])` | [正文](pages/module--rednet.md) | 114 |
| `broadcast(message [, protocol])` | [正文](pages/module--rednet.md) | 142 |
| `receive([protocol_filter [, timeout]])` | [正文](pages/module--rednet.md) | 163 |
| `host(protocol, hostname)` | [正文](pages/module--rednet.md) | 211 |
| `unhost(protocol)` | [正文](pages/module--rednet.md) | 232 |
| `lookup(protocol [, hostname [, timeout=2]])` | [正文](pages/module--rednet.md) | 243 |
| `run()` | [正文](pages/module--rednet.md) | 283 |

## module/redstone

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `getSides()` | [正文](pages/module--redstone.md) | 46 |
| `setOutput(side, on)` | [正文](pages/module--redstone.md) | 57 |
| `getOutput(side)` | [正文](pages/module--redstone.md) | 66 |
| `getInput(side)` | [正文](pages/module--redstone.md) | 81 |
| `setAnalogOutput(side, value)` | [正文](pages/module--redstone.md) | 92 |
| `setAnalogueOutput(side, value)` | [正文](pages/module--redstone.md) | 108 |
| `getAnalogOutput(side)` | [正文](pages/module--redstone.md) | 125 |
| `getAnalogueOutput(side)` | [正文](pages/module--redstone.md) | 144 |
| `getAnalogInput(side)` | [正文](pages/module--redstone.md) | 163 |
| `getAnalogueInput(side)` | [正文](pages/module--redstone.md) | 179 |
| `setBundledOutput(side, output)` | [正文](pages/module--redstone.md) | 194 |
| `getBundledOutput(side)` | [正文](pages/module--redstone.md) | 207 |
| `getBundledInput(side)` | [正文](pages/module--redstone.md) | 219 |
| `testBundledInput(side, mask)` | [正文](pages/module--redstone.md) | 234 |

## module/settings

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `define(name [, options])` | [正文](pages/module--settings.md) | 44 |
| `undefine(name)` | [正文](pages/module--settings.md) | 62 |
| `set(name, value)` | [正文](pages/module--settings.md) | 76 |
| `get(name [, default])` | [正文](pages/module--settings.md) | 96 |
| `getDetails(name)` | [正文](pages/module--settings.md) | 111 |
| `unset(name)` | [正文](pages/module--settings.md) | 125 |
| `clear()` | [正文](pages/module--settings.md) | 139 |
| `getNames()` | [正文](pages/module--settings.md) | 147 |
| `load([path=".settings"])` | [正文](pages/module--settings.md) | 154 |
| `save([path=".settings"])` | [正文](pages/module--settings.md) | 175 |

## module/shell

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `execute(command, ...)` | [正文](pages/module--shell.md) | 43 |
| `run(...)` | [正文](pages/module--shell.md) | 66 |
| `exit()` | [正文](pages/module--shell.md) | 93 |
| `dir()` | [正文](pages/module--shell.md) | 100 |
| `setDir(dir)` | [正文](pages/module--shell.md) | 109 |
| `path()` | [正文](pages/module--shell.md) | 127 |
| `setPath(path)` | [正文](pages/module--shell.md) | 140 |
| `resolve(path)` | [正文](pages/module--shell.md) | 153 |
| `resolveProgram(command)` | [正文](pages/module--shell.md) | 171 |
| `programs([include_hidden])` | [正文](pages/module--shell.md) | 194 |
| `complete(sLine)` | [正文](pages/module--shell.md) | 212 |
| `completeProgram(program)` | [正文](pages/module--shell.md) | 238 |
| `setCompletionFunction(program, complete)` | [正文](pages/module--shell.md) | 252 |
| `getCompletionInfo()` | [正文](pages/module--shell.md) | 278 |
| `getRunningProgram()` | [正文](pages/module--shell.md) | 287 |
| `setAlias(command, program)` | [正文](pages/module--shell.md) | 299 |
| `clearAlias(command)` | [正文](pages/module--shell.md) | 317 |
| `aliases()` | [正文](pages/module--shell.md) | 324 |
| `openTab(...)` | [正文](pages/module--shell.md) | 337 |
| `switchTab(id)` | [正文](pages/module--shell.md) | 368 |

## module/term

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `nativePaletteColour(colour)` | [正文](pages/module--term.md) | 65 |
| `nativePaletteColor(colour)` | [正文](pages/module--term.md) | 89 |
| `write(text)` | [正文](pages/module--term.md) | 114 |
| `scroll(y)` | [正文](pages/module--term.md) | 123 |
| `getCursorPos()` | [正文](pages/module--term.md) | 133 |
| `setCursorPos(x, y)` | [正文](pages/module--term.md) | 141 |
| `getCursorBlink()` | [正文](pages/module--term.md) | 150 |
| `setCursorBlink(blink)` | [正文](pages/module--term.md) | 161 |
| `getSize()` | [正文](pages/module--term.md) | 169 |
| `clear()` | [正文](pages/module--term.md) | 177 |
| `clearLine()` | [正文](pages/module--term.md) | 182 |
| `getTextColour()` | [正文](pages/module--term.md) | 187 |
| `getTextColor()` | [正文](pages/module--term.md) | 202 |
| `setTextColour(colour)` | [正文](pages/module--term.md) | 218 |
| `setTextColor(colour)` | [正文](pages/module--term.md) | 234 |
| `getBackgroundColour()` | [正文](pages/module--term.md) | 250 |
| `getBackgroundColor()` | [正文](pages/module--term.md) | 265 |
| `setBackgroundColour(colour)` | [正文](pages/module--term.md) | 280 |
| `setBackgroundColor(colour)` | [正文](pages/module--term.md) | 296 |
| `isColour()` | [正文](pages/module--term.md) | 312 |
| `isColor()` | [正文](pages/module--term.md) | 325 |
| `blit(text, textColour, backgroundColour)` | [正文](pages/module--term.md) | 338 |
| `setPaletteColour(...)` | [正文](pages/module--term.md) | 367 |
| `setPaletteColor(...)` | [正文](pages/module--term.md) | 403 |
| `getPaletteColour(colour)` | [正文](pages/module--term.md) | 441 |
| `getPaletteColor(colour)` | [正文](pages/module--term.md) | 458 |
| `redirect(target)` | [正文](pages/module--term.md) | 474 |
| `current()` | [正文](pages/module--term.md) | 498 |
| `native()` | [正文](pages/module--term.md) | 514 |
| `Redirect.write(text)` | [正文](pages/module--term.md) | 534 |
| `Redirect.scroll(y)` | [正文](pages/module--term.md) | 543 |
| `Redirect.getCursorPos()` | [正文](pages/module--term.md) | 553 |
| `Redirect.setCursorPos(x, y)` | [正文](pages/module--term.md) | 561 |
| `Redirect.getCursorBlink()` | [正文](pages/module--term.md) | 570 |
| `Redirect.setCursorBlink(blink)` | [正文](pages/module--term.md) | 581 |
| `Redirect.getSize()` | [正文](pages/module--term.md) | 589 |
| `Redirect.clear()` | [正文](pages/module--term.md) | 597 |
| `Redirect.clearLine()` | [正文](pages/module--term.md) | 602 |
| `Redirect.getTextColour()` | [正文](pages/module--term.md) | 607 |
| `Redirect.getTextColor()` | [正文](pages/module--term.md) | 622 |
| `Redirect.setTextColour(colour)` | [正文](pages/module--term.md) | 637 |
| `Redirect.setTextColor(colour)` | [正文](pages/module--term.md) | 653 |
| `Redirect.getBackgroundColour()` | [正文](pages/module--term.md) | 669 |
| `Redirect.getBackgroundColor()` | [正文](pages/module--term.md) | 684 |
| `Redirect.setBackgroundColour(colour)` | [正文](pages/module--term.md) | 699 |
| `Redirect.setBackgroundColor(colour)` | [正文](pages/module--term.md) | 715 |
| `Redirect.isColour()` | [正文](pages/module--term.md) | 731 |
| `Redirect.isColor()` | [正文](pages/module--term.md) | 744 |
| `Redirect.blit(text, textColour, backgroundColour)` | [正文](pages/module--term.md) | 757 |
| `Redirect.setPaletteColour(...)` | [正文](pages/module--term.md) | 786 |
| `Redirect.setPaletteColor(...)` | [正文](pages/module--term.md) | 822 |
| `Redirect.getPaletteColour(colour)` | [正文](pages/module--term.md) | 860 |
| `Redirect.getPaletteColor(colour)` | [正文](pages/module--term.md) | 877 |

## module/textutils

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `slowWrite(text [, rate])` | [正文](pages/module--textutils.md) | 28 |
| `slowPrint(sText [, nRate])` | [正文](pages/module--textutils.md) | 47 |
| `formatTime(nTime [, bTwentyFourHour])` | [正文](pages/module--textutils.md) | 64 |
| `pagedPrint(text [, free_lines])` | [正文](pages/module--textutils.md) | 86 |
| `tabulate(...)` | [正文](pages/module--textutils.md) | 110 |
| `pagedTabulate(...)` | [正文](pages/module--textutils.md) | 130 |
| `empty_json_array` | [正文](pages/module--textutils.md) | 155 |
| `json_null` | [正文](pages/module--textutils.md) | 169 |
| `serialize(t, opts)` | [正文](pages/module--textutils.md) | 183 |
| `serialise(t, opts)` | [正文](pages/module--textutils.md) | 224 |
| `unserialize(s)` | [正文](pages/module--textutils.md) | 265 |
| `unserialise(s)` | [正文](pages/module--textutils.md) | 286 |
| `serializeJSON(...)` | [正文](pages/module--textutils.md) | 307 |
| `serialiseJSON(...)` | [正文](pages/module--textutils.md) | 359 |
| `unserializeJSON(s [, options])` | [正文](pages/module--textutils.md) | 411 |
| `unserialiseJSON(s [, options])` | [正文](pages/module--textutils.md) | 458 |
| `urlEncode(str)` | [正文](pages/module--textutils.md) | 506 |
| `complete(sSearchText [, tSearchTable])` | [正文](pages/module--textutils.md) | 525 |

## module/turtle

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `craft([limit=64])` | [正文](pages/module--turtle.md) | 119 |
| `native` | [正文](pages/module--turtle.md) | 145 |
| `forward()` | [正文](pages/module--turtle.md) | 152 |
| `back()` | [正文](pages/module--turtle.md) | 160 |
| `up()` | [正文](pages/module--turtle.md) | 169 |
| `down()` | [正文](pages/module--turtle.md) | 177 |
| `turnLeft()` | [正文](pages/module--turtle.md) | 186 |
| `turnRight()` | [正文](pages/module--turtle.md) | 194 |
| `dig([side])` | [正文](pages/module--turtle.md) | 202 |
| `digUp([side])` | [正文](pages/module--turtle.md) | 220 |
| `digDown([side])` | [正文](pages/module--turtle.md) | 236 |
| `place([text])` | [正文](pages/module--turtle.md) | 251 |
| `placeUp([text])` | [正文](pages/module--turtle.md) | 269 |
| `placeDown([text])` | [正文](pages/module--turtle.md) | 289 |
| `drop([count])` | [正文](pages/module--turtle.md) | 309 |
| `dropUp([count])` | [正文](pages/module--turtle.md) | 332 |
| `dropDown([count])` | [正文](pages/module--turtle.md) | 356 |
| `select(slot)` | [正文](pages/module--turtle.md) | 380 |
| `getItemCount([slot])` | [正文](pages/module--turtle.md) | 401 |
| `getItemSpace([slot])` | [正文](pages/module--turtle.md) | 417 |
| `detect()` | [正文](pages/module--turtle.md) | 435 |
| `detectUp()` | [正文](pages/module--turtle.md) | 443 |
| `detectDown()` | [正文](pages/module--turtle.md) | 450 |
| `compare()` | [正文](pages/module--turtle.md) | 458 |
| `compareUp()` | [正文](pages/module--turtle.md) | 469 |
| `compareDown()` | [正文](pages/module--turtle.md) | 481 |
| `attack([side])` | [正文](pages/module--turtle.md) | 492 |
| `attackUp([side])` | [正文](pages/module--turtle.md) | 509 |
| `attackDown([side])` | [正文](pages/module--turtle.md) | 526 |
| `suck([count])` | [正文](pages/module--turtle.md) | 543 |
| `suckUp([count])` | [正文](pages/module--turtle.md) | 566 |
| `suckDown([count])` | [正文](pages/module--turtle.md) | 586 |
| `getFuelLevel()` | [正文](pages/module--turtle.md) | 607 |
| `refuel([count])` | [正文](pages/module--turtle.md) | 627 |
| `compareTo(slot)` | [正文](pages/module--turtle.md) | 676 |
| `transferTo(slot [, count])` | [正文](pages/module--turtle.md) | 695 |
| `getSelectedSlot()` | [正文](pages/module--turtle.md) | 717 |
| `getFuelLimit()` | [正文](pages/module--turtle.md) | 733 |
| `equipLeft()` | [正文](pages/module--turtle.md) | 754 |
| `equipRight()` | [正文](pages/module--turtle.md) | 776 |
| `getEquippedLeft()` | [正文](pages/module--turtle.md) | 799 |
| `getEquippedRight()` | [正文](pages/module--turtle.md) | 817 |
| `inspect()` | [正文](pages/module--turtle.md) | 835 |
| `inspectUp()` | [正文](pages/module--turtle.md) | 864 |
| `inspectDown()` | [正文](pages/module--turtle.md) | 880 |
| `getItemDetail([slot [, detailed]])` | [正文](pages/module--turtle.md) | 896 |

## module/vector

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `new(x, y, z)` | [正文](pages/module--vector.md) | 16 |
| `Vector:add(o)` | [正文](pages/module--vector.md) | 38 |
| `Vector:sub(o)` | [正文](pages/module--vector.md) | 56 |
| `Vector:mul(factor)` | [正文](pages/module--vector.md) | 75 |
| `Vector:div(factor)` | [正文](pages/module--vector.md) | 93 |
| `Vector:unm()` | [正文](pages/module--vector.md) | 111 |
| `Vector:dot(o)` | [正文](pages/module--vector.md) | 124 |
| `Vector:cross(o)` | [正文](pages/module--vector.md) | 140 |
| `Vector:length()` | [正文](pages/module--vector.md) | 157 |
| `Vector:normalize()` | [正文](pages/module--vector.md) | 164 |
| `Vector:round([tolerance])` | [正文](pages/module--vector.md) | 177 |
| `Vector:tostring()` | [正文](pages/module--vector.md) | 188 |
| `Vector:equals(other)` | [正文](pages/module--vector.md) | 202 |

## module/window

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `create(parent, nX, nY, nWidth, nHeight [, bStartVisible])` | [正文](pages/module--window.md) | 17 |
| `Window.write(sText)` | [正文](pages/module--window.md) | 61 |
| `Window.blit(sText, sTextColor, sBackgroundColor)` | [正文](pages/module--window.md) | 67 |
| `Window.clear()` | [正文](pages/module--window.md) | 73 |
| `Window.clearLine()` | [正文](pages/module--window.md) | 75 |
| `Window.getCursorPos()` | [正文](pages/module--window.md) | 77 |
| `Window.setCursorPos(x, y)` | [正文](pages/module--window.md) | 79 |
| `Window.setCursorBlink(blink)` | [正文](pages/module--window.md) | 86 |
| `Window.getCursorBlink()` | [正文](pages/module--window.md) | 90 |
| `Window.isColor()` | [正文](pages/module--window.md) | 92 |
| `Window.isColour()` | [正文](pages/module--window.md) | 94 |
| `Window.setTextColor(color)` | [正文](pages/module--window.md) | 96 |
| `Window.setTextColour(color)` | [正文](pages/module--window.md) | 102 |
| `Window.setPaletteColour(colour, r, g, b)` | [正文](pages/module--window.md) | 108 |
| `Window.setPaletteColor(colour, r, g, b)` | [正文](pages/module--window.md) | 115 |
| `Window.getPaletteColour(colour)` | [正文](pages/module--window.md) | 124 |
| `Window.getPaletteColor(colour)` | [正文](pages/module--window.md) | 130 |
| `Window.setBackgroundColor(color)` | [正文](pages/module--window.md) | 136 |
| `Window.setBackgroundColour(color)` | [正文](pages/module--window.md) | 142 |
| `Window.getSize()` | [正文](pages/module--window.md) | 146 |
| `Window.scroll(n)` | [正文](pages/module--window.md) | 148 |
| `Window.getTextColor()` | [正文](pages/module--window.md) | 154 |
| `Window.getTextColour()` | [正文](pages/module--window.md) | 156 |
| `Window.getBackgroundColor()` | [正文](pages/module--window.md) | 158 |
| `Window.getBackgroundColour()` | [正文](pages/module--window.md) | 160 |
| `Window.getLine(y)` | [正文](pages/module--window.md) | 162 |
| `Window.setVisible(visible)` | [正文](pages/module--window.md) | 182 |
| `Window.isVisible()` | [正文](pages/module--window.md) | 191 |
| `Window.redraw()` | [正文](pages/module--window.md) | 207 |
| `Window.restoreCursor()` | [正文](pages/module--window.md) | 214 |
| `Window.getPosition()` | [正文](pages/module--window.md) | 219 |
| `Window.reposition(new_x, new_y [, new_width, new_height [, new_parent]])` | [正文](pages/module--window.md) | 227 |

## library/cc.audio.dfpwm

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `make_encoder()` | [正文](pages/library--cc.audio.dfpwm.md) | 55 |
| `encode(input)` | [正文](pages/library--cc.audio.dfpwm.md) | 70 |
| `make_decoder()` | [正文](pages/library--cc.audio.dfpwm.md) | 87 |
| `decode(input)` | [正文](pages/library--cc.audio.dfpwm.md) | 116 |

## library/cc.base64

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `encode(str [, alt_chars="+/"])` | [正文](pages/library--cc.base64.md) | 22 |
| `decode(str [, alt_chars="+/"])` | [正文](pages/library--cc.base64.md) | 45 |

## library/cc.completion

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `choice(text, choices [, add_space])` | [正文](pages/library--cc.completion.md) | 21 |
| `peripheral(text [, add_space])` | [正文](pages/library--cc.completion.md) | 40 |
| `side(text [, add_space])` | [正文](pages/library--cc.completion.md) | 58 |
| `setting(text [, add_space])` | [正文](pages/library--cc.completion.md) | 76 |
| `command(text [, add_space])` | [正文](pages/library--cc.completion.md) | 94 |

## library/cc.expect

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `expect(index, value, ...)` | [正文](pages/library--cc.expect.md) | 33 |
| `field(tbl, index, ...)` | [正文](pages/library--cc.expect.md) | 51 |
| `range(num [, min=-math.huge [, max=math.huge]])` | [正文](pages/library--cc.expect.md) | 69 |

## library/cc.image.nft

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `parse(image)` | [正文](pages/library--cc.image.nft.md) | 25 |
| `load(path)` | [正文](pages/library--cc.image.nft.md) | 37 |
| `draw(image, xPos, yPos [, target])` | [正文](pages/library--cc.image.nft.md) | 53 |

## library/cc.pretty

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `empty` | [正文](pages/library--cc.pretty.md) | 39 |
| `space` | [正文](pages/library--cc.pretty.md) | 44 |
| `line` | [正文](pages/library--cc.pretty.md) | 49 |
| `space_line` | [正文](pages/library--cc.pretty.md) | 54 |
| `text(text [, colour])` | [正文](pages/library--cc.pretty.md) | 59 |
| `concat(...)` | [正文](pages/library--cc.pretty.md) | 79 |
| `nest(depth, doc)` | [正文](pages/library--cc.pretty.md) | 98 |
| `group(doc)` | [正文](pages/library--cc.pretty.md) | 126 |
| `write(doc [, ribbon_frac=0.6])` | [正文](pages/library--cc.pretty.md) | 146 |
| `print(doc [, ribbon_frac=0.6])` | [正文](pages/library--cc.pretty.md) | 154 |
| `render(doc [, width [, ribbon_frac=0.6]])` | [正文](pages/library--cc.pretty.md) | 162 |
| `pretty(obj [, options])` | [正文](pages/library--cc.pretty.md) | 174 |
| `pretty_print(obj [, options [, ribbon_frac=0.6]])` | [正文](pages/library--cc.pretty.md) | 207 |

## library/cc.require

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `make(env, dir)` | [正文](pages/library--cc.require.md) | 30 |

## library/cc.shell.completion

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `file(shell, text)` | [正文](pages/library--cc.shell.completion.md) | 42 |
| `dir(shell, text)` | [正文](pages/library--cc.shell.completion.md) | 54 |
| `dirOrFile(shell, text, previous [, add_space])` | [正文](pages/library--cc.shell.completion.md) | 66 |
| `program(shell, text)` | [正文](pages/library--cc.shell.completion.md) | 80 |
| `programWithArgs(shell, text, previous, starting)` | [正文](pages/library--cc.shell.completion.md) | 96 |
| `help` | [正文](pages/library--cc.shell.completion.md) | 113 |
| `choice` | [正文](pages/library--cc.shell.completion.md) | 118 |
| `peripheral` | [正文](pages/library--cc.shell.completion.md) | 123 |
| `side` | [正文](pages/library--cc.shell.completion.md) | 128 |
| `setting` | [正文](pages/library--cc.shell.completion.md) | 132 |
| `command` | [正文](pages/library--cc.shell.completion.md) | 137 |
| `build(...)` | [正文](pages/library--cc.shell.completion.md) | 142 |

## library/cc.strings

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `wrap(text [, width])` | [正文](pages/library--cc.strings.md) | 19 |
| `ensure_width(line [, width])` | [正文](pages/library--cc.strings.md) | 43 |
| `split(str, deliminator [, plain=false [, limit]])` | [正文](pages/library--cc.strings.md) | 61 |

## peripheral/command

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `getCommand()` | [正文](pages/peripheral--command.md) | 17 |
| `setCommand(command)` | [正文](pages/peripheral--command.md) | 22 |
| `runCommand()` | [正文](pages/peripheral--command.md) | 30 |

## peripheral/computer

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `turnOn()` | [正文](pages/peripheral--computer.md) | 17 |
| `shutdown()` | [正文](pages/peripheral--computer.md) | 22 |
| `reboot()` | [正文](pages/peripheral--computer.md) | 27 |
| `getID()` | [正文](pages/peripheral--computer.md) | 32 |
| `isOn()` | [正文](pages/peripheral--computer.md) | 43 |
| `getLabel()` | [正文](pages/peripheral--computer.md) | 51 |

## peripheral/drive

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `isDiskPresent()` | [正文](pages/peripheral--drive.md) | 45 |
| `getDiskLabel()` | [正文](pages/peripheral--drive.md) | 52 |
| `setDiskLabel([label])` | [正文](pages/peripheral--drive.md) | 59 |
| `hasData()` | [正文](pages/peripheral--drive.md) | 75 |
| `getMountPath()` | [正文](pages/peripheral--drive.md) | 83 |
| `hasAudio()` | [正文](pages/peripheral--drive.md) | 91 |
| `getAudioTitle()` | [正文](pages/peripheral--drive.md) | 98 |
| `playAudio()` | [正文](pages/peripheral--drive.md) | 106 |
| `stopAudio()` | [正文](pages/peripheral--drive.md) | 111 |
| `ejectDisk()` | [正文](pages/peripheral--drive.md) | 118 |
| `getDiskID()` | [正文](pages/peripheral--drive.md) | 123 |

## peripheral/modem

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `open(channel)` | [正文](pages/peripheral--modem.md) | 147 |
| `isOpen(channel)` | [正文](pages/peripheral--modem.md) | 161 |
| `close(channel)` | [正文](pages/peripheral--modem.md) | 177 |
| `closeAll()` | [正文](pages/peripheral--modem.md) | 189 |
| `transmit(channel, replyChannel, payload)` | [正文](pages/peripheral--modem.md) | 194 |
| `isWireless()` | [正文](pages/peripheral--modem.md) | 218 |
| `getNamesRemote()` | [正文](pages/peripheral--modem.md) | 227 |
| `isPresentRemote(name)` | [正文](pages/peripheral--modem.md) | 240 |
| `getTypeRemote(name)` | [正文](pages/peripheral--modem.md) | 259 |
| `hasTypeRemote(name, type)` | [正文](pages/peripheral--modem.md) | 282 |
| `getMethodsRemote(name)` | [正文](pages/peripheral--modem.md) | 306 |
| `callRemote(remoteName, method, ...)` | [正文](pages/peripheral--modem.md) | 325 |
| `getNameLocal()` | [正文](pages/peripheral--modem.md) | 345 |

## peripheral/monitor

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `setTextScale(scale)` | [正文](pages/peripheral--monitor.md) | 94 |
| `getTextScale()` | [正文](pages/peripheral--monitor.md) | 109 |
| `write(text)` | [正文](pages/peripheral--monitor.md) | 124 |
| `scroll(y)` | [正文](pages/peripheral--monitor.md) | 133 |
| `getCursorPos()` | [正文](pages/peripheral--monitor.md) | 143 |
| `setCursorPos(x, y)` | [正文](pages/peripheral--monitor.md) | 151 |
| `getCursorBlink()` | [正文](pages/peripheral--monitor.md) | 160 |
| `setCursorBlink(blink)` | [正文](pages/peripheral--monitor.md) | 171 |
| `getSize()` | [正文](pages/peripheral--monitor.md) | 179 |
| `clear()` | [正文](pages/peripheral--monitor.md) | 187 |
| `clearLine()` | [正文](pages/peripheral--monitor.md) | 192 |
| `getTextColour()` | [正文](pages/peripheral--monitor.md) | 197 |
| `getTextColor()` | [正文](pages/peripheral--monitor.md) | 212 |
| `setTextColour(colour)` | [正文](pages/peripheral--monitor.md) | 228 |
| `setTextColor(colour)` | [正文](pages/peripheral--monitor.md) | 244 |
| `getBackgroundColour()` | [正文](pages/peripheral--monitor.md) | 260 |
| `getBackgroundColor()` | [正文](pages/peripheral--monitor.md) | 275 |
| `setBackgroundColour(colour)` | [正文](pages/peripheral--monitor.md) | 290 |
| `setBackgroundColor(colour)` | [正文](pages/peripheral--monitor.md) | 306 |
| `isColour()` | [正文](pages/peripheral--monitor.md) | 322 |
| `isColor()` | [正文](pages/peripheral--monitor.md) | 335 |
| `blit(text, textColour, backgroundColour)` | [正文](pages/peripheral--monitor.md) | 348 |
| `setPaletteColour(...)` | [正文](pages/peripheral--monitor.md) | 377 |
| `setPaletteColor(...)` | [正文](pages/peripheral--monitor.md) | 413 |
| `getPaletteColour(colour)` | [正文](pages/peripheral--monitor.md) | 451 |
| `getPaletteColor(colour)` | [正文](pages/peripheral--monitor.md) | 468 |

## peripheral/printer

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `write(text)` | [正文](pages/peripheral--printer.md) | 84 |
| `getCursorPos()` | [正文](pages/peripheral--printer.md) | 96 |
| `setCursorPos(x, y)` | [正文](pages/peripheral--printer.md) | 109 |
| `getPageSize()` | [正文](pages/peripheral--printer.md) | 123 |
| `newPage()` | [正文](pages/peripheral--printer.md) | 136 |
| `endPage()` | [正文](pages/peripheral--printer.md) | 144 |
| `setPageTitle([title])` | [正文](pages/peripheral--printer.md) | 157 |
| `getInkLevel()` | [正文](pages/peripheral--printer.md) | 169 |
| `getPaperLevel()` | [正文](pages/peripheral--printer.md) | 177 |

## peripheral/redstone_relay

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `setOutput(side, on)` | [正文](pages/peripheral--redstone_relay.md) | 56 |
| `getOutput(side)` | [正文](pages/peripheral--redstone_relay.md) | 64 |
| `getInput(side)` | [正文](pages/peripheral--redstone_relay.md) | 79 |
| `setAnalogOutput(side, value)` | [正文](pages/peripheral--redstone_relay.md) | 91 |
| `setAnalogueOutput(side, value)` | [正文](pages/peripheral--redstone_relay.md) | 107 |
| `getAnalogOutput(side)` | [正文](pages/peripheral--redstone_relay.md) | 123 |
| `getAnalogueOutput(side)` | [正文](pages/peripheral--redstone_relay.md) | 143 |
| `getAnalogInput(side)` | [正文](pages/peripheral--redstone_relay.md) | 162 |
| `getAnalogueInput(side)` | [正文](pages/peripheral--redstone_relay.md) | 177 |
| `setBundledOutput(side, output)` | [正文](pages/peripheral--redstone_relay.md) | 193 |
| `getBundledOutput(side)` | [正文](pages/peripheral--redstone_relay.md) | 206 |
| `getBundledInput(side)` | [正文](pages/peripheral--redstone_relay.md) | 217 |
| `testBundledInput(side, mask)` | [正文](pages/peripheral--redstone_relay.md) | 233 |

## peripheral/speaker

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `playNote(instrument [, volume [, pitch]])` | [正文](pages/peripheral--speaker.md) | 45 |
| `playSound(name [, volume [, pitch]])` | [正文](pages/peripheral--speaker.md) | 72 |
| `playAudio(audio [, volume])` | [正文](pages/peripheral--speaker.md) | 100 |
| `stop()` | [正文](pages/peripheral--speaker.md) | 144 |

## peripheral/turtle_storage

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `size()` | [正文](pages/peripheral--turtle_storage.md) | 19 |
| `list()` | [正文](pages/peripheral--turtle_storage.md) | 26 |
| `getItemDetail(slot)` | [正文](pages/peripheral--turtle_storage.md) | 40 |
| `pushItems(fromSlot [, limit [, toSlot]])` | [正文](pages/peripheral--turtle_storage.md) | 60 |
| `pullItems([fromSlot [, limit [, toSlot]]])` | [正文](pages/peripheral--turtle_storage.md) | 78 |

## generic_peripheral/energy_storage

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `getEnergy()` | [正文](pages/generic_peripheral--energy_storage.md) | 20 |
| `getEnergyCapacity()` | [正文](pages/generic_peripheral--energy_storage.md) | 28 |

## generic_peripheral/fluid_storage

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `tanks()` | [正文](pages/generic_peripheral--fluid_storage.md) | 15 |
| `pushFluid(toName [, limit [, fluidName]])` | [正文](pages/generic_peripheral--fluid_storage.md) | 25 |
| `pullFluid(fromName [, limit [, fluidName]])` | [正文](pages/generic_peripheral--fluid_storage.md) | 47 |

## generic_peripheral/inventory

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `size()` | [正文](pages/generic_peripheral--inventory.md) | 16 |
| `list()` | [正文](pages/generic_peripheral--inventory.md) | 23 |
| `getItemDetail(slot)` | [正文](pages/generic_peripheral--inventory.md) | 45 |
| `getItemLimit(slot)` | [正文](pages/generic_peripheral--inventory.md) | 77 |
| `pushItems(toName, fromSlot [, limit [, toSlot]])` | [正文](pages/generic_peripheral--inventory.md) | 108 |
| `pullItems(fromName, fromSlot [, limit [, toSlot]])` | [正文](pages/generic_peripheral--inventory.md) | 141 |

## event/file_transfer

| 签名 | 本地参考 | 行号 |
| --- | --- | ---: |
| `TransferredFiles.getFiles()` | [正文](pages/event--file_transfer.md) | 49 |
| `TransferredFile.getName()` | [正文](pages/event--file_transfer.md) | 67 |
