import { Middleware } from 'grammy'
import { updateCounter, updateFailedCounter } from '~/metrics'
import type { Context } from '~/bot/context'

export const metrics = (): Middleware<Context> => async (ctx, next) => {
  try {
    updateCounter.inc({
      from_id: ctx.from?.id,
      chat_id: ctx.chat?.id,
    })
    return await next()
  } catch (e) {
    updateFailedCounter.inc({
      from_id: ctx.from?.id,
      chat_id: ctx.chat?.id,
    })
    throw e
  }
}
