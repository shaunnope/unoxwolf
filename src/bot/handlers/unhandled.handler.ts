import type { Context } from '../context'

export const unhandledHandler = <C extends Context>(ctx: C) => ctx.chat && ctx.reply(ctx.t('unhandled'))
