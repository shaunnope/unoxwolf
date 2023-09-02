import { Composer } from 'grammy'
import type { Context } from '~/bot/context'

import { logHandle } from '~/bot/helpers/logging'

const composer = new Composer<Context>()

composer.on(':text', logHandle('unhandled'), ctx => ctx.reply(ctx.t('unhandled')))

export { composer as unhandledHandler }
