import { Context } from "grammy"
import type { CommandContext } from "grammy"

// HACK: Override the implementation of `ctx.has.command` for case-insensitive handling of bot commands
type MaybeArray<T> = T | T[]
type StringWithSuggestions<S extends string> = (string & Record<never, never>) | S

function toArray<E>(e: MaybeArray<E>): E[] {
  return Array.isArray(e) ? e : [e]
}

const customChecker = Context.has
function customCommand<S extends string>(
  command: MaybeArray<StringWithSuggestions<S | "start" | "help" | "settings">>,
): <C extends Context>(ctx: C) => ctx is CommandContext<C> {
  const hasEntities = customChecker.filterQuery(":entities:bot_command")
  const atCommands = new Set<string>()
  const noAtCommands = new Set<string>()
  toArray(command).forEach((cmd) => {
    if (cmd.startsWith("/")) {
      throw new Error(`Do not include '/' when registering command handlers (use '${cmd.substring(1)}' not '${cmd}')`)
    }
    const set = !cmd.includes("@") ? noAtCommands : atCommands
    set.add(cmd)
  })
  return <C extends Context>(ctx: C): ctx is CommandContext<C> => {
    if (!hasEntities(ctx))
      return false
    const msg = ctx.message ?? ctx.channelPost
    const txt = msg.text ?? msg.caption
    return msg.entities.some((e) => {
      if (e.type !== "bot_command")
        return false
      if (e.offset !== 0)
        return false
      const cmd = txt.substring(1, e.length)
      if (noAtCommands.has(cmd) || atCommands.has(cmd)) {
        ctx.match = txt.substring(cmd.length + 1).trimStart()
        return true
      }
      const index = cmd.indexOf("@")
      if (index === -1)
        return false
      const atTarget = cmd.substring(index + 1)
      if (atTarget.toLowerCase() !== ctx.me.username.toLowerCase())
        return false
      const atCommand = cmd.substring(0, index)
      if (noAtCommands.has(atCommand)) {
        ctx.match = txt.substring(cmd.length + 1).trimStart()
        return true
      }
      return false
    })
  }
}
customChecker.command = customCommand

export { customChecker }
