import type { Middleware } from "grammy"
import type { Context } from "~/bot/context"
import { getFullMetadata } from "~/bot/helpers/logging"

export function updateLogger(): Middleware<Context> {
  return (ctx, next) => {
    ctx.api.config.use((prev, method, payload, signal) => {
      ctx.logger.trace({
        msg: "bot api call",
        method,
        payload,
      })

      return prev(method, payload, signal)
    })

    ctx.logger.trace({
      msg: "update received",
      ...getFullMetadata(ctx),
    })

    return next()
  }
}
