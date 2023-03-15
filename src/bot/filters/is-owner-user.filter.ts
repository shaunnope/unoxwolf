import { Context, ContextScopeWith } from '../context'

export const isOwnerUser = <C extends Context>(ctx: C): ctx is C & ContextScopeWith<'user'> => {
  return ctx.scope.user?.isOwner === true
}
