import { isUserHasId } from "grammy-guard"
import type { Context, ContextScopeWith } from "~/bot/context"
import { config } from "~/config"

export function isAdminUser<C extends Context>(ctx: C): ctx is C & ContextScopeWith<"user"> {
  return ctx.scope.user?.isAdmin === true
}

export const isOwnerUser = isUserHasId(config.BOT_OWNER_USER_ID)
