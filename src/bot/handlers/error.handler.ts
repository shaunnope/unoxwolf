import { ErrorHandler } from 'grammy'
import type { Context } from '../context'
import { getFullMetadata } from '../helpers/logging'

export const errorHandler: ErrorHandler<Context> = error => {
  const { ctx } = error
  const err = error.error

  ctx.logger.error({
    err,
    ...getFullMetadata(ctx),
  })
}
