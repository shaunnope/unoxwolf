import { Context } from '~/bot/context'
import { Role } from '../models/player'

export const getRoleListEntry = (ctx: Context, role: typeof Role) => {
  const nameKey = `${role.roleName}.name`
  return `/${role.info.command} - ${ctx.t(nameKey)}`
}
