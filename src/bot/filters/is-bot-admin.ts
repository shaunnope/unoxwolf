import { isUserHasId } from 'grammy-guard'
import { config } from '~/config'
import { Context, ContextScopeWith } from '../context'

export const isAdminUser = <C extends Context>(ctx: C): ctx is C & ContextScopeWith<'user'> => {
  return ctx.scope.user?.isAdmin === true
}

export const isOwnerUser = isUserHasId(config.BOT_OWNER_USER_ID)
