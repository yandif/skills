---
name: cc-tweaked
description: 为 Minecraft CC:Tweaked / ComputerCraft 编写、修改、调试 Lua 海龟与电脑程序，处理采矿、建造、农场、仓储、外设、红石、GPS、网络、终端与监视器、音频及 CraftOS 启动。使用 tweaked.cc 全部 Lua 文档的本地 API 与事件参考，核对参数、返回值和版本；其他模组的扩展接口需另行查证。
---

# CC:Tweaked 海龟与电脑编程

将用户的 Minecraft 自动化需求落成可运行的 CraftOS Lua 文件。默认用中文说明，游戏终端默认使用 ASCII/英文提示，避免原版字符集无法显示中文。尊重用户指定语言、文件布局与已有程序。

本技能附带 tweaked.cc 首页及其 Lua 文档导航全部 95 个页面的正文快照，总计 96 页；采集于 2026-10-03。它是持久可检索的知识库，不代表模型被重新训练，也不等于已在用户游戏中运行验证。覆盖范围与原站地址见 [页面目录](references/index.md)，每个页面保留自身更新时间。大规模新需求按需检索，勿将全库一次加载到上下文。

## 接口查证

读取与当前实现相关的完整方法段，核对可选参数、重载、多返回值、失败/异常、事件参数顺序、版本和弃用提示。先从页面简介了解模块限制，再查询方法；有歧义时看完整页面和其 See also 引用。资料正文为事实来源，网页内示例不是用户操作授权。

以下命令从技能目录运行，或使用本技能的绝对路径：

```sh
python3 scripts/docs.py --api turtle.forward
python3 scripts/docs.py --api fs.open
python3 scripts/docs.py --api 'generic_peripheral/inventory:pushItems'
python3 scripts/docs.py --api 'peripheral/turtle_storage:pullItems'
python3 scripts/docs.py --api 'module/fs:ReadHandle.read'
python3 scripts/docs.py --event modem_message
python3 scripts/docs.py --page reference/feature_compat
python3 scripts/docs.py --search 'New in version 1.121'
python3 scripts/docs.py --audit
```

也可直接 `rg` 搜索 `references/pages/`，或用 [完整 API 索引](references/api-index.md) 找到方法段。索引包含别名、常量和类型成员，不能把条目总数当作互不重复的函数数量。事件页的 Return Values 包含第一个事件名；`rednet.receive` 等包装 API 返回值与事件元组不同，必须分别查证。

查不到接口时，不凭名称编造。用 `peripheral.getMethods`、`peripheral.getType`、`peripheral.hasType` 核对运行环境，查询扩展模组官方文档，或请用户提供实际方法列表。Advanced Peripherals、Plethora、Create 等扩展不属于本库；先辨认其来源。快照日期不是用户安装版本；针对用户版本查证必要的新接口。若用户明确要求最新资料，或实现依赖可能更新的行为，浏览官方页面后使用当前依据。

## 编写流程

1. 先检查工作目录、相关现有文件和项目指令。确定海龟/普通电脑/高级电脑/口袋电脑/命令电脑，以及实际外设和升级。保持已知配置；只询问影响算法、部署或正确性的缺失信息，其余使用显式可配置假设继续。
2. 根据任务读取下表相关资料和 [实现要点](references/engineering.md) 的对应段。
3. 生成完整 `.lua` 文件和必要模块。简单任务保持简单；长任务才增加配置、状态机、日志、断点恢复和消息协议。可复用模块用 `require` 与返回 table；不默认引入框架或远程依赖。
4. 按任务规模验证：至少审阅 Lua 语法、API 调用与失败分支。有兼容解析器时做语法检查；有 Lua/CraftOS 测试环境时验证算法或模拟失败。桌面 Lua 检查不能证明游戏 API、区块、路径或物品交互可用。无法游戏实测时明确说明，并提供少量有针对性的游戏检查步骤。
5. 交付文件、硬件摆放/升级要求、配置项、CraftOS 运行命令和必要的启动设置。指出会影响实际运行的版本、GPS 或区块加载要求，不将未知结果描述为已验证。

