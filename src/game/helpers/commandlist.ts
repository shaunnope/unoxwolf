import type { Context } from "~/bot/context"
import { getCommandEntries } from "~/bot/helpers/bot-commands"
import type { Role } from "~/game/models/role"

export function getRoleListEntry(ctx: Context, role: typeof Role) {
  const nameKey = `${role.roleName}.name`
  return getCommandEntries({ command: role.info.command, description: ctx.t(nameKey) })
}
