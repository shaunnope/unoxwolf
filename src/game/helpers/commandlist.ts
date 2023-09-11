import { Context } from '~/bot/context'
import { getCommandEntries } from '~/bot/helpers/bot-commands'
import { Role } from '~/game/models/role'

export const getRoleListEntry = (ctx: Context, role: typeof Role) => {
  const nameKey = `${role.roleName}.name`
  return getCommandEntries({ command: role.info.command, description: ctx.t(nameKey) })
}