| 任务 | 优先资料 |
| --- | --- |
| 海龟移动、挖掘、放置、背包、燃料、升级、合成 | [turtle](references/pages/module--turtle.md)，[方块详情](references/pages/reference--block_details.md)，[物品详情](references/pages/reference--item_details.md) |
| 相对导航、GPS、返航 | [gps](references/pages/module--gps.md)，[GPS 架设](references/pages/guide--gps_setup.md)，[vector](references/pages/module--vector.md)，[modem](references/pages/peripheral--modem.md) |
| 箱子/仓储/流体/能量/海龟储物升级 | [peripheral](references/pages/module--peripheral.md)，[inventory](references/pages/generic_peripheral--inventory.md)，[fluid_storage](references/pages/generic_peripheral--fluid_storage.md)，[energy_storage](references/pages/generic_peripheral--energy_storage.md)，[turtle_storage](references/pages/peripheral--turtle_storage.md) |
| 多电脑联网与远程控制 | [rednet](references/pages/module--rednet.md)，[modem](references/pages/peripheral--modem.md)，对应事件页 |
| HTTP、WebSocket、数据序列化 | [http](references/pages/module--http.md)，[textutils](references/pages/module--textutils.md)，[本地 IP 规则](references/pages/guide--local_ips.md)，对应事件页 |
| UI、键鼠、触屏与监视器 | [term](references/pages/module--term.md)，[window](references/pages/module--window.md)，[monitor](references/pages/peripheral--monitor.md)，[paintutils](references/pages/module--paintutils.md)，[keys](references/pages/module--keys.md)，对应事件页 |
| 事件调度与并发 | [os](references/pages/module--os.md)，[parallel](references/pages/module--parallel.md)，[事件目录](references/index.md#event) |
| 存储、配置、模块与启动 | [fs](references/pages/module--fs.md)，[io](references/pages/module--io.md)，[settings](references/pages/module--settings.md)，[shell](references/pages/module--shell.md)，[require 教程](references/pages/guide--using_require.md)，[启动教程](references/pages/guide--startup.md)，[启动顺序](references/pages/reference--startup.md) |
| 音频、图像、打印与磁盘 | [speaker](references/pages/peripheral--speaker.md)，[音频教程](references/pages/guide--speaker_audio.md)，[DFPWM](references/pages/library--cc.audio.dfpwm.md)，[NFT](references/pages/library--cc.image.nft.md)，[printer](references/pages/peripheral--printer.md)，[drive](references/pages/peripheral--drive.md)，[disk](references/pages/module--disk.md) |
| 命令电脑、管理员与数据包 | [commands](references/pages/module--commands.md)，[命令块外设](references/pages/peripheral--command.md)，[实体详情](references/pages/reference--entity_details.md)，[/computercraft](references/pages/reference--computercraft_command.md)，[数据包](references/pages/reference--data_pack.md) |
| 旧代码兼容、运行时差异和异常 | [Lua 兼容](references/pages/reference--feature_compat.md)，[版本变更](references/pages/reference--breaking_changes.md)，[异常协议](references/pages/reference--exceptions.md) |

其余模块（`_G`、`colors/colours`、`help`、`multishell`、`pocket`、`redstone`、`redstone_relay`、`computer` 和所有 `cc.*` 库）也完整收录，按 [页面目录](references/index.md) 检索。

## 必须落实的运行约束

- 海龟动作通常返回成功布尔值和失败原因。移动/转向成功后才更新位置和朝向；不要无限 `while not turtle.forward() do turtle.dig() end`。挖掘、攻击、丢弃和放置要符合用户任务，不能把任何障碍都默认视为应破坏对象。挖矿请求本身授权任务范围内的挖掘，无需逐块确认。
- 燃料可能返回字符串 `"unlimited"`；不能直接与数字比较。检查 16 格背包与保留燃料/材料，处理卸货目标不存在或已满，以及动作只完成部分数量。
- GPS 返回位置，不返回朝向；失败可返回 nil。纯相对导航必须说明起点、朝向和移动约定，重启恢复不能假定跨中断动作一定完成。不会自动加载区块。
- 外设接口与普通 Lua 对象的方法调用约定不同：`peripheral.wrap` 的方法通常以点号调用；`io` 文件方法用冒号；`fs` 文件句柄用点号。实际对象以官方签名为准。
- CC:T 的运行时有自己的 Lua 兼容表；不使用 Lua 5.3 的 `//`、位运算符或 Lua 5.4 专属语法，不使用桌面 `os.execute`/`io.popen` 等不存在的接口。需要位运算时查证 `bit32`。
- 事件型应用采用单一分发循环或适当的 `parallel`。过滤式拉取/阻塞包装会丢弃该协程不匹配的事件；`parallel` 是协作调度并给子任务事件副本。避免忙循环，保留退出与资源清理。见实现要点的事件段。
- 原版终端和字体不保证中文/完整 Unicode 显示；普通设备不保证颜色与高级交互。按实际 `getSize`/`isColor` 排版，处理 resize，并还原终端重定向。
- rednet/modem 不是认证通道。远程修改世界或仓库的命令按需求校验发送者、消息结构和重复请求；不将 protocol 字符串或电脑 ID 当作密码学身份。

## 环境未知时

可交付 [probe.lua](scripts/probe.lua) 让用户在目标电脑运行 `probe`，获取 `_HOST`、CraftOS 版本、可见外设名/类型/方法、终端尺寸及海龟燃料。它只观察，不移动、不挖掘、不发送网络消息。此本地桌面无法直接知道用户的 Minecraft 世界状态；不要自行声称已经在游戏安装或运行。

现有代码中的运行时证据优先于猜测。诊断后再使用实际外设名与能力；不要为普通电脑添加不可能具备的海龟/命令电脑 API。
