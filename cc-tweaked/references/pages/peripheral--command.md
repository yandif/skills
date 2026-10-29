Source: https://tweaked.cc/peripheral/command.html
Snapshot: 2026-10-03; site footer: 2026-09-28.
Rendered official documentation; navigation removed, link labels retained. See ../upstream-notice.md.

# command

This peripheral allows you to interact with command blocks.

Command blocks are only wrapped as peripherals if the `enable_command_block` option is true within the config.

This API is not the same as the `commands` API, which is exposed on command computers.

getCommand() | Get the command this command block will run.
setCommand(command) | Set the command block's command.
runCommand() | Execute the command block once.

## getCommand()
Get the command this command block will run.
### Returns

  1. `string` The current command.
## setCommand(command)


Set the command block's command.

### Parameters

  1. command `string` The new command.
## runCommand()


Execute the command block once.

### Returns

  1. `boolean` If the command completed successfully.
  2. `string` | nil A failure message.
Last updated on 2026-09-28

